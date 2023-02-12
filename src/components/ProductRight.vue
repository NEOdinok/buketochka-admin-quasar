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
            Add photos below
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
      @onImagesUploaded="handleUpload"
    />

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FirebaseUpload from './FirebaseUpload.vue'
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase'
import { remove } from '@vue/shared';

const urlOfCurrentSlideImage = ref('blank')
const { updateMainImageInFirebase } = useFirestoreDatabase()

const currentMainImageRefString = ref(null)
const currentImageIsMain = ref(false)
const imagesData = ref(null)
const imageUrls = ref([])

watch(urlOfCurrentSlideImage, (newUrl) => {
  let foundImageObj = imagesData.value.find(i => i.imageUrl === newUrl)

  if (foundImageObj.isMain == 'true') {
    currentImageIsMain.value = true
  } else {
    currentImageIsMain.value = false
  }
})

const updateMainImage = async () => {
  //0. if we do already have a main image, make its isMain: false
  findAndRemoveCurrentMainImage()

  let foundImageObj = imagesData.value.find(imgObj => imgObj.imageUrl == urlOfCurrentSlideImage.value)

  let indexOfUpdatedObject = imagesData.value.indexOf(foundImageObj)

  let newMainImageRefString = foundImageObj.storageRef

  let updatedImageDataObj = await updateMainImageInFirebase(currentMainImageRefString.value, newMainImageRefString)

  imagesData.value[indexOfUpdatedObject] = updatedImageDataObj

  currentImageIsMain.value = true

}

const findAndRemoveCurrentMainImage= () => {
  let currentMainImageObj = imagesData.value.find(imgObj => imgObj.isMain == 'true')

  if (!currentMainImageObj) {
    console.log('search found nothing')
  } else {
    currentMainImageObj.isMain = false
    let indexOfcurrentMainImageObj = imagesData.value.indexOf(currentMainImageObj)
    imagesData.value[indexOfcurrentMainImageObj] = currentMainImageObj
  }
}

const handleUpload = (uploadedImagesData) => {
  imagesData.value = uploadedImagesData
  imagesData.value.forEach(imageDataObject => {
    imageUrls.value.push(imageDataObject.imageUrl)
  })

  //set first one as current
  urlOfCurrentSlideImage.value = imagesData.value[0].imageUrl

  //find the one that is main
  let foundImageObj = imagesData.value.find(imgObj => imgObj.isMain == true)
  if (foundImageObj) {
    currentMainImageRefString.value = foundImageObj.storageRef
  } else {
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
