<template>
  <div class="q-pa-md">
    <h5 class="q-pb-md">Edit Product Category</h5>
    <q-form
      ref="editCategoryForm"
      @submit="updateCategory"
    >
      <q-select
        class="q-pb-lg"
        v-if="categories.length"
        v-model="selectedCategoryId"
        :options="categoriesQselectOptions"
        outlined label="Available categories"
      />
      <p v-else>No categories. Create the first one on the left</p>

      <div v-if="selectedCategoryId" class="q-pb-lg">

        <q-input
          class="q-pb-lg"
          v-model="state.categoryName"
          outlined
          label="Edit name"
          bottom-slots
          @input="v$.categoryName.$touch()"
          :error="v$.categoryName.$invalid"
        />

        <q-input
          v-model="state.categoryRoute"
          prefix="/"
          outlined
          label="Edit route"
          bottom-slots
          @input="v$.categoryRoute.$touch()"
          :error="v$.categoryRoute.$invalid"
        />

        <div class="row q-gutter-sm">
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
            :disable="!allowUpdate"
            unelevated
            rounded
            align="between"
            icon-right="sync"
            color="primary"
            label="Update"
            type="submit"
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
        <span class="q-ml-sm">Are you sure you want to delete <b>{{ state.categoryName }}</b> ?</span>
      </Modal>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, toRaw, reactive, computed } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import { useNotifications } from 'src/composables/useNotifications';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Modal from './Modal.vue';
import Modal from './ConfirmationModal.vue';

const { updateCategoryInFirebase, deleteCategoryFromFirebase } = useFirebase()
const { triggerPositive, triggerNegative } = useNotifications()
const categoryIdBeforeUpdate = ref('')
const selectedCategoryId= ref(null)
const categoriesQselectOptions = ref([])
const categoryName = ref(null)
const categoryRoute = ref(null)
const showDialog = ref(false)
const editCategoryForm = ref('')

const state = reactive({
  categoryName: '',
  categoryRoute: ''
})

const rules = {
  categoryName: { required }, // Matches state.firstName
  categoryRoute: { required }, // Matches state.lastName
}

const categoryBeforeChange = reactive({
  categoryName: '',
  categoryRoute: ''
})

const allowUpdate = computed(() => {
  if (state.categoryName != categoryBeforeChange.categoryName
  || state.categoryRoute != categoryBeforeChange.categoryRoute) {
    return true
  } else {
    return false
  }
})

const v$ = useVuelidate(rules, state)

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
      categoryName: state.categoryName,
      categoryRoute: state.categoryRoute
    }
    categoryIdBeforeUpdate.value = toRaw(selectedCategoryId.value).value
    await updateCategoryInFirebase(selectedCategoryId.value, newCategory)
    triggerPositive(`Cateogory updated`)
    categoryBeforeChange.categoryName = ''
    categoryBeforeChange.categoryRoute = ''

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
      formReset()
      categoryBeforeChange.categoryName = ''
      categoryBeforeChange.categoryRoute = ''

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

    categoryBeforeChange.categoryName = res.categoryName,
    categoryBeforeChange.categoryRoute = res.categoryRoute
    state.categoryName = res.categoryName
    state.categoryRoute = res.categoryRoute
  }
})
</script>

<style>

</style>

