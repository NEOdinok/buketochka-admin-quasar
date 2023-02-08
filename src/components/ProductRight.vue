<template>
  <div class="q-pa-md">
    <q-form ref="productRightForm">
      <q-carousel
        v-model="currentSlide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        height="300px"
        class="bg-grey-1 shadow-2 rounded-borders"
      >
        <q-carousel-slide :name="1" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
          </div>
        </q-carousel-slide>

        <q-carousel-slide  v-for="(url, i) in imageUrls" :name="i" class="column no-wrap">
          <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
            <q-img class="rounded-borders col-6 full-height" :src="url" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-form>

    <FirebaseUpload
      @onImageUpload="handleUpload"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import FirebaseUpload from './FirebaseUpload.vue';

const imageFile = ref(null)
const currentSlide = ref(1)
const imageUrls = ref([])

const handleUpload = (uploadedImageUrl) => {
  imageUrls.value.push(uploadedImageUrl)
}

</script>

<style>
</style>
