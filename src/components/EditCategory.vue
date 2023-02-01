<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';

const { updateCategoryInFirebase } = useFirebase()
const categoryIdBeforeUpdate= ref('')
const selectedCategoryId= ref(null)
const categoriesQselectOptions = ref([])
const categoryName = ref(null)
const categoryRoute = ref(null)

const emit = defineEmits([
  'updatedCategory',
])

const props = defineProps({
  categories: {
    type: Array,
    default: []
  }
})

const updateCategory = async () => {
  try {
    const newCategory = {
      categoryName: categoryName.value,
      categoryRoute: categoryRoute.value
    }

    categoryIdBeforeUpdate.value = toRaw(selectedCategoryId.value).value

    await updateCategoryInFirebase(selectedCategoryId.value, newCategory)

    emit('updatedCategory', selectedCategoryId.value)

  } catch(error) {
    console.warn({error})
  }

}

const deleteCategory = async () => {
  console.log('delete a category')
}

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))

  if (categoryIdBeforeUpdate.value) {
    let res = props.categories.find(c => c.categoryId === categoryIdBeforeUpdate.value)

    let updatedCategory = {
      label: res.categoryName,
      value: res.categoryId
    }

    selectedCategoryId.value = updatedCategory
    categoryIdBeforeUpdate.value = []
  }
})

watch(selectedCategoryId, (newCategoryId) => {
  if (!newCategoryId.value) {
    return
  } else {
    let res = props.categories.find(c => c.categoryId === newCategoryId.value)

    categoryName.value = res.categoryName
    categoryRoute.value = res.categoryRoute
  }
})
</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">

      <h5>Edit Product Category</h5>

      <q-select v-model="selectedCategoryId" :options="categoriesQselectOptions" outlined label="Available categories"/>

      <q-input v-model="categoryName" outlined label="Edit name"/>

      <q-input v-model="categoryRoute" outlined label="Edit route" />

      <div class="row">
        <div class="q-gutter-xs">
          <q-btn
            unelevated
            rounded
            align="between"
            icon-right="sync"
            color="primary"
            label="Update"
            @click="updateCategory"
          />

          <q-btn
            unelevated
            rounded
            align="between"
            color="primary"
            icon-right="delete"
            label="Delete"
            @click="deleteCategory"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style>

</style>

