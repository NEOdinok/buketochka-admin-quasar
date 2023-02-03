<template>
  <q-dialog :model-value="open" @hide="$emit('request-hide')">
    <q-card>
      <q-card-section class="row items-center">
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="$emit('submit')" />

        <q-btn flat label="Delete" color="primary" @click="$emit('cancel')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
    open: {
      type: Boolean,
    },
  })
const emit = defineEmits([
  'submit',
  'cancel',
  'request-hide',
])
</script>
