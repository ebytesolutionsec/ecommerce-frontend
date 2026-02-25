<template>
  <Transition name="loading-overlay">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    >
      <div class="text-center px-6">
        <!-- Anillo animado con icono al centro -->
        <div class="relative w-28 h-28 mx-auto mb-8">
          <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <svg class="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="url(#overlay-gradient)" stroke-width="4" stroke-linecap="round" stroke-dasharray="200" stroke-dashoffset="140"/>
            <defs>
              <linearGradient id="overlay-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a3195b"/>
                <stop offset="100%" stop-color="#662482"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#a3195b] to-[#662482] flex items-center justify-center shadow-lg">
              <slot name="icon">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </slot>
            </div>
          </div>
        </div>

        <!-- Textos -->
        <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ title }}</h3>
        <p v-if="message" class="text-gray-500 text-base mb-6">{{ message }}</p>

        <!-- Puntos animados -->
        <div class="flex justify-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-[#a3195b] animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-[#a3195b] animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-[#a3195b] animate-bounce" style="animation-delay: 300ms"></div>
        </div>

        <!-- Badge opcional -->
        <div v-if="badge" class="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          {{ badge }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Cargando...'
  },
  message: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-overlay-enter-active {
  transition: opacity 0.3s ease;
}
.loading-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
}
</style>
