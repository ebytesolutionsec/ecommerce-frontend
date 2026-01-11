import { ref } from 'vue'

const toastState = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  duration: 3000
})

export function useToast() {
  const showToast = ({ type = 'info', title, message = '', duration = 3000 }) => {
    toastState.value = {
      show: true,
      type,
      title,
      message,
      duration
    }
  }

  const success = (title, message = '', duration = 3000) => {
    showToast({ type: 'success', title, message, duration })
  }

  const error = (title, message = '', duration = 3000) => {
    showToast({ type: 'error', title, message, duration })
  }

  const warning = (title, message = '', duration = 3000) => {
    showToast({ type: 'warning', title, message, duration })
  }

  const info = (title, message = '', duration = 3000) => {
    showToast({ type: 'info', title, message, duration })
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  return {
    toastState,
    showToast,
    success,
    error,
    warning,
    info,
    hideToast
  }
}
