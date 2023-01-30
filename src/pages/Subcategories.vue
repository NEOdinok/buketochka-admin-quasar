<script setup>
import CreateSubcategory from '../components/CreateSubcategory.vue'
import EditSubcategory from '../components/EditSubcategory.vue'

import { onMounted, ref, isProxy, toRaw, watch  } from 'vue';
import { getDocs, collection, getFirestore, doc } from "firebase/firestore";
import { getAuth } from '@firebase/auth';
import { app } from '../../firebaseConfig'

const pulledCategoriesArray = ref([])
const pulledSubcategoryDocs = ref([])

const propCategories = ref([])
const propSubcategories = ref([])

onMounted(async () => {
  await pullDocsFromFirebase()
})

const pullDocsFromFirebase = async () => {
  const db = getFirestore(app)
  const auth = getAuth(app)

  getDocs(collection(db, "users", auth.currentUser.uid, "categories"))
  .then((snapShot) => {
    snapShot.forEach((doc) => {

      pulledCategoriesArray.value.push({
        categoryId: doc.id,
        categoryName: doc.data().categoryName,
        categoryRoute: doc.data().categoryRoute
      })
    })
  })
  .then(() => {
    if (isProxy(pulledCategoriesArray.value)) {
      propCategories.value = toRaw(pulledCategoriesArray.value)
      pulledCategoriesArray.value = []
    } else {
      propCategories.value = pulledCategoriesArray.value
      pulledCategoriesArray.value = []
    }
  })
  .catch((err) => {

  })
}

const pullSubcategoryDocsFromFirebase = async (categoryId) => {
  const db = getFirestore(app)
  const auth = getAuth(app)
  pulledSubcategoryDocs.value = []

  getDocs(collection(db, "users", auth.currentUser.uid, "categories", categoryId.value, "subcategories"))
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
      propSubcategories.value = toRaw(pulledSubcategoryDocs.value)
      pulledSubcategoryDocs.value = []
    } else {
      propSubcategories.value = pulledSubcategoryDocs.value
      pulledSubcategoryDocs.value = []
    }
  })
  .catch((err) => {

  })
}

// watch(propSubcategories, (newProp) => {
//   console.log('[Subcategoris.vue] passing new prop', newProp)
// })

</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateSubcategory
          :propCategories="propCategories"
          :propSubcategories="propSubcategories"
          v-on:createdSubcategory="pullSubcategoryDocsFromFirebase"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">

        <!-- :propCategories="propCategories" -->
        <!-- :propSubcategories="propSubcategories" -->
        <EditSubcategory
          :propCategories="propCategories"
          :propSubcategories="propSubcategories"
          v-on:updatedSubcategory="pullSubcategoryDocsFromFirebase"
          v-on:selectedNewParentCategory="pullSubcategoryDocsFromFirebase"
          v-on:deletedSubcategory="pullSubcategoryDocsFromFirebase"
        />
      </div>
    </div>

  </q-page>
</template>


<style lang="scss">
h3 {
  margin: 0;
  padding: 2rem 10rem;
}
</style>

