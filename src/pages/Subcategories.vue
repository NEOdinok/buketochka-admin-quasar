<script setup>
import CreateSubcategory from '../components/CreateSubcategory.vue'
import EditSubcategory from '../components/EditSubcategory.vue'
import { onMounted, ref } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();
const { getCategoryDocsFromFirebase, getSubcategoryDocsFromFirebase } = useFirebase()
const categories = ref([])
const subcategories = ref([])

onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    categories.value = categoriesData.value
  } catch(error) {
    console.warn({error})
  }
})

async function subCategoriesHandler(parentCategoryId) {
  try {
    const { subcategoriesData } = await getSubcategoryDocsFromFirebase(parentCategoryId)
    subcategories.value = subcategoriesData.value
  } catch (error) {
    console.error({error})
  }
}

</script>
<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateSubcategory
          :categories="categories"
          v-on:createdSubcategory="subCategoriesHandler"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditSubcategory
          :categories="categories"
          :subcategories="subcategories"
          @updatedSubcategory="subCategoriesHandler"
          @selectedNewParentCategory="subCategoriesHandler"
          @deletedSubcategory="subCategoriesHandler"
        />
      </div>
    </div>
  </q-page>

  <!-- <q-page v-if="authStore.userInfo.isAdmin == true">
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateSubcategory
          :categories="categories"
          v-on:createdSubcategory="subCategoriesHandler"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditSubcategory
          :categories="categories"
          :subcategories="subcategories"
          @updatedSubcategory="subCategoriesHandler"
          @selectedNewParentCategory="subCategoriesHandler"
          @deletedSubcategory="subCategoriesHandler"
        />
      </div>
    </div>
  </q-page> -->

  <!-- <q-page v-else class="row justify-center full-height full-width text-center">
    <div class="self-center row full-height justify-center text-h5">Sorry, you lack admin rights..</div>
  </q-page> -->
</template>


<style lang="scss">
h3 {
  margin: 0;
  padding: 2rem 10rem;
}
</style>

