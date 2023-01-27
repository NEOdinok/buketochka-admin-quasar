<script setup>
import { ref, computed, watch, toRaw } from 'vue';
import { app } from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const selectedCategoryId= ref('')
const categoriesQselectOptions = ref([])

const auth = getAuth(app)
const db = getFirestore(app)

const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const props = defineProps({
  propCategories: Array,
})

const createQselectOptions = computed(() => {
  categoriesQselectOptions.value = props.propCategories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))

  return categoriesQselectOptions.value
})

watch(selectedCategoryId, (newCategoryId) => {
  console.log(newCategoryId.value)
})

const createSubCategory = async () => {
  addDoc(collection(db, "users", auth.currentUser.uid, "categories", toRaw(selectedCategoryId.value).value, "subcategories"), {
    subCategoryName: subCategoryName.value,
    subCategoryRoute: subCategoryRoute.value
  })
  .then((docRef) => {
    console.log('emit event')
  })
  .catch((error) => {

  })

}
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <h5>Create Product Subcategory</h5>

      <q-select v-model="selectedCategoryId" outlined :options="createQselectOptions" label="Parent category route" />

      <q-input v-model="subCategoryName" outlined label="Subcategory name" />

      <q-input v-model="subCategoryRoute" outlined label="Subcategory path" />

      <q-btn
        unelevated
        rounded
        align="between"
        icon-right="check"
        color="primary"
        label="Create"
        @click="createSubCategory"
      />
    </div>
  </div>
</template>

<style lang="scss">

</style>
