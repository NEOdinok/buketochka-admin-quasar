<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <h5>Create Product Category</h5>

      <q-select outlined v-model="model" label="Category route" />

      <q-input outlined label="Category name" />

      <q-input outlined label="Category path" />

      <q-btn unelevated rounded align="between" icon-right="check" color="primary" label="Create" />
    </div>
  </div>
</template>

<script setup>
</script>

<style></style>
