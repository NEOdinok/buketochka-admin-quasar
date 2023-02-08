<template>
<div class="">

  <q-file
    v-model="productImageFiles"
    label="Add product images"
    class="q-pt-md"
    outlined
    counter
    clearable
    use-chips
    :counter-label="counterLabelFn"
    multiple
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:after v-if="canUpload">
      <q-btn
        color="green"
        rounded
        dense
        icon="cloud_upload"
        :disable="!canUpload"
        @click="submitHandler"
      />
    </template>
  </q-file>

</div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase'
import { useNotifications } from 'src/composables/useNotifications';

const { triggerSpinner } = useNotifications()
const { uploadProductToFirebase } = useFirestoreDatabase()

const urlsOfUploadedImages= ref(null)
const productImageFiles = ref(null)

const emit = defineEmits([
  'onImageUpload',
])

const canUpload = computed(() => {
  return productImageFiles.value !== null
})

const submitHandler = async () => {
  try {
    const productData = {
      title: '',
      amount: 1,
      imageFiles: productImageFiles.value
    }
    // const dismissNotification = triggerSpinner('loading...')
    console.log('[FirebaseUpload] pass data to composable', productData)
    urlsOfUploadedImages.value = await uploadProductToFirebase(productData)
    // console.log('[FirebaseUpload] recieved', urlsOfUploadedImages.value)
    urlsOfUploadedImages.value.forEach(url => {
      console.log('url: ', url)
    })
  } catch (error) {
    console.warn({ error })
  }
}
</script>

<style lang="scss">
#htmlInput {
  display: none;
}
</style>
