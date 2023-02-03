<template>
  <q-dialog v-model="modalOpen">
    <q-card>
      <h4>{{ modalTitle }}</h4>
      <q-btn @click="$emit('update:counter', counter + 1)"></q-btn>
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
    counter: {
      type: Number,
    },
    modalTitle: {
      type: String
    }
  })
const emit = defineEmits([
  'submit',
  'cancel',
  'request-hide',

  'update:open',
  'update:counter',
])

const modalOpen = computed({
  get() {
    return props.open;
  },
  set(open) {
    emit('update:open', open);
  }
})
</script>
