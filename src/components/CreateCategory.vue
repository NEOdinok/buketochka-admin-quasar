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
        @click="createCategory"/>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore} from '../stores/authStore'
import { useCatStore } from '../stores/catStore'
import { app } from '../../firebaseConfig'
import { getAuth } from '@firebase/auth';
import { ref } from 'vue';
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";

const emit = defineEmits(['createdCategory'])

const authStore = useAuthStore()
const catStore = useCatStore()

const categoryName = ref('')
const categoryRoute = ref('')

const auth = getAuth(app)
const db = getFirestore(app)

defineProps({
  categoryList: {
    type: Array,
    default() {
      return []
    }
  },
  categoryRoutes: {
    type: Array,
    default() {
      return []
    }
  },
})

const createCategory = async () => {
  setDoc(doc(db, "users", auth.currentUser.uid, "categories", categoryName.value), {
    categoryName: categoryName.value,
    categoryRoute: categoryRoute.value
    // test: "test"
  }).then(() => {
    emit('createdCategory')
  })
  .catch((err) => {

  })
}

</script>


<style></style>
