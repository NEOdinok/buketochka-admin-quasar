<template>
  <q-layout view="hHh Lpr lff">

  <q-page-container>
    <router-view />
  </q-page-container>

  </q-layout>
</template>

<script>
import { useRoute } from "vue-router"

export default {
  setup () {
    const route = useRoute()

    return {
    }
  }
}
</script>
