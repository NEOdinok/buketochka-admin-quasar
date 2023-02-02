import { useQuasar } from 'quasar'

export function useNotifications() {
  const $q = useQuasar()

  function triggerPositive(message) {
    $q.notify({
      type: 'positive',
      timeout: 1000,
      position: 'top-right',
      message
    })
  }

  function triggerNegative(message) {
    $q.notify({
      type: 'negative',
      timeout: 1000,
      position: 'top-right',
      message
    })
  }

  return {
    triggerPositive,
    triggerNegative
  }
}
