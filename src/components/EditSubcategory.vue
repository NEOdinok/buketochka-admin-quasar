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

      <div v-if="selectedCategoryId" class="q-pb-lg">
        <q-select
          outlined
          class="q-pb-lg"
          v-model="selectedSubCategoryId"
          v-if="subcategories.length"
          :options="subCategoriesQselectOptions"
          label="Subcategory"
        />

        <p v-else>No subcategories. Add the first one on the left</p>

        <q-input
          outlined
          class="q-pb-lg"
          v-if="selectedSubCategoryId"
          v-model="state.subCategoryName"
          label="Edit name"
          @input="v$.subCategoryName.$touch()"
          :error="v$.subCategoryName.$invalid"
        />

        <q-input
          outlined
          class="q-pb-lg"
          v-if="selectedSubCategoryId"
          v-model="state.subCategoryRoute"
          prefix="/"
          label="Edit route"
          @input="v$.subCategoryRoute.$touch()"
          :error="v$.subCategoryRoute.$invalid"
        />

        <div class="row q-gutter-md">
          <q-btn
            unelevated
            rounded
            align="between"
            color="primary"
            icon-right="delete"
            label="Delete"
            @click="showDialog = true"
          />

          <q-btn
            unelevated
            rounded
            align="between"
            icon-right="sync"
            color="primary"
            label="Update"
            :disabled="!allowUpdate"
            type="submit"
          />
        </div>
          <Modal
            v-model:open="showDialog"
            @cancel="showDialog = false"
            @submit="deleteSubcategory"
          >
            <q-avatar icon="error" color="red" text-color="white"/>
            <span class="q-ml-sm">Are you sure you want to delete <b>{{ state.subCategoryName }}</b> ?</span>
          </Modal>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch, toRaw, reactive, computed } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Modal from './ConfirmationModal.vue'

const { deleteSubcategoryFromFirebase, updateSubcategoryInFirebase } = useFirebase()
const { triggerPositive } = useNotifications()
const subcategoryIdBeforeUpdate= ref('')
const selectedCategoryId = ref('')
const categoriesQselectOptions = ref([])
const selectedSubCategoryId = ref('')
const subCategoriesQselectOptions = ref([])
// const subCategoryName = ref(null)
// const subCategoryRoute = ref(null)
const editSubcategoryForm = ref(null)
const showDialog = ref(false)

const state = reactive({
  subCategoryName: '',
  subCategoryRoute: ''
})

const rules = {
  subCategoryName: { required }, // Matches state.firstName
  subCategoryRoute: { required },
}

const subCategoryBeforeChange = reactive({
  subCategoryName: '',
  subCategoryRoute: ''
})

const v$ = useVuelidate(rules, state)

const allowUpdate = computed(() => {
  if (state.subCategoryName != subCategoryBeforeChange.subCategoryName
  || state.subCategoryRoute != subCategoryBeforeChange.subCategoryRoute) {
    return true
  } else {
    return false
  }
})

const emit = defineEmits([
  'updatedSubcategory',
  'selectedNewParentCategory',
  'deletedSubcategory',
])

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

    const updatedSubcategory = {
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
  selectedSubCategoryId.value = ''
  state.subCategoryName = ''
  state.subCategoryRoute = ''
  subcategoryIdBeforeUpdate.value = ''

  emit('selectedNewParentCategory', newCategoryId)
})

watch(selectedSubCategoryId, (newSubcategoryId) => {
  if (!newSubcategoryId.value) {
    return
  } else {
    let res = props.subcategories.find(c => c.subCategoryId === newSubcategoryId.value)
    subCategoryBeforeChange.subCategoryName = res.subCategoryName,
    subCategoryBeforeChange.subCategoryRoute = res.subCategoryRoute

    state.subCategoryName = res.subCategoryName
    state.subCategoryRoute = res.subCategoryRoute
  }
})

const formReset = () => {
  subCategoriesQselectOptions.value = []
  selectedSubCategoryId.value = ''
  state.subCategoryName = ''
  state.subCategoryRoute = ''
  editSubcategoryForm.value.reset()
}

const deleteSubcategory = async () => {
  showDialog.value = false

  if (!showDialog.value) {
    try {
      await deleteSubcategoryFromFirebase(selectedCategoryId.value, selectedSubCategoryId.value)
      triggerPositive(`${state.subCategoryName} subcategory deleted`)
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
      subCategoryId: toRaw(selectedSubCategoryId.value).value,
      subCategoryName: state.subCategoryName,
      subCategoryRoute: state.subCategoryRoute
    }
    subcategoryIdBeforeUpdate.value = toRaw(selectedSubCategoryId.value).value
    await updateSubcategoryInFirebase(selectedCategoryId.value, selectedSubCategoryId.value, newSubcategory)
    emit('updatedSubcategory', selectedCategoryId.value)
    triggerPositive(`Subcategory updated`)
  } catch(error) {
    console.warn({error})
  }
}
</script>

<style>
</style>
