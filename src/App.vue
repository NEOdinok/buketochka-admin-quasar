<template>
  <router-view />
</template>

<script>
import { useAuthStore } from './stores/authStore';

// export default defineComponent({
//   name: 'App'
// })

export default {
  setup() {
    const authStore = useAuthStore()

    return {authStore}
  }
}

</script>
