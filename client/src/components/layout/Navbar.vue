<template>
  <nav class="bg-gradient-to-r from-[#a3195b] to-[#662482] shadow-lg fixed top-0 left-0 right-0 z-30 h-16">
    <div class="h-full px-8 flex items-center justify-between max-w-full">
      <!-- Menu button (mobile) + Logo -->
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo/Title -->
        <div class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 class="text-xl font-bold text-white hidden sm:block">E-commerce</h1>
        </div>
      </div>

      <!-- User menu -->
      <div class="flex items-center space-x-6">
        <!-- Email (desktop) -->
        <span class="text-sm text-white/90 hidden md:block">admin@gmail.com</span>

        <!-- Notifications -->
        <button class="relative p-2 rounded-lg hover:bg-white/10 transition text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <!-- Badge de notificaciones -->
          <span class="absolute top-1 right-1 w-2 h-2 bg-[#e2312d] rounded-full"></span>
        </button>

        <!-- Profile picture -->
        <div class="relative">
          <button class="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition">
            <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center overflow-hidden">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineEmits(['toggle-sidebar'])
</script>
