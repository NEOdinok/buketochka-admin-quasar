<template>
<div class="">
<!-- test -->
  <q-file
    v-model="pendingImages"
    label="Add images to upload"
    class="q-pt-md"
    accept=".jpg, image/*"
    outlined
    counter
    clearable
    multiple
    append
    use-chips
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
import { useAuthStore } from 'src/stores/authStore';
const authStore = useAuthStore();
const { triggerSpinner } = useNotifications()
const { uploadImagesToFirebaseStorage } = useFirestoreDatabase()
const uploadedImagesData= ref([])
const pendingImages = ref(null)

const emit = defineEmits([
  'onImagesUploaded',
])

const canUpload = computed(() => {
  return pendingImages.value !== null
})

const submitHandler = async () => {
  try {
    const dismissNotification = triggerSpinner('loading images...')
    uploadedImagesData.value = []
    uploadedImagesData.value = await uploadImagesToFirebaseStorage(pendingImages.value)
    if (uploadedImagesData.value) dismissNotification()
    emit('onImagesUploaded', uploadedImagesData.value)
    pendingImages.value = null
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
