<script>
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <h5>Create Product Subcategory</h5>

      <!-- :options="options" -->
      <q-select outlined v-model="model" label="Parent category route" />

      <!-- v-model="text"  -->
      <q-input outlined label="Subcategory name" />

      <q-input outlined label="Subcategory path" />

      <q-btn unelevated rounded align="between" icon-right="check" color="primary" label="Create" />
    </div>
  </div>
</template>

<style>
</style>
