<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Edit Product Category</h5>
    <q-form
      ref="editCategoryForm"
      @submit="updateCategory"
    >
      <q-select
        class="q-pb-lg"
        v-model="selectedCategoryId"
        :options="categoriesQselectOptions"
        outlined label="Available categories"
      />

      <div v-if="selectedCategoryId" class="q-pb-lg">
        <q-input
          class="q-pb-lg"
          v-model="categoryName"
          outlined
          label="Edit name"
          :rules="[
            (val) => (val && val.length > 0) || 'Name must be filled in.',
          ]"
        />

        <q-input
          v-model="categoryRoute"
          prefix="/"
          outlined
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
      </div>

    </q-form>

    <q-dialog v-model="showDialog">
      <Modal
        @modalCancel="showDialog = false"
        @modalSubmitDelete="deleteCategory"
      >
        <q-avatar icon="error" color="red" text-color="white"/>
        <span class="q-ml-sm">Are you sure you want to delete <b>{{ categoryName }}</b> ?</span>
      </Modal>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications';
import Modal from './Modal.vue';

const { updateCategoryInFirebase, deleteCategoryFromFirebase } = useFirebase()
const { triggerPositive, triggerNegative } = useNotifications()
const categoryIdBeforeUpdate = ref('')
const selectedCategoryId= ref(null)
const categoriesQselectOptions = ref([])
const categoryName = ref(null)
const categoryRoute = ref(null)
const showDialog = ref(false)
const editCategoryForm = ref('')

const emit = defineEmits([
  'updatedCategory',
  'deletedCategory'
])

const props = defineProps({
  categories: {
    type: Array,
    default: []
  }
})

const updateCategory = async () => {
  try {
    const newCategory = {
      categoryName: categoryName.value,
      categoryRoute: categoryRoute.value
    }
    categoryIdBeforeUpdate.value = toRaw(selectedCategoryId.value).value
    await updateCategoryInFirebase(selectedCategoryId.value, newCategory)
    triggerPositive(`Cateogory updated`)
    emit('updatedCategory', selectedCategoryId.value)
  } catch (error) {
    console.warn({ error })
  }
}

const formReset = () => {
  categoriesQselectOptions.value = []
  selectedCategoryId.value = ''
  categoryName.value = ''
  categoryRoute.value = ''
  editCategoryForm.value.reset()
}

const deleteCategory = async () => {
  showDialog.value = false

  if (!showDialog.value) {
    try {
      await deleteCategoryFromFirebase(selectedCategoryId.value)

      triggerPositive(`${categoryName.value} category deleted`)

      categoriesQselectOptions.value = []
      selectedCategoryId.value = ''
      categoryName.value = ''
      categoryRoute.value = ''

      emit('deletedCategory', selectedCategoryId.value)
    } catch (error) {
      console.warn({ error })
    }
  }
}

watch(() => props.categories, () => {
  categoriesQselectOptions.value = props.categories.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))

  if (categoryIdBeforeUpdate.value) {
    let res = props.categories.find(c => c.categoryId === categoryIdBeforeUpdate.value)

    let updatedCategory = {
      label: res.categoryName,
      value: res.categoryId
    }

    selectedCategoryId.value = updatedCategory
    categoryIdBeforeUpdate.value = ''
  }
})

watch(selectedCategoryId, (newCategoryId) => {
  if (!newCategoryId.value) {
    return
  } else {
    let res = props.categories.find(c => c.categoryId === newCategoryId.value)

    categoryName.value = res.categoryName
    categoryRoute.value = res.categoryRoute
  }
})
</script>

<style>

</style>

