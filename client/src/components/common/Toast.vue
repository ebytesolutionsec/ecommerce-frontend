<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      :class="[
        'fixed top-20 right-6 max-w-md w-full shadow-lg rounded-xl pointer-events-auto overflow-hidden z-50',
        'border-l-4',
        typeClasses[type].border,
        typeClasses[type].bg
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <!-- Icono -->
          <div class="flex-shrink-0">
            <svg
              :class="['w-6 h-6', typeClasses[type].icon]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="type === 'success'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else-if="type === 'error'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else-if="type === 'warning'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Contenido -->
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p :class="['text-sm font-semibold', typeClasses[type].title]">
              {{ title }}
            </p>
            <p v-if="message" :class="['mt-1 text-sm', typeClasses[type].text]">
              {{ message }}
            </p>
          </div>

          <!-- Botón cerrar -->
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              :class="[
                'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                typeClasses[type].closeButton
              ]"
            >
              <span class="sr-only">Cerrar</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div
        v-if="duration > 0"
        :class="['h-1', typeClasses[type].progress]"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const progressWidth = ref(100)
let progressInterval = null
let autoCloseTimeout = null

const typeClasses = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    icon: 'text-green-500',
    title: 'text-green-800',
    text: 'text-green-700',
    closeButton: 'text-green-500 hover:text-green-600 focus:ring-green-500',
    progress: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    icon: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
    closeButton: 'text-red-500 hover:text-red-600 focus:ring-red-500',
    progress: 'bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
    closeButton: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500',
    progress: 'bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    text: 'text-blue-700',
    closeButton: 'text-blue-500 hover:text-blue-600 focus:ring-blue-500',
    progress: 'bg-blue-500'
  }
}

const close = () => {
  clearTimers()
  emit('close')
}

const clearTimers = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
}

const startAutoClose = () => {
  if (props.duration > 0) {
    progressWidth.value = 100

    // Actualizar barra de progreso
    const interval = 50
    const step = (100 / props.duration) * interval
    progressInterval = setInterval(() => {
      progressWidth.value -= step
      if (progressWidth.value <= 0) {
        clearInterval(progressInterval)
      }
    }, interval)

    // Auto cerrar después del duration
    autoCloseTimeout = setTimeout(() => {
      close()
    }, props.duration)
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    startAutoClose()
  } else {
    clearTimers()
  }
})

onMounted(() => {
  if (props.show) {
    startAutoClose()
  }
})
</script>
