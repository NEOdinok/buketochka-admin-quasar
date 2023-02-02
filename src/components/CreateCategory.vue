<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Create new product category</h5>
    <q-form
      ref="createCategoryForm"
      @submit="formValidate"
    >
      <q-input
        class="q-pb-lg"
        v-model="categoryName"
        outlined
        label="Category name *"
        lazy-rules="ondemand"
        :rules="[
          (val) => (val && val.length > 0) || 'Name must be filled',
        ]"
      />

      <q-input
        class="q-pb-lg"
        v-model="categoryRoute"
        outlined
        label="Route for category *"
        prefix="/"
        lazy-rules='ondemand'
        :rules="[
          (val) => (val && val.length > 0) || 'Route must be filled in.',
        ]"
      />

      <q-btn
        unelevated
        rounded
        align="between"
        icon-right="check"
        color="primary"
        label="Create"
        type="submit"
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications';

const { createCategoryInFirebase } = useFirebase()
const { triggerNegative, triggerPositive } = useNotifications()
const emit = defineEmits(['createdCategory'])
const categoryName = ref(null)
const categoryRoute = ref(null)
const createCategoryForm = ref(null)

const formReset = () => {
  categoryName.value = null
  categoryRoute.value = null
  createCategoryForm.value.reset()
}

function formValidate () {
  createCategoryForm.value.validate().then(success => {
    if (success) {
      createCategory()
    }
    else {
      triggerNegative('Please, fill in all the fields')
    }
  })
}

const createCategory = async () => {
  let newCategory = {
    categoryName: categoryName.value,
    categoryRoute: categoryRoute.value
  }
  await createCategoryInFirebase(newCategory)
  triggerPositive(`Category ${categoryName.value} created`)
  emit('createdCategory')
  formReset()
}
</script>

<style>
</style>
