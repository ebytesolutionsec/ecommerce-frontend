<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="animate-spin rounded-full border-b-2 border-[#a3195b]" :class="sizeClass"></div>
    <span v-if="message" class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: 'py-20'
  },
  size: {
    type: String,
    default: 'lg'
  }
})

const sizeClass = computed(() => {
  const sizes = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return sizes[props.size] || sizes.lg
})
</script>
