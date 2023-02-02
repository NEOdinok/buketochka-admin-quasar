<script setup>
import { ref, watch, toRaw } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications';

const { updateCategoryInFirebase, deleteCategoryFromFirebase } = useFirebase()
const { triggerPositive, triggerNegative } = useNotifications()
const categoryIdBeforeUpdate = ref('')
const selectedCategoryId= ref(null)
const categoriesQselectOptions = ref([])
const categoryName = ref(null)
const categoryRoute = ref(null)
const confirm = ref(false)

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
    if (!categoryName.value || !categoryRoute.value || !selectedCategoryId.value) {
      triggerNegative('Fill in all the fields')
      return
    } else {
      try {
        const newCategory = {
          categoryName: categoryName.value,
          categoryRoute: categoryRoute.value
        }
        categoryIdBeforeUpdate.value = toRaw(selectedCategoryId.value).value
        await updateCategoryInFirebase(selectedCategoryId.value, newCategory)
        triggerPositive(`Cateogory updated`)
        emit('updatedCategory', selectedCategoryId.value)
      } catch(error) {
        console.warn({error})
      }
    }
  } catch (error) {
    console.warn({ error })
  }
}

const deleteCategory = async () => {
  confirm.value = false

  if (!confirm.value) {
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

const handleModal = () => {
  if (!selectedCategoryId.value) {
    triggerNegative('No category selected')
    return
  } else {
    confirm.value = true
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

<template>
  <div class="edit-category-wrap q-pa-md">
    <div class="q-gutter-md">

      <h5>Edit Product Category</h5>

      <q-select v-model="selectedCategoryId" :options="categoriesQselectOptions" outlined label="Available categories"/>

      <q-input v-model="categoryName" outlined label="Edit name"/>

      <q-input v-model="categoryRoute" outlined label="Edit route" />

      <div class="row">
        <div class="q-gutter-xs">
          <q-btn
            unelevated
            rounded
            align="between"
            icon-right="sync"
            color="primary"
            label="Update"
            @click="updateCategory"
          />

          <q-btn
            unelevated
            rounded
            align="between"
            color="primary"
            icon-right="delete"
            label="Delete"
            @click="handleModal"
          />
        </div>
      </div>

      <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="error" color="red" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete <b>{{ selectedCategoryId.label }} ?</b></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat align="between" color="primary" label="Cancel" v-close-popup></q-btn>
          <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
          <q-btn
            flat
            label="Yes"
            color="primary"
            v-close-popup
            @click="deleteCategory"
          />
        </q-card-actions>
      </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style>

</style>

