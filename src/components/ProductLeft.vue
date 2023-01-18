<script>
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-input outlined label="Product name" />
      <q-input outlined label="Product price" />
      <q-input outlined label="Product quantity" />

      <q-select outlined v-model="model" label="Parent category" />
      <q-select outlined v-model="model" label="Product Subcategory" />

      <!-- v-model="textareaModel"
      @keydown="processTextareaFill"
      @focus="processTextareaFill" -->
      <q-input
        filled
        clearable
        type="textarea"
        color="red-12"
        label="Product Description"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textareaShadowText"
      />
    </div>
  </div>
</template>

<style>
</style>
