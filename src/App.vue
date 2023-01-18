<template>
  <router-view />
</template>

<script>
import { useTestStore } from './stores/TestStore';

// export default defineComponent({
//   name: 'App'
// })

export default {
  setup() {
    const testStore = useTestStore()

    return {testStore}
  }
}

</script>
