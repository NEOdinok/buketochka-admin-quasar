<script setup>
import { ref, computed, watch, toRaw, isProxy, toRef } from 'vue';
import { app } from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

const emit = defineEmits([
  'updatedSubcategory',
  'selectedNewParentCategory',
  'deletedSubcategory',
])

const auth = getAuth(app)
const db = getFirestore(app)

// const pulledSubcategoryDocs = ref([])

const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])

const selectedSubCategoryId = ref('')
const subCategoriesQselectOptions = ref([])

const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const props = defineProps({
  propCategories: {
    type: Array,
    default: []
  },

  propSubcategories: {
    type: Array,//за ним хочу следить
    default: []
  }
})

watch(() => props.propSubcategories, (newValue, oldValue) => {
  subCategoriesQselectOptions.value = props.propSubcategories.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))
})

watch(selectedCategoryId, (newCategoryId) => {
  subCategoriesQselectOptions.value = []
  selectedSubCategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''

  emit('selectedNewParentCategory', newCategoryId)
})

watch(selectedSubCategoryId, (newSubCategoryId) => {
  if (!newSubCategoryId.value) {
    return
  } else {
    // let res = pulledSubcategoryDocs.value.find(c => c.subCategoryId === newSubCategoryId.value)
    let res = props.propSubcategories.find(c => c.subCategoryId === newSubCategoryId.value)

    subCategoryName.value = res.subCategoryName
    subCategoryRoute.value = res.subCategoryRoute
  }
})

const createCategoriesQselectOptions = computed(() => {
  categoriesQselectOptions.value = props.propCategories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))

  return categoriesQselectOptions.value
})

const returnSubcategoriesQselectOptions = computed(() => {
  return subCategoriesQselectOptions.value
})

const deleteSubCategory = async () => {
  await deleteDoc(doc(db, "users", auth.currentUser.uid, "categories", toRaw(selectedCategoryId.value).value, "subcategories", toRaw(selectedSubCategoryId.value).value));
  subCategoriesQselectOptions.value = []
  selectedSubCategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''

  emit('deletedSubcategory', selectedCategoryId.value)
}

const updateSubCategory = async () => {
  const subCategoryRef = doc(db, "users", auth.currentUser.uid, "categories", toRaw(selectedCategoryId.value).value, "subcategories", toRaw(selectedSubCategoryId.value).value);

  //await
  setDoc(subCategoryRef, {
    subCategoryId: selectedSubCategoryId.value,
    subCategoryName: subCategoryName.value,
    subCategoryRoute: subCategoryRoute.value
  })
  .then(async () => {
    emit('updatedSubcategory', selectedCategoryId.value)
  })
}

watch(() => props.propCategories, (newValue, oldValue) => {
  console.log('propCategories changed', props.propCategories)
})
</script>

<template>
  <div class="edit-category-wrap q-gutter-md q-mt-xl">
      <div class="q-gutter-md">
        <h5>Edit Product Subcateg</h5>
      </div>

      <p v-if="!propCategories.length">No parent categories</p>

      <div class="q-gutter-md" v-else>
        <q-select v-model="selectedCategoryId" :options="createCategoriesQselectOptions" outlined label="Parent category route" />
      </div>

      <p v-if="!propSubcategories.length">No subcategories</p>

      <div class="q-gutter-md" v-else>
        <q-select v-model="selectedSubCategoryId" :options="returnSubcategoriesQselectOptions" outlined label="Subcategory" />

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
