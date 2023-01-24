<script>

</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">

      <h5>Edit Product Category</h5>
      <p v-if="!categoryList.length">Categories empty. Create the first one</p>
      <q-select v-else :options="categoryList" v-model="select" outlined label="Available categories"/>

      <q-input v-model="categoryRoutes.select" outlined label="Edit name"/>

      <q-input outlined label="Edit route" />

      <div class="row">
        <div class="q-gutter-xs">
          <q-btn unelevated rounded align="between" icon-right="sync" color="primary" label="Update" />
          <q-btn unelevated rounded align="between" color="primary" icon-right="delete" label="Delete" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const select = ref(null)

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
</script>

<style>
</style>

