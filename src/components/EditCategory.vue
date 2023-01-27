<script>

</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">

      <h5>Edit Product Category</h5>
      <q-select v-model="selectedCategoryId" :options="createQselectOptions" outlined label="Available categories"/>

      <q-input v-model="name" outlined label="Edit name"/>

      <q-input v-model="route" outlined label="Edit route" />

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
import { ref, computed, toRaw, watch  } from 'vue';

const selectedCategoryId= ref(null)
const categoriesQselectOptions = ref([])
const name = ref(null)
const route = ref(null)

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
  let res = props.propCategories.find(c => c.categoryId === newCategoryId.value)

  name.value = res.categoryName
  route.value = res.categoryRoute
})

</script>

<style>
</style>

