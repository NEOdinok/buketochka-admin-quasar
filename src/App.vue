<template>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { app } from '../firebaseConfig'
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore()

onMounted(() => {
  const auth = getAuth(app)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStore.isLoggedIn = true
    } else {
      authStore.isLoggedIn = false
    }
  })
})

</script>
