<template>
  <div class="q-pa-md">
    <q-input
      outlined
      label="Product name"
      class="q-pb-lg"
      v-model="state.productName"
      error-message="Product name is required"
      bottom-slots
      @update:model-value="v$.productName.$touch()"
      :error="v$.productName.$error"
    />

    <q-input
      outlined
      label="Product price"
      class="q-pb-lg"
      v-model="state.productPrice"
      error-message="Please enter valid price"
      bottom-slots
      @update:model-value="v$.productPrice.$touch()"
      :error="v$.productPrice.$error"
    />

    <q-input
      outlined
      label="Product quantity"
      class="q-pb-lg"
      v-model="state.productQuantity"
      error-message="Please enter valid quantity"
      bottom-slots
      @update:model-value="v$.productQuantity.$touch()"
      :error="v$.productQuantity.$error"
    />

    <q-select
      outlined
      label="Parent category"
      class="q-pb-lg"
      v-if="categoriesQselectOptions.length"
      v-model="selectedCategory"
      :options="categoriesQselectOptions"
    />

    <p v-else>No product categories</p>

    <q-select
      outlined
      label="Product Subcategory"
      class="q-pb-lg"
      v-if="subCategoriesQselectOptions.length"
      v-model="selectedSubCategory"
      :options="subCategoriesQselectOptions"
    />

    <q-input
      filled
      clearable
      type="textarea"
      color="primary"
      label="Product Description"
    />
  </div>
</template>

<script setup>
import { useFirebase } from 'src/composables/useFirebase';
import { onMounted, ref, watch, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, integer, minValue } from '@vuelidate/validators'

const { getCategoryDocsFromFirebase, getSubcategoryDocsFromFirebase } = useFirebase()
const categories = ref([])
const categoriesQselectOptions = ref([])
const selectedCategory = ref(null)
const subcategories = ref([])
const subCategoriesQselectOptions = ref([])
const selectedSubCategory = ref(null)

const state = reactive({
  productName: '',
  productPrice: '',
  productQuantity: '',
})

const rules = {
  productName: { required },
  productPrice: { required, integer, minValue: minValue(1) },
  productQuantity: { required, integer, minValue: minValue(1) }
}

const v$ = useVuelidate(rules, state)

onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    categories.value = categoriesData.value
  } catch(error) {
    console.warn({error})
  }
})

watch(categories, () => {
  categoriesQselectOptions.value = categories.value.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

watch(selectedCategory, async (newCategory) => {
  try {
    subCategoriesQselectOptions.value = []
    selectedSubCategory.value = ''

    const { subcategoriesData } = await getSubcategoryDocsFromFirebase(newCategory)
    subcategories.value = subcategoriesData.value
  } catch (error) {
    console.error({error})
  }
})

watch(subcategories, () => {
  subCategoriesQselectOptions.value = subcategories.value.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))
})

</script>

<style>
</style>
