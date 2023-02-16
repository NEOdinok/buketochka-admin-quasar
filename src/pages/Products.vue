<script setup>
// import ProductLeft from '../components/ProductLeft.vue'
// import ProductRight from '../components/ProductRight.vue'
import ProductEditor from '../components/ProductEditor.vue'
</script>

<template>
  <q-page>
    <ProductEditor />
    <!-- <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <ProductLeft />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <ProductRight />
      </div>
    </div> -->
  </q-page>
</template>

<style lang="scss">
.editor-col {
  border: 1px black solid;
}
</style>
