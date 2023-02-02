<script setup>
import { ref, watch } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications';

const { triggerPositive, triggerNegative } = useNotifications()
const { createSubcategoryInFirebase } = useFirebase()
const emit = defineEmits(['createdSubcategory'])
const selectedCategoryId= ref('')
const categoriesQselectOptions = ref([])
const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const props = defineProps({
  propCategories: {
    type: Array,
    default: []
  },
  categories: {
    type: Array,
    default: []
  }
})

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

const createSubCategory = async () => {
  try {
    if (!subCategoryName.value || !subCategoryRoute.value) {
      triggerNegative('Fill in all the fields')
      return
    } else {
      const newSubcategory = {
        subCategoryName: subCategoryName.value,
        subCategoryRoute: subCategoryRoute.value
      }

      await createSubcategoryInFirebase(selectedCategoryId.value, newSubcategory)
    }
    triggerPositive(`${subCategoryName.value} subcategory created`)

    subCategoryName.value = ''
    subCategoryRoute.value = ''

    emit('createdSubcategory', selectedCategoryId.value)
  } catch (error) {
    console.warn({ error })
  }
}
</script>

<template>
  <div class="edit-category-wrap q-gutter-md q-mt-xl">

      <div class="q-gutter-md">
        <h5>Create Product Subcategory</h5>
      </div>

      <div class="q-gutter-md">
        <q-select v-model="selectedCategoryId" outlined :options="categoriesQselectOptions" label="Parent category route" />

        <q-input v-model="subCategoryName" outlined label="Subcategory name" />

        <q-input v-model="subCategoryRoute" outlined label="Subcategory path" />

        <q-btn
          unelevated
          rounded
          align="between"
          icon-right="check"
          color="primary"
          label="Create"
          @click="createSubCategory"
        />
      </div>


  </div>
</template>

<style lang="scss">

</style>
