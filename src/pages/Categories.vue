<script setup>
import CreateCategory from '../components/CreateCategory.vue'
import EditCategory from '../components/EditCategory.vue'
import { useFirebase } from 'src/composables/useFirebase';
import { onMounted, ref } from 'vue';

const categories = ref([])

const { getCategoryDocsFromFirebase } = useFirebase()

onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    categories.value = categoriesData.value
  } catch(error) {
    console.warn({error})
  }
})

async function categoriesHandler() {
  try {
   const { categoriesData } = await getCategoryDocsFromFirebase()
   categories.value = categoriesData.value

  } catch (error) {
    console.error({error})
  }
}

</script>
<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <CreateCategory
          @createdCategory="categoriesHandler"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <EditCategory
        :categories="categories"
        @updatedCategory="categoriesHandler"
        @deletedCategory="categoriesHandler"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
</style>
