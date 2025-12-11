<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
      <div class="flex items-center justify-center min-h-screen px-4 py-8">
        <!-- Backdrop con blur -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all" @click="$emit('close')"></div>

        <!-- Modal con glassmorphism -->
        <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full mx-auto z-50 border border-gray-200/50 animate-slide-up">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-[#a3195b] to-[#662482] flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            </div>
            <button @click="$emit('close')" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 p-6 border-t border-gray-200/50 bg-gray-50/50">
            <button @click="$emit('close')" class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm">
              Cancelar
            </button>
            <button @click="$emit('confirm')" class="px-5 py-2.5 text-white bg-gradient-to-r from-[#a3195b] to-[#662482] rounded-lg hover:from-[#8a1450] hover:to-[#551d6d] transition shadow-lg font-medium">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  confirmText: {
    type: String,
    default: 'Confirmar'
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
