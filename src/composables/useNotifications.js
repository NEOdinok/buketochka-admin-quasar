import { useQuasar } from 'quasar'

export function useNotifications() {
  const $q = useQuasar()
  const myNotify = () => void 0;

  function triggerPositive(message) {
    $q.notify({
      type: 'positive',
      timeout: 1500,
      position: 'top-right',
      message
    })
  }

  function triggerNegative(message) {
    $q.notify({
      type: 'negative',
      timeout: 1500,
      position: 'top-right',
      message
    })
  }

  function triggerSpinner(message) {
     const dismissNotification = $q.notify({
      spinner: true,
      timeout: 0,
      position: 'top-right',
      message,
    })
    return dismissNotification
  }

  return {
    triggerPositive,
    triggerNegative,
    triggerSpinner,
  }
}
