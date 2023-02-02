<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Edit Product Subcateg</h5>
    <q-form
      ref="editSubcategoryForm"
      @submit="formValidate"
    >
      <q-select
        class="q-pb-lg"
        v-model="selectedCategoryId"
        :options="categoriesQselectOptions"
        outlined
        label="Parent category route"
      />

      <div v-if="selectedCategoryId" class="q-pb-lg">
        <q-select
          outlined
          class="q-pb-lg"
          v-model="selectedSubCategoryId"
          :options="subCategoriesQselectOptions"
          label="Subcategory"
        />

        <q-input
          outlined
          class="q-pb-lg"
          v-model="subCategoryName"
          label="Edit name"
          :rules="[
            (val) => (val && val.length > 0) || 'Name must be filled in.',
          ]"
        />

        <q-input
          outlined
          class="q-pb-lg"
          v-model="subCategoryRoute"
          prefix="/"
          label="Edit route"
          :rules="[
            (val) => (val && val.length > 0) || 'Route must be filled in.',
          ]"
        />

        <div class="row q-gutter-md">
          <q-btn
            unelevated
            rounded
            align="between"
            icon-right="sync"
            color="primary"
            label="Update"
            type="submit"
          />

          <q-btn
            unelevated
            rounded
            align="between"
            color="primary"
            icon-right="delete"
            label="Delete"
            @click="confirm = true"
          />
        </div>

        <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="error" color="red" text-color="white" />
            <span class="q-ml-sm">Are you sure you want to delete <b>{{ selectedSubCategoryId.label }} ?</b></span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat align="between" color="primary" label="Cancel" v-close-popup></q-btn>
            <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
            <q-btn
              flat
              label="Yes"
              color="primary"
              v-close-popup
              @click="deleteSubCategory"
            />
          </q-card-actions>
        </q-card>
        </q-dialog>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications'
const { deleteSubcategoryFromFirebase, updateSubcategoryInFirebase } = useFirebase()
const { triggerPositive, triggerNegative } = useNotifications()
const subcategoryIdBeforeUpdate= ref('')

const emit = defineEmits([
  'updatedSubcategory',
  'selectedNewParentCategory',
  'deletedSubcategory',
])
const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])

const selectedSubCategoryId = ref('')
const subCategoriesQselectOptions = ref([])

const subCategoryName = ref(null)
const subCategoryRoute = ref(null)

const confirm = ref(false)

const props = defineProps({
  categories: {
    type: Array,
    default: []
  },

  subcategories: {
    type: Array,
    default: []
  },

})

watch(() => props.subcategories, () => {
  subCategoriesQselectOptions.value = props.subcategories.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))

  if (subcategoryIdBeforeUpdate.value) {
    let res = props.subcategories.find(c => c.subCategoryId === subcategoryIdBeforeUpdate.value)

    let updatedSubcategory = {
      label: res.subCategoryName,
      value: res.subCategoryId
    }

    selectedSubCategoryId.value = updatedSubcategory
    subcategoryIdBeforeUpdate.value = ''
  }
})

watch(selectedCategoryId, (newCategoryId) => {
  subCategoriesQselectOptions.value = []
  selectedSubCategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''
  subcategoryIdBeforeUpdate.value = ''

  emit('selectedNewParentCategory', newCategoryId)
})

watch(selectedSubCategoryId, (newSubCategoryId) => {
  if (!newSubCategoryId.value) {
    return
  } else {
    let res = props.subcategories.find(c => c.subCategoryId === newSubCategoryId.value)

    subCategoryName.value = res.subCategoryName
    subCategoryRoute.value = res.subCategoryRoute
  }
})

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

const deleteSubCategory = async () => {
  confirm.value = false

  if (!confirm.value) {
    try {
      await deleteSubcategoryFromFirebase(selectedCategoryId.value, selectedSubCategoryId.value)

      triggerPositive(`${subCategoryName.value} subcategory deleted`)

      subCategoriesQselectOptions.value = []
      selectedSubCategoryId.value = ''
      subCategoryName.value = ''
      subCategoryRoute.value = ''

      emit('deletedSubcategory', selectedCategoryId.value)
    } catch(error) {
      console.warn({error})
    }
  }
}

const updateSubCategory = async () => {
  try {
    if (!subCategoryName.value || !subCategoryRoute.value || !selectedCategoryId.value || !selectedSubCategoryId.value) {
      triggerNegative('Fill in all the fields')
      return
    } else {
      const newSubCategory = {
        subCategoryId: toRaw(selectedSubCategoryId.value).value,
        subCategoryName: subCategoryName.value,
        subCategoryRoute: subCategoryRoute.value
      }
      subcategoryIdBeforeUpdate.value = toRaw(selectedSubCategoryId.value).value
      await updateSubcategoryInFirebase(selectedCategoryId.value, selectedSubCategoryId.value, newSubCategory)
      emit('updatedSubcategory', selectedCategoryId.value)
      triggerPositive(`Subcategory updated`)
    }
  } catch(error) {
    console.warn({error})
  }
}
</script>

<style>
</style>
