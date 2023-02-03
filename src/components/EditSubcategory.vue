<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Edit Product Subcategory</h5>
    <q-form
      ref="editSubcategoryForm"
      @submit="updateSubCategory"
    >
      <q-select
        class="q-pb-lg"
        v-model="selectedCategoryId"
        :options="categoriesQselectOptions"
        outlined
        label="Parent category route"
      />

      <div v-if="selectedCategoryId && subcategories.length" class="q-pb-lg">
        <q-select
          outlined
          class="q-pb-lg"
          v-model="selectedSubcategoryId"
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
            @click="showDialog = true"
          />
        </div>
          <Modal :open="showDialog" @cancel="showDialog = false" @submit="deleteSubcategory" @request-hide="showDialog = false">
            <q-avatar icon="error" color="red" text-color="white" />
            <span class="q-ml-sm">Are you sure you want to delete <b>{{ subCategoryName }}</b> ?</span>
          </Modal>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications'
import Modal from './ConfirmationModal.vue'

const { deleteSubcategoryFromFirebase, updateSubcategoryInFirebase } = useFirebase()
const { triggerPositive } = useNotifications()
const subcategoryIdBeforeUpdate= ref('')

const emit = defineEmits([
  'updatedSubcategory',
  'selectedNewParentCategory',
  'deletedSubcategory',
])
const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])
const selectedSubcategoryId = ref('')
const subCategoriesQselectOptions = ref([])
const subCategoryName = ref(null)
const subCategoryRoute = ref(null)
const editSubcategoryForm = ref(null)
const showDialog = ref(false)

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

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
})

watch(selectedCategoryId, (newCategoryId) => {
  subCategoriesQselectOptions.value = []
  selectedSubcategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''
  subcategoryIdBeforeUpdate.value = ''

  emit('selectedNewParentCategory', newCategoryId)
})

watch(selectedSubcategoryId, (newSubcategoryId) => {
  if (!newSubcategoryId.value) {
    return
  } else {
    let res = props.subcategories.find(c => c.subCategoryId === newSubcategoryId.value)

    subCategoryName.value = res.subCategoryName
    subCategoryRoute.value = res.subCategoryRoute
  }
})

const formReset = () => {
  subCategoriesQselectOptions.value = []
  selectedSubcategoryId.value = ''
  subCategoryName.value = ''
  subCategoryRoute.value = ''
  editSubcategoryForm.value.reset()
}

const deleteSubcategory = async () => {
  showDialog.value = false

  if (!showDialog.value) {
    try {
      await deleteSubcategoryFromFirebase(selectedCategoryId.value, selectedSubcategoryId.value)
      triggerPositive(`${subCategoryName.value} subcategory deleted`)
      formReset()
      emit('deletedSubcategory', selectedCategoryId.value)
    } catch(error) {
      console.warn({error})
    }
  }
}

const updateSubCategory = async () => {
  try {
    const newSubcategory = {
      subCategoryId: toRaw(CelectedSubcategoryId.value).value,
      subCategoryName: subCategoryName.value,
      subCategoryRoute: subCategoryRoute.value
    }
    subcategoryIdBeforeUpdate.value = toRaw(selectedSubcategoryId.value).value
    await updateSubcategoryInFirebase(selectedCategoryId.value, selectedSubcategoryId.value, newSubcategory)
    emit('updatedSubcategory', selectedCategoryId.value)
    triggerPositive(`Subcategory updated`)
  } catch(error) {
    console.warn({error})
  }
}
</script>

<style>
</style>
