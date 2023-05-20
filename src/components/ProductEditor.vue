<template>
  <div class="spinnerWrap" v-if="editMode && !dataToEdit">
    <q-spinner color="primary" size="3em" />
  </div>

  <q-form
    v-else
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
            @popup-show="(e) => categoryWatchersActive = true"
          />

          <p v-else>No product categories</p>
          <q-select
            outlined
            label="Product Subcategory"
            class="q-pb-lg"
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
              :disabled="currentImageIsMain"
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
            type="submit"
          >
            {{ editMode? 'update': 'create' }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { useFirebase } from 'src/composables/useFirebase';
import { onMounted, onBeforeUnmount, ref, watch, reactive, unref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, integer, minValue } from '@vuelidate/validators'
import FirebaseUpload from './FirebaseUpload.vue'
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase'
import { useNotifications } from 'src/composables/useNotifications';
import { useAuthStore } from 'src/stores/authStore';
import { useRoute, useRouter } from 'vue-router';

const {
  getCategoryDocsFromFirebase,
  getSubcategoryDocsFromFirebase,
  createProductInFirebase,
  getProductFromFirebase,
  updateProductInFirebase,
} = useFirebase()
const {
  removeImageFromFirebaseStorage
} = useFirestoreDatabase()
const authStore = useAuthStore();
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
const submitHandlerRan = ref(false);
const imagesUploadedBeforeSubmit = ref([]);
const imagesDeletedBeforeSubmit = ref([]);
const router = useRouter();
const categoryWatchersActive = ref(false);
const dataChangeWatcherActive = ref(false);
const dataToEdit = ref(null);

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
  productSubCategory: { $lazy: false },
  productDescription: { required, $lazy: true },
}

const v$ = useVuelidate(rules, state)

const props = defineProps({
  productId: {
    type: String,
    required: false,
  }
})

const editMode = computed(() => {
  if (props.productId) return true;
  else return false;
})

//edit mode only
onMounted(async () => {
  if (editMode.value) {
    try {
      dataToEdit.value = await getProductFromFirebase(props.productId);
      if (dataToEdit) fillFormWithProductData(dataToEdit.value);
    } catch (error) {
      console.warn({ error });
    }
  }
});

//general onMounted
onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    categories.value = categoriesData.value
  } catch({ error }) {
    console.warn({ error });
  }
})

const fillFormWithProductData = (data) => {
  state.productName = data.name;
  state.productPrice = data.price;
  state.productQuantity = data.quantity;
  state.productDescription = data.description;
  state.productCategory= data.category;
  state.productSubCategory = data.subCategory;
  selectedCategory.value = data.category;
  selectedSubCategory.value = data.subCategory;
  imagesData.value =  data.imagesData;
  imageUrls.value = data.imageUrls;
  console.log('imageUrls filled', imageUrls.value);
  urlOfCurrentSlideImage.value = data.imagesData.find(img => img.isMain === true).url;
  currentMainImageObj.value = data.imagesData.find(img => img.isMain === true)
}

const deleteStagedImages = async () => {
  try {
    imagesDeletedBeforeSubmit.map(async imgObj => {
      console.log('deleting:', imgObj, 'from firebase')
      await removeImageFromFirebaseStorage(imgObj)
    })
  } catch (error) {
  }
}

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
        description: state.productDescription,
        category: selectedCategory.value,
        subCategory: selectedSubCategory.value,
        imagesData: imagesData.value,
        imageUrls: imageUrls.value,
      }
      if (editMode.value) await handleUpdate(productData);
      else await handleCreate(productData);
      submitHandlerRan.value = true;
      console.log('submitHandlerRan is set to:', submitHandlerRan.value);
    }
  } catch (error) {
    console.warn({error})
  }
}

const handleUpdate = async (productData) => {
  try {
    await updateProductInFirebase(props.productId, productData)
    triggerPositive(`Product ${productData.name} updated`)
  } catch (error) {
    console.warn({ error });
  }
}

const handleCreate = async (productData) => {
  try {
    const createdProductId = await createProductInFirebase(productData)
    triggerPositive(`Product ${productData.name} created`)
    router.replace(`/products/edit/${createdProductId}`);
  } catch (error) {
    console.warn({ error })
  }
}

watch(urlOfCurrentSlideImage, (newUrl) => {
  const foundImageObj = imagesData.value.find(imgObj => imgObj.url == newUrl)

  if (foundImageObj && foundImageObj.isMain == true) {
    currentImageIsMain.value = true
  } else {
    currentImageIsMain.value = false
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
      state.productCategory = newCategory;
      const { subcategoriesData } = await getSubcategoryDocsFromFirebase(newCategory)
      subcategories.value = subcategoriesData.value
      if (categoryWatchersActive.value) selectedSubCategory.value = ''
    }
  } catch (error) {
    console.warn({ error });
  }
})

watch(subcategories, (newSubCategories) => {
  subCategoriesQselectOptions.value = newSubCategories.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))
})

const removeImage = async () => {
  //find imgObj to delete
  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == urlOfCurrentSlideImage.value)
  //find its index in imagesData
  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)
  //stage imgObj for removal
  imagesDeletedBeforeSubmit.value.push(foundImageObj);

  //new imagesData
  const newImagesData = []
  imagesData.value.forEach((imageObject) => {
    if (imageObject.url != urlOfCurrentSlideImage.value) newImagesData.push(imageObject)
  })
  imagesData.value = newImagesData

  //new imageUrls
  imageUrls.value = []
  imagesData.value.forEach(imageDataObject => {
    imageUrls.value.push(imageDataObject.url)
  })

  //display new img or blank screen in a preview
  if (indexOfUpdatedObject == 0) {
    urlOfCurrentSlideImage.value = imagesData.value[0].url
  } else {
    urlOfCurrentSlideImage.value = imagesData.value[indexOfUpdatedObject - 1].url
  }

  console.log('imageUrls updated', imageUrls.value);
}

const handleUploadedImages = (uploadedImagesData) => {
  console.log('[editor] uploaded event. uploadedImagesData:', uploadedImagesData);

  uploadedImagesData.forEach(imageDataObject => {
    imagesData.value.push(imageDataObject)//images data (may be filled from backend on product edit)
    imageUrls.value.push(imageDataObject.url)//image urls (may be filled from back on product edit)
    imagesUploadedBeforeSubmit.value.push(imageDataObject)//only filled when uploading new images
  })
  urlOfCurrentSlideImage.value = imagesData.value[0].url
}

//remove current, find, get index, update, put back by index
const updateMainImage = async () => {
  console.log('[editor] about to find and remove main from', imagesData.value.find(imgObj => imgObj.isMain === true));
  findAndRemoveCurrentMainImage()

  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == urlOfCurrentSlideImage.value)//find obj of current img
  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)//get index of it
  foundImageObj.isMain = true;// change it to not main
  imagesData.value[indexOfUpdatedObject] = foundImageObj;//put back by index
  currentImageIsMain.value = true;
  currentMainImageObj.value = foundImageObj;
  console.log('[editor] changed main to', currentMainImageObj.value.url);
  console.log('[editor] update end. imagesData:', imagesData.value);
}

//find, get index, update, put back by index
const findAndRemoveCurrentMainImage = () => {
  let currentMainImageObj = imagesData.value.find(imgObj => imgObj.isMain === true)// find current main img
  console.log('[findAndRemove]:', currentMainImageObj);

  if (currentMainImageObj) {
    let indexOfcurrentMainImageObj = imagesData.value.indexOf(currentMainImageObj)//get index of it
    currentMainImageObj.isMain = false;// change it to not main
    imagesData.value[indexOfcurrentMainImageObj] = currentMainImageObj// put it back by index
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

onBeforeUnmount(async () => {
  if (submitHandlerRan.value) {
    console.log('not deleting nothing')
  } else {
    console.log('product not created. clearing photos');
    if (imagesUploadedBeforeSubmit.value.length) {
      imagesUploadedBeforeSubmit.value.map(async imageObj => {
        console.log('removed', imageObj.url, 'from firebase');
        await removeImageFromFirebaseStorage(imageObj)
      })
    } else console.log('no new images uploaded. nothing to clean');
  }
});
</script>

<style lang="scss">
.custom-caption {
  text-align: center;
  padding: 5px;
  color: white;
  background-color: rgba(0, 0, 0, .3);
}

.spinnerWrap {
  position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
