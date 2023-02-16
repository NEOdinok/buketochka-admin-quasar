<template>
  <q-form
    ref="createProductForm"
    @submit="submitHandler"
  >
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <div class="q-pa-md">
          <q-input
            outlined
            label="Product name"
            class="q-pb-lg"
            v-model="state.productName"
            error-message="Product name is required"
            bottom-slots
            :error="v$.productName.$invalid && v$.productName.$dirty"
            @update:model="v$.productName.$touch()"
          />

          <q-input
            outlined
            label="Product price"
            class="q-pb-lg"
            v-model="state.productPrice"
            error-message="Please enter valid price"
            bottom-slots
            :error="v$.productPrice.$invalid && v$.productPrice.$dirty"
            @update:model-value="v$.productPrice.$touch()"
          />

          <q-input
            class="q-pb-lg"
            label="Product quantity"
            v-model="state.productQuantity"
            error-message="Please enter valid quantity"
            outlined
            bottom-slots
            :error="v$.productQuantity.$invalid && v$.productQuantity.$dirty"
            @update:model-value="v$.productQuantity.$touch()"
          />

          <q-select
            outlined
            label="Parent category"
            class="q-pb-lg"
            error-message="Please select a parent category"
            v-if="categoriesQselectOptions.length"
            :options="categoriesQselectOptions"
            v-model="selectedCategory"
            :error="v$.productCategory.$invalid && v$.productCategory.$dirty"
            @update:model-value="v$.productCategory.$touch()"
          />

          <p v-else>No product categories</p>

          <q-select
            outlined
            label="Product Subcategory"
            class="q-pb-lg"
            v-if="subCategoriesQselectOptions.length"
            v-model="selectedSubCategory"
            :options="subCategoriesQselectOptions"
            error-message="Please select a subcategory"
            :error="v$.productSubCategory.$invalid && v$.productSubCategory.$dirty"
            @update:model-value="v$.productSubCategory.$touch()"
          />

          <q-input
            filled
            clearable
            autogrow
            type="textarea"
            color="primary"
            label="Product Description"
            v-model="state.productDescription"
            error-message="Please enter product description"
            :error="v$.productDescription.$invalid && v$.productDescription.$dirty"
            @update:model-value="v$.productDescription.$touch()"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <div class="q-pa-md">
          <q-carousel
            v-model="urlOfCurrentSlideImage"

            transition-prev="jump-right"
            transition-next="jump-left"
            animated
            control-color="white"
            prev-icon="arrow_left"
            next-icon="arrow_right"
            :thumbnails="imageUrls.length != 0"
            infinite
            height="300px"
            class="bg-primary text-white shadow-1 rounded-borders"
          >
            <q-carousel-slide v-if="imageUrls.length != 0" v-for="(url, i) in imageUrls" :name="url" :img-src="url">
              <div v-if="currentImageIsMain" class="custom-caption absolute-top">
                <div class="text-h2">Main Image</div>
              </div>
            </q-carousel-slide>

            <q-carousel-slide v-else name="blank" class="column no-wrap flex-center">
              <q-icon name="image" size="56px" />
              <div class="q-mt-md text-center">
                Add product images below
              </div>
            </q-carousel-slide>
          </q-carousel>

          <div v-if="imageUrls.length != 0" class="row q-gutter-sm q-pt-md">
            <q-btn
              unelevated
              rounded
              align="between"
              icon-right="delete"
              color="primary"
              label="Remove"
              @click="removeImage"
            />

            <q-btn
              unelevated
              rounded
              align="between"
              icon-right="image"
              color="primary"
              label="Set as main"
              @click="updateMainImage"
            />

          </div>

          <FirebaseUpload
            @onImagesUploaded="handleUploadedImages"
          />

            <q-btn
              unelevated
              rounded
              align="between"
              icon-right="check"
              color="primary"
              label="create product"
              type="submit"
            />

        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { useFirebase } from 'src/composables/useFirebase';
import { onMounted, ref, watch, reactive, unref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, integer, minValue } from '@vuelidate/validators'
import FirebaseUpload from './FirebaseUpload.vue'
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase'
import { useNotifications } from 'src/composables/useNotifications';

const { getCategoryDocsFromFirebase, getSubcategoryDocsFromFirebase, createProductInFirebase } = useFirebase()
const { updateMainImageInFirebase, removeImageFromFirebaseStorage } = useFirestoreDatabase()
const { triggerNegative, triggerPositive } = useNotifications()
const categories = ref([])
const categoriesQselectOptions = ref([])
const subcategories = ref([])
const subCategoriesQselectOptions = ref([])
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const createProductForm = ref('')

const urlOfCurrentSlideImage = ref('blank')
const currentMainImageObj = ref(null)
const currentImageIsMain = ref(false)
const imagesData = ref([])
const imageUrls = ref([])

const state = reactive({
  productName: '',
  productPrice: '',
  productQuantity: '',
  productCategory: '',
  productSubCategory: '',
  productDescription: '',
})

const rules = {
  productName: { required, $lazy: true },
  productPrice: { required, integer, minValue: minValue(1), $lazy: true },
  productQuantity: { required, integer, minValue: minValue(1), $lazy: true },
  productCategory: { required, $lazy: true },
  productSubCategory: { required, $lazy: true },
  productDescription: { required, $lazy: true },
}

const v$ = useVuelidate(rules, state)

const submitHandler = async () => {
  try {
    const isFormCorrect = await unref(v$).$validate()
    if (!isFormCorrect) {
      triggerNegative('Fill in all the fields')
    } else if (imagesData.value.length == 0) {
      triggerNegative('Please upload product images')
    } else if (!currentMainImageObj.value) {
      triggerNegative('Please select a main image')
    } else {
      const productData = {
        name: state.productName,
        price: state.productPrice,
        quantity: state.productQuantity,
        category: selectedCategory.value,
        subCategory: selectedSubCategory.value,
        description: state.productDescription,
        imagesData: {...imagesData.value}
      }
      await createProductInFirebase(productData)
      triggerPositive(`Product ${productData.name} created`)
      resetForm()
    }
  } catch (error) {
    console.warn({error})
  }

}

watch(urlOfCurrentSlideImage, (newUrl) => {
  const foundImageObj = imagesData.value.find(imgObj => imgObj.url == newUrl)

  if (foundImageObj && foundImageObj.isMain == 'true') {
    currentImageIsMain.value = true
  } else {
    currentImageIsMain.value = false
  }
})

onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    categories.value = categoriesData.value
  } catch(error) {
    console.warn({error})
  }
})

watch(categories, () => {
  categoriesQselectOptions.value = categories.value.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

watch(selectedSubCategory, (newSubCategory) => {
  try {
    if (newSubCategory) {
      state.productSubCategory = newSubCategory
    } else {
      state.productSubCategory = ''
      return
    }
  } catch (error) {
    console.warn({ error })
  }
  state.productSubCategory = newSubCategory
})

watch(selectedCategory, async (newCategory) => {
  try {
    if (newCategory) {
      state.productCategory = newCategory
    } else {
      state.productCategory = ''
      subCategoriesQselectOptions.value = []
      return
    }

    subCategoriesQselectOptions.value = []
    selectedSubCategory.value = ''

    const { subcategoriesData } = await getSubcategoryDocsFromFirebase(newCategory)
    subcategories.value = subcategoriesData.value
  } catch (error) {
    console.error({error})
  }
})

watch(subcategories, (newSubCategories) => {
  subCategoriesQselectOptions.value = newSubCategories.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))
})

const removeImage = async () => {
  //populate new imagesDAta
  const newImagesData = []
  imagesData.value.forEach((imageObject) => {
    if (imageObject.url != urlOfCurrentSlideImage.value) newImagesData.push(imageObject)
  })

  //find argument to delete function, and its index in prev imagesData
  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == urlOfCurrentSlideImage.value)
  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)

  await removeImageFromFirebaseStorage(foundImageObj)

  imagesData.value = newImagesData

  //remake urls object
  imageUrls.value = []
  imagesData.value.forEach(imageDataObject => {
    imageUrls.value.push(imageDataObject.url)
  })

  if (indexOfUpdatedObject == 0) {
    urlOfCurrentSlideImage.value = imagesData.value[0].url
  } else {
    urlOfCurrentSlideImage.value = imagesData.value[indexOfUpdatedObject - 1].url
  }

}

const updateMainImage = async () => {
  findAndRemoveCurrentMainImage()
  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == urlOfCurrentSlideImage.value)
  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)
  let updatedImageDataObj = await updateMainImageInFirebase(currentMainImageObj.value, foundImageObj)
  imagesData.value[indexOfUpdatedObject] = updatedImageDataObj
  currentImageIsMain.value = true
  currentMainImageObj.value = updatedImageDataObj
}

const findAndRemoveCurrentMainImage= () => {
  let currentMainImageObj = imagesData.value.find(imgObj => imgObj.isMain == 'true')

  if (!currentMainImageObj) {
  } else {
    currentMainImageObj.isMain = false
    let indexOfcurrentMainImageObj = imagesData.value.indexOf(currentMainImageObj)
    imagesData.value[indexOfcurrentMainImageObj] = currentMainImageObj
  }
}

const handleUploadedImages = (uploadedImagesData) => {
  uploadedImagesData.forEach(imageDataObject => {
    imagesData.value.push(imageDataObject)
    imageUrls.value.push(imageDataObject.url)
  })

  urlOfCurrentSlideImage.value = imagesData.value[0].url
  let foundImageObj = imagesData.value.find(imgObj => imgObj.isMain == true)
  if (foundImageObj) {
    currentMainImageObj.value = foundImageObj
  }
}

const resetForm = () => {
  state.productName = '',
  state.productPrice = '',
  state.productQuantity = '',
  state.productCategory = '',
  state.productSubCategory = '',
  state.productDescription = '',
  selectedCategory.value = null,
  selectedSubCategory.value = null

  urlOfCurrentSlideImage.value = 'blank'
  currentMainImageObj.value = null
  currentImageIsMain.value = false
  imagesData.value = []
  imageUrls.value = []

  unref(v$).$reset()
}
</script>

<style lang="scss">
.custom-caption {
  text-align: center;
  padding: 5px;
  color: white;
  background-color: rgba(0, 0, 0, .3);
}
</style>
