<script>
</script>

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">

      <h5>Edit Product Category</h5>
      <q-select outlined label="Select a category" />
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
