<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <h5>Create new product category</h5>

      <q-input v-model="categoryName" outlined label="Category name" />

      <q-input v-model="categoryRoute" outlined label="Route for category" />

      <q-btn
        unelevated
        rounded
        align="between"
        icon-right="check"
        color="primary"
        label="Create"
        @click="createCategory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';

const { createCategoryInFirebase } = useFirebase()
const emit = defineEmits(['createdCategory'])
const categoryName = ref('')
const categoryRoute = ref('')

const createCategory = async () => {
  if (!categoryName.value || !categoryRoute.value) {
    console.log('fill in all the fields')
  } else {
    let newCategory = {
      categoryName: categoryName.value,
      categoryRoute: categoryRoute.value
    }

    await createCategoryInFirebase(newCategory)

    categoryName.value = ''
    categoryRoute.value = ''

    emit('createdCategory')
  }
}
</script>


<style>
</style>
