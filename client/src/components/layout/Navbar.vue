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

        <!-- Profile picture with dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition"
          >
            <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center overflow-hidden">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <!-- Icono dropdown -->
            <svg
              class="w-4 h-4 text-white transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 top-full mt-5 w-56 rounded-xl shadow-lg bg-gradient-to-br from-[#f8edf2] to-[#f3edf5] border border-[#a3195b]/20 dropdown-with-arrow"
            >
              <div class="py-1 overflow-hidden rounded-xl">
                <!-- Editar Perfil -->
                <button
                  @click="openEditProfile"
                  class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#a3195b]/20 hover:to-[#662482]/20 transition-all group"
                >
                  <svg class="w-5 h-5 mr-3 text-[#a3195b] group-hover:text-[#8a1450] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="font-medium">Editar Perfil</span>
                </button>

                <!-- Divider -->
                <div class="border-t border-[#a3195b]/10"></div>

                <!-- Cerrar Sesión -->
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all group"
                >
                  <svg class="w-5 h-5 mr-3 group-hover:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span class="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const emit = defineEmits(['toggle-sidebar', 'open-edit-profile'])
const router = useRouter()
const { logout } = useAuth()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const openEditProfile = () => {
  closeDropdown()
  emit('open-edit-profile')
}

const handleLogout = () => {
  closeDropdown()
  logout()
  router.push('/login')
}

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Triángulo apuntando hacia arriba en el dropdown */
.dropdown-with-arrow::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(163, 25, 91, 0.2);
  z-index: 10;
}

.dropdown-with-arrow::after {
  content: '';
  position: absolute;
  top: -7px;
  right: 21px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid #f8edf2;
  z-index: 11;
}
</style>
