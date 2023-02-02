<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Create Product Subcategory</h5>
    <q-form
      ref="createSubcategoryForm"
      @submit="formValidate"
    >
      <q-select
        class="q-pb-lg"
        outlined
        v-model="selectedCategoryId"
        :options="categoriesQselectOptions"
        label="Parent category route"
      />

      <div v-if="selectedCategoryId" class="q-pb-lg">
        <q-input
          class="q-pb-lg"
          v-model="subCategoryName"
          outlined
          label="Subcategory name *"
          lazy-rules="ondemand"
          :rules="[
            (val) => (val && val.length > 0) || 'Name must be filled',
          ]"
        />

        <q-input
          class="q-pb-lg"
          v-model="subCategoryRoute"
          outlined
          label="Subcategory route *"
          prefix="/"
          lazy-rules="ondemand"
          :rules="[
            (val) => (val && val.length > 0) || 'Route must be filled',
          ]"
        />

        <q-btn
          unelevated
          rounded
          align="between"
          icon-right="check"
          color="primary"
          label="Create"
          type="submit"
        />
      </div>

    </q-form>
  </div>
</template>

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
const createSubcategoryForm = ref(null)

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

function formValidate () {
  createSubcategoryForm.value.validate().then(success => {
    if (success) {
      createSubCategory()
    }
    else {
      triggerNegative('Please, fill in all the fields')
    }
  })
}

const formReset = () => {
  subCategoryName.value = null
  subCategoryRoute.value = null
  createSubcategoryForm.value.reset()
}

const createSubCategory = async () => {
  try {
    const newSubcategory = {
      subCategoryName: subCategoryName.value,
      subCategoryRoute: subCategoryRoute.value
    }
    await createSubcategoryInFirebase(selectedCategoryId.value, newSubcategory)
    triggerPositive(`${subCategoryName.value} subcategory created`)
    formReset()
    emit('createdSubcategory', selectedCategoryId.value)
  } catch (error) {
    console.warn({ error })
  }
}
</script>
<style lang="scss">

</style>
