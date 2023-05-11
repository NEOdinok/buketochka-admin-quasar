<template>
  <q-dialog v-model="modalOpen">
    <q-card>
      <q-card-section class="row items-center">
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="$emit('cancel')" />

        <q-btn flat label="Delete" color="primary" @click="$emit('submit')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
  },
  modalTitle: {
    type: String
  }
})

const emit = defineEmits([
  'submit',
  'cancel',
  'update:open',
])

//proxy for recieved 'open' prop
const modalOpen = computed({
  get() {
    return props.open;
  },
  set(open) {
    emit('update:open', open);
  }
})
</script>
