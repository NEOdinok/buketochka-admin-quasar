<template>
<q-card>
  <q-card-section class="row items-center">
    <slot></slot>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn
      flat
      label="Cancel"
      color="primary"
      @click="$emit('modalCancel')"
    />

    <q-btn
      flat
      label="Delete"
      color="primary"
      @click="$emit('modalSubmitDelete')"
    />
  </q-card-actions>
</q-card>
</template>

<script setup>
const emit = defineEmits([
  'modalSubmitDelete',
  'modalCancel'
])
</script>
