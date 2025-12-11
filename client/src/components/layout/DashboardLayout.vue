<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />

    <!-- Main content -->
    <main class="pt-16 lg:pl-64 transition-all duration-300">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>
