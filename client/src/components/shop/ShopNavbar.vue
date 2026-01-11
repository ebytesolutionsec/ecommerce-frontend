<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <!-- Top Bar con logo, búsqueda, carrito y cuenta -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-[#a3195b] to-[#662482] rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">E</span>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-[#a3195b] to-[#662482] bg-clip-text text-transparent">
              EBYTE
            </span>
          </router-link>
        </div>

        <!-- Barra de búsqueda (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-2xl mx-8">
          <div class="w-full relative">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="Buscar productos..."
              class="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
            />
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-md hover:opacity-90 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Acciones (Carrito y Cuenta) -->
        <div class="flex items-center space-x-4">
          <!-- Carrito -->
          <router-link
            to="/carrito"
            class="relative p-2 text-gray-700 hover:text-[#a3195b] transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-[#e2312d] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- Mi Cuenta -->
          <div class="relative" ref="accountDropdownRef">
            <button
              @click="toggleAccountDropdown"
              class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-[#a3195b] transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="hidden lg:block text-sm font-medium">Mi Cuenta</span>
            </button>

            <!-- Dropdown Mi Cuenta -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isAccountDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200"
              >
                <router-link
                  to="/mi-cuenta"
                  @click="closeAccountDropdown"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#f8edf2] hover:to-[#f3edf5] transition"
                >
                  Mi Perfil
                </router-link>
                <router-link
                  to="/mis-ordenes"
                  @click="closeAccountDropdown"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#f8edf2] hover:to-[#f3edf5] transition"
                >
                  Mis Órdenes
                </router-link>
                <hr class="my-2 border-gray-200" />
                <router-link
                  to="/login"
                  @click="closeAccountDropdown"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#f8edf2] hover:to-[#f3edf5] transition"
                >
                  Iniciar Sesión
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Menu Mobile -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-700 hover:text-[#a3195b]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de búsqueda (Mobile) -->
      <div class="md:hidden pb-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Buscar productos..."
            class="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-md hover:opacity-90 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Categorías (Desktop) -->
    <div class="hidden md:block border-t border-gray-200 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-8 h-12">
          <button
            v-for="category in categories"
            :key="category._id || category.id"
            @click="selectCategory(category)"
            class="text-sm font-medium text-gray-700 hover:text-[#a3195b] transition whitespace-nowrap"
            :class="{ 'text-[#a3195b] font-bold': (selectedCategory?._id || selectedCategory?.id) === (category._id || category.id) }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-4 space-y-2">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categorías</div>
          <button
            v-for="category in categories"
            :key="category._id || category.id"
            @click="selectCategory(category)"
            class="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-[#f8edf2] hover:to-[#f3edf5] transition"
            :class="{ 'bg-gradient-to-r from-[#a3195b]/10 to-[#662482]/10 text-[#a3195b] font-bold': (selectedCategory?._id || selectedCategory?.id) === (category._id || category.id) }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCart } from '../../composables/useCart.js'
import { categoryService } from '../../services/categoryService.js'

const router = useRouter()
const route = useRoute()
const { cartItemCount } = useCart()

// Estado
const searchQuery = ref('')
const categories = ref([{ _id: 'all', name: 'Todos' }])
const selectedCategory = ref(null)
const isAccountDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)
const accountDropdownRef = ref(null)

// Cargar categorías desde el backend
const loadCategories = async () => {
  try {
    const response = await categoryService.listPublic()
    if (response.data && response.data.length > 0) {
      // Agregar "Todos" al principio y luego las categorías reales
      categories.value = [
        { _id: 'all', name: 'Todos' },
        ...response.data
      ]
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

// Búsqueda
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'home', query: { search: searchQuery.value } })
    isMobileMenuOpen.value = false
  }
}

// Categorías
const selectCategory = (category) => {
  selectedCategory.value = category
  if (category._id === 'all' || category.id === 'all') {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'home', query: { category: category._id || category.id } })
  }
  isMobileMenuOpen.value = false
}

// Dropdown Mi Cuenta
const toggleAccountDropdown = () => {
  isAccountDropdownOpen.value = !isAccountDropdownOpen.value
}

const closeAccountDropdown = () => {
  isAccountDropdownOpen.value = false
}

// Menu Mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Click fuera del dropdown
const handleClickOutside = (event) => {
  if (accountDropdownRef.value && !accountDropdownRef.value.contains(event.target)) {
    closeAccountDropdown()
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await loadCategories()

  // Sincronizar categoría seleccionada con la query de la URL
  if (route.query.category) {
    selectedCategory.value = categories.value.find(
      c => c._id === route.query.category || c.id === route.query.category
    )
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
