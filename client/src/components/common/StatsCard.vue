<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
    <p class="text-3xl font-bold text-gray-800 mt-2">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
})
</script>
