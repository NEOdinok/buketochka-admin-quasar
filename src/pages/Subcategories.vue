<script setup>
import CreateSubcategory from '../components/CreateSubcategory.vue'
import EditSubcategory from '../components/EditSubcategory.vue'

import { onMounted, ref, isProxy, toRaw  } from 'vue';
import { getDocs, collection, getFirestore, doc } from "firebase/firestore";
import { getAuth } from '@firebase/auth';
import { app } from '../../firebaseConfig'

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
      propCategories.value = pulledCategoriesArray.value
      return toRaw(pulledCategoriesArray.value)
    } else {
      return pulledCategoriesArray.value
    }
  })
  .catch((err) => {

  })
}

</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateSubcategory :propCategories="propCategories" />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditSubcategory />
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

