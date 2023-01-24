<script setup>
import CreateCategory from '../components/CreateCategory.vue'
import EditCategory from '../components/EditCategory.vue'
import { onMounted } from 'vue';
import { getDocs, collection, getFirestore, doc } from "firebase/firestore";
import {app} from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
// import { useCatStore } from 'src/stores/catStore';
import { ref, watch, computed } from 'vue';

const categoryList = ref([])
const categoryRoutes = ref([])

onMounted(async () => {

  await pullDocsFromFirebase()
  // getDocs(collection(db, "users", auth.currentUser.uid, "categories"))
  // .then((snapShot) => {
  //   categoryList.value = snapShot.docs.map((doc) => ({
  //     label: doc.data().categoryName,
  //     value: doc.data().categoryName
  //   }))
  //   categoryRoutes.value = snapShot.docs.map((doc) => ({
  //     label: doc.data().categoryName,
  //     value: doc.data().categoryRoute
  //   }))
  // })
})

const pullDocsFromFirebase = async () => {
  const db = getFirestore(app)
  const auth = getAuth(app)

  getDocs(collection(db, "users", auth.currentUser.uid, "categories"))
  .then((snapShot) => {
    categoryList.value = snapShot.docs.map((doc) => ({
      label: doc.data().categoryName,
      value: doc.data().categoryName
    }))
    categoryRoutes.value = snapShot.docs.map((doc) => ({
      label: doc.data().categoryName,
      value: doc.data().categoryRoute
    }))
  })
}

</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateCategory v-on:createdCategory="pullDocsFromFirebase" :categoryRoutes="categoryRoutes" />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditCategory :categoryList="categoryList" :categoryRoutes="categoryRoutes"/>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
</style>
