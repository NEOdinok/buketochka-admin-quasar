<template>
  <div class="q-pa-md">
    <q-form ref="productRightForm">
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
          <div v-if="currentImageIsMain" class="absolute-top custom-caption">
            <div class="text-h2">Main photo</div>
          </div>
        </q-carousel-slide>

        <q-carousel-slide v-else name="blank" class="column no-wrap flex-center">
          <q-icon name="image" size="56px" />
          <div class="q-mt-md text-center">
            Add product images below
          </div>
        </q-carousel-slide>
      </q-carousel>

      <div class="row q-gutter-sm q-pt-md">
        <q-btn
          unelevated
          rounded
          align="between"
          icon-right="delete"
          color="primary"
          label="Remove"
          :disable="imageUrls.length == 0"
        />

        <q-btn
          unelevated
          rounded
          align="between"
          icon-right="image"
          color="primary"
          label="Set as main"
          :disable="imageUrls.length == 0"
          @click="updateMainImage"
        />

      </div>
    </q-form>

    <FirebaseUpload
      @onImagesUploaded="handleUploadedImages"
    />

  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import FirebaseUpload from './FirebaseUpload.vue'
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase'
import { required } from '@vuelidate/validators'
const { updateMainImageInFirebase } = useFirestoreDatabase()
const urlOfCurrentSlideImage = ref('blank')
const currentMainImageObj = ref(null)
const currentImageIsMain = ref(false)
const imagesData = ref(null)
const imageUrls = ref([])

const state = reactive({
  productName: '',
  productPrice: '',
  productQuantity: '',
  productdCategory: '',
  productDescription: '',
  productCategory: '',
  productSubCategory: ''

})

const rules = {
  productName: '',
  productPrice: '',
  productQuantity: '',
  productdCategory: '',
  productDescription: '',
  productCategory: '',
  productSubCategory: ''
}

watch(urlOfCurrentSlideImage, (newUrl) => {
  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == newUrl)

  if (foundImageObj.isMain == 'true') {
    currentImageIsMain.value = true
  } else {
    currentImageIsMain.value = false
  }
})

const updateMainImage = async () => {
  findAndRemoveCurrentMainImage()
  let foundImageObj = imagesData.value.find(imgObj => imgObj.url == urlOfCurrentSlideImage.value)
  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)
  let updatedImageDataObj = await updateMainImageInFirebase(currentMainImageObj.value, foundImageObj)
  imagesData.value[indexOfUpdatedObject] = updatedImageDataObj
  currentImageIsMain.value = true
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
  imagesData.value = uploadedImagesData
  imagesData.value.forEach(imageDataObject => {
    imageUrls.value.push(imageDataObject.url)
  })
  urlOfCurrentSlideImage.value = imagesData.value[0].url
  let foundImageObj = imagesData.value.find(imgObj => imgObj.isMain == true)
  if (foundImageObj) {
    currentMainImageObj.value = foundImageObj
  } else {
    //
  }
}

</script>

<style lang="scss">
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, .3);
}
</style>
