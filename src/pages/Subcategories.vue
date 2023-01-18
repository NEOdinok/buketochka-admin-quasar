<script setup>
import CreateSubcategory from '../components/CreateSubcategory.vue'
import EditSubcategory from '../components/EditSubcategory.vue'
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateSubcategory />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditSubcategory />
      </div>
    </div>

  </q-page>
</template>

<style lang="scss">
h3 {
  margin: 0;
  padding: 2rem 10rem;
}
</style>

