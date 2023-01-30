<script setup>
import CreateCategory from '../components/CreateCategory.vue'
import EditCategory from '../components/EditCategory.vue'
import { onMounted } from 'vue';
import { getDocs, collection, getFirestore, doc } from "firebase/firestore";
import { app } from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
import { ref, isProxy, toRaw, watch } from 'vue';

/**array of raw objects */
const pulledCategoriesArray = ref([])
const propCategories = ref([])

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
      console.log('[Categories.vue] pulled docs', toRaw(pulledCategoriesArray.value))
      propCategories.value = toRaw(pulledCategoriesArray.value)
      pulledCategoriesArray.value = []
    } else {
      console.log('[Categories.vue] pulled docs', pulledCategoriesArray.value)
      propCategories.value = pulledCategoriesArray.value
      pulledCategoriesArray.value = []
    }
  })
  .catch((err) => {

  })
}

watch(propCategories, (newProp) => {
  console.log('[Categories.vue] passing new category prop to child', newProp)
})

</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateCategory v-on:createdCategory="pullDocsFromFirebase" />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditCategory :propCategories="propCategories"/>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
</style>
