
<script setup>
import CreateCategory from '../components/CreateCategory.vue'
import EditCategory from '../components/EditCategory.vue'
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateCategory />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditCategory />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
</style>
