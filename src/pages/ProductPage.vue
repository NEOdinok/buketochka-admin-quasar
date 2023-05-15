<template>
  <q-page>
    <ProductEditor :productId="productId" />
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import ProductEditor from '../components/ProductEditor.vue'
import { useAuthStore } from 'src/stores/authStore';
// import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute();
const authStore = useAuthStore();

const productId = computed(() => route.params.id)
</script>

<style lang="scss">
.editor-col {
  border: 1px black solid;
}
</style>
