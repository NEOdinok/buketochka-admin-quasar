<script setup>
import { ref, computed, watch, toRaw, isProxy } from 'vue';
import { app } from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
import { getFirestore, collection, getDocs } from "firebase/firestore";

const auth = getAuth(app)
const db = getFirestore(app)

const pulledSubcategoryDocs = ref([])

const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])

const selectedSubCategoryId = ref('')
const subCategoriesQselectOptions = ref([])

const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const props = defineProps({
  propCategories: Array,
})

watch(selectedCategoryId, (newCategoryId) => {
  pullSubcategoryDocsFromFirebase(newCategoryId.value)
})

watch(selectedSubCategoryId, (newSubCategoryId) => {
  let res = pulledSubcategoryDocs.value.find(c => c.subCategoryId === newSubCategoryId.value)

  subCategoryName.value = res.subCategoryName
  subCategoryRoute.value = res.subCategoryRoute
})

const createCategoriesQselectOptions = computed(() => {
  categoriesQselectOptions.value = props.propCategories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))

  return categoriesQselectOptions.value
})

const createSubcategoriesQselectOptions = computed(() => {

  subCategoriesQselectOptions.value = pulledSubcategoryDocs.value.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))

  return subCategoriesQselectOptions.value
})

const pullSubcategoryDocsFromFirebase = async (categoryId) => {
  const db = getFirestore(app)
  const auth = getAuth(app)
  pulledSubcategoryDocs.value = []

  getDocs(collection(db, "users", auth.currentUser.uid, "categories", categoryId, "subcategories"))
  .then((snapShot) => {
    snapShot.forEach((doc) => {

      pulledSubcategoryDocs.value.push({
        subCategoryId: doc.id,
        subCategoryName: doc.data().subCategoryName,
        subCategoryRoute: doc.data().subCategoryRoute
      })

    })
  })
  .then(() => {
    if (isProxy(pulledSubcategoryDocs.value)) {
      return toRaw(pulledSubcategoryDocs.value)
    } else {
      return pulledSubcategoryDocs.value
    }
  })
  .catch((err) => {

  })
}

</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">
      <h5>Edit Product Subcategory</h5>

      <q-select v-model="selectedCategoryId" :options="createCategoriesQselectOptions" outlined label="Parent category route" />

      <q-select v-model="selectedSubCategoryId" :options="createSubcategoriesQselectOptions" outlined label="Subcategory" />

      <q-input v-model="subCategoryName" outlined label="Edit name"/>

      <q-input v-model="subCategoryRoute"  outlined label="Edit route" />

      <div class="row">
        <div class="q-gutter-xs">
          <q-btn unelevated rounded align="between" icon-right="sync" color="primary" label="Update" />
          <q-btn unelevated rounded align="between" color="primary" icon-right="delete" label="Delete" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
