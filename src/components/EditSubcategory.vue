<script>
</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">
      <h5>Edit Product Subcategory</h5>

      <!-- :options="categories" -->
      <q-select outlined label="Parent category route" />

      <!-- :options="subcategories" -->
      <q-select outlined label="Subcategory" />

      <!-- v-model="text"  -->
      <q-input outlined label="Edit name"/>

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

<style>
</style>
