<script setup>
import { ref } from 'vue';
import Modal from '../components/ConfirmationModal.vue';
import { useNotifications } from 'src/composables/useNotifications';
import { useFirestoreDatabase } from 'src/composables/useFirestoreDatabase';
import { useFirebase } from 'src/composables/useFirebase';
import {useRouter} from 'vue-router';
const { removeImageFromFirebaseStorage } = useFirestoreDatabase();
const { deleteProductFromFirebase } = useFirebase();
const { triggerPositive } = useNotifications();
const showDialog = ref(false);
const router = useRouter();
const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  mainImgUrl: {
    type: String,
    required: false,
  },
  imagesData: {
    type: Array,
    required: false,
  },
  id: {
    type: String,
    required: false,
  }
});

const emit = defineEmits([
  'productDelete',
])

const redirectToEditProduct = () => {
  router.push(`/products/edit/${props.id}`);
}

const handleDelete = async () => {
  showDialog.value = false;
  console.log('bout to delete:', props.name);

  if (showDialog.value == false) {
    try {
      props.imagesData.map(async img => await removeImageFromFirebaseStorage(img));
      await deleteProductFromFirebase(props.id);
      triggerPositive(`${props.name} product deleted`);
      emit('productDelete');
    } catch (error) {
      console.warn({ error })
    }
  }
}
</script>

<template>
  <q-card>
    <q-img :src="props.mainImgUrl" ratio="1" fit="cover">
      <div class="absolute-bottom">
        <div class="text-h6">{{ props.name }}</div>
        <div class="text-subtitle2">{{ props.price }} ₽</div>
      </div>
    </q-img>

    <q-card-actions>
      <q-btn flat @click="showDialog = true">Delete</q-btn>
      <q-btn flat @click="redirectToEditProduct">Edit</q-btn>
    </q-card-actions>
  </q-card>

  <q-dialog v-model="showDialog">
    <Modal
      v-model:open="showDialog"
      @cancel="showDialog = false"
      @submit="handleDelete"
    >
      <q-avatar icon="error" color="red" text-color="white"/>
      <span class="q-ml-sm">Вы действительно хотите удалить продукт {{ props.name }} ?</span>
    </Modal>
  </q-dialog>
</template>

<style lang="scss">
</style>
