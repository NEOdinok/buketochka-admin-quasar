<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
const { deleteSubcategoryFromFirebase, updateSubcategoryInFirebase } = useFirebase()

const subcategoryIdBeforeUpdate= ref('')

const emit = defineEmits([
  'updatedSubcategory',
  'selectedNewParentCategory',
  'deletedSubcategory',
])

const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])

const selectedSubCategoryId = ref('')
const subCategoriesQselectOptions = ref([])

const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const props = defineProps({
  categories: {
    type: Array,
    default: []
  },

  subcategories: {
    type: Array,
    default: []
  },

})

watch(() => props.subcategories, () => {
  subCategoriesQselectOptions.value = props.subcategories.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))

  if (subcategoryIdBeforeUpdate.value) {
    let res = props.subcategories.find(c => c.subCategoryId === subcategoryIdBeforeUpdate.value)

    let updatedSubcategory = {
      label: res.subCategoryName,
      value: res.subCategoryId
    }

    selectedSubCategoryId.value = updatedSubcategory
    subcategoryIdBeforeUpdate.value = ''
  }
})

watch(selectedCategoryId, (newCategoryId) => {
  subCategoriesQselectOptions.value = []
  selectedSubCategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''
  subcategoryIdBeforeUpdate.value = ''

  emit('selectedNewParentCategory', newCategoryId)
})

watch(selectedSubCategoryId, (newSubCategoryId) => {
  if (!newSubCategoryId.value) {
    return
  } else {
    let res = props.subcategories.find(c => c.subCategoryId === newSubCategoryId.value)

    subCategoryName.value = res.subCategoryName
    subCategoryRoute.value = res.subCategoryRoute
  }
})

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

const deleteSubCategory = async () => {
  try {
    await deleteSubcategoryFromFirebase(selectedCategoryId.value, selectedSubCategoryId.value)

    subCategoriesQselectOptions.value = []
    selectedSubCategoryId.value = ''
    subCategoryName.value = ''
    subCategoryRoute.value = ''

    emit('deletedSubcategory', selectedCategoryId.value)
  } catch(error) {
    console.warn({error})
  }
}

const updateSubCategory = async () => {
  try {
    const newSubCategory = {
      subCategoryId: toRaw(selectedSubCategoryId.value).value,
      subCategoryName: subCategoryName.value,
      subCategoryRoute: subCategoryRoute.value
    }

    subcategoryIdBeforeUpdate.value = toRaw(selectedSubCategoryId.value).value

    await updateSubcategoryInFirebase(selectedCategoryId.value, selectedSubCategoryId.value, newSubCategory)

    emit('updatedSubcategory', selectedCategoryId.value)
  } catch(error) {
    console.warn({error})
  }
}
</script>

<template>
  <div class="edit-category-wrap q-gutter-md q-mt-xl">
      <div class="q-gutter-md">
        <h5>Edit Product Subcateg</h5>
      </div>

      <p v-if="!categories.length">No parent categories</p>

      <div class="q-gutter-md" v-else>
        <q-select v-model="selectedCategoryId" :options="categoriesQselectOptions" outlined label="Parent category route" />
      </div>

      <p v-if="!subcategories.length">No subcategories</p>

      <div class="q-gutter-md" v-else>
        <q-select v-model="selectedSubCategoryId" :options="subCategoriesQselectOptions" outlined label="Subcategory" />

        <q-input v-model="subCategoryName" outlined label="Edit name"/>

        <q-input v-model="subCategoryRoute"  outlined label="Edit route" />

        <div class="row">
          <div class="q-gutter-xs">
            <q-btn
              unelevated
              rounded
              align="between"
              icon-right="sync"
              color="primary"
              label="Update"
              @click="updateSubCategory"
            />

            <q-btn
              unelevated
              rounded
              align="between"
              color="primary"
              icon-right="delete"
              label="Delete"
              @click="deleteSubCategory"
            />
          </div>
        </div>
      </div>

  </div>
</template>

<style>
</style>
