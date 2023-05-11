<template>

 <!-- v-if="authStore.userInfo.isAdmin == true" -->
  <q-page>
    <ProductEditor />
  </q-page>
</template>

<script setup>
// import ProductLeft from '../components/ProductLeft.vue'
// import ProductRight from '../components/ProductRight.vue'
import ProductEditor from '../components/ProductEditor.vue'
import { useAuthStore } from 'src/stores/authStore';
const authStore = useAuthStore();
</script>


<style lang="scss">
.editor-col {
  border: 1px black solid;
}
</style>
