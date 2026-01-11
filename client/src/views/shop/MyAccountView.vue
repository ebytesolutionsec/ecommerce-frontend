<template>
  <div class="min-h-screen bg-gray-50">
    <ShopNavbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- No autenticado -->
      <div v-if="!isAuthenticated" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-[#a3195b] to-[#662482] rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido a Mi Cuenta</h2>
          <p class="text-gray-600 mb-8">
            Para acceder a tu cuenta y ver tus pedidos, necesitas iniciar sesión o registrarte.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/login"
              class="px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/registro"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Crear Cuenta
            </router-link>
          </div>
        </div>
      </div>

      <!-- Autenticado -->
      <div v-else class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-r from-[#a3195b] to-[#662482] rounded-full mx-auto mb-3 flex items-center justify-center">
                <span class="text-2xl font-bold text-white">
                  {{ userInitials }}
                </span>
              </div>
              <h3 class="font-semibold text-gray-800">{{ userName }}</h3>
              <p class="text-sm text-gray-500">{{ userEmail }}</p>
            </div>

            <nav class="space-y-2">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="selectedView = item.id"
                class="w-full text-left px-4 py-3 rounded-lg transition flex items-center space-x-3"
                :class="selectedView === item.id
                  ? 'bg-gradient-to-r from-[#a3195b]/10 to-[#662482]/10 text-[#a3195b] font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-3">
          <!-- Mi Perfil -->
          <div v-if="selectedView === 'profile'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <p class="text-gray-900">{{ userData.nombre }} {{ userData.apellido }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <p class="text-gray-900">{{ userData.correo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <p class="text-gray-900">{{ userData.telefono || 'No registrado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <p class="text-gray-900">{{ userData.direccion || 'No registrada' }}</p>
              </div>
              <button class="mt-4 px-6 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition">
                Editar Perfil
              </button>
            </div>
          </div>

          <!-- Mis Órdenes -->
          <div v-else-if="selectedView === 'orders'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Mis Órdenes</h2>
            <div class="text-center py-12">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">Aún no tienes órdenes</p>
            </div>
          </div>

          <!-- Métodos de Pago -->
          <div v-else-if="selectedView === 'payment'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Métodos de Pago</h2>
            <div class="text-center py-12">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p class="text-gray-500">No tienes métodos de pago registrados</p>
            </div>
          </div>

          <!-- Direcciones -->
          <div v-else-if="selectedView === 'addresses'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Mis Direcciones</h2>
            <div class="text-center py-12">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p class="text-gray-500">No tienes direcciones registradas</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ShopFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth.js'
import ShopNavbar from '../../components/shop/ShopNavbar.vue'
import ShopFooter from '../../components/shop/ShopFooter.vue'

const { isAuthenticated, user } = useAuth()

const selectedView = ref('profile')
const userData = ref({
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  direccion: ''
})

// Computed
const userName = computed(() => {
  if (userData.value.nombre && userData.value.apellido) {
    return `${userData.value.nombre} ${userData.value.apellido}`
  }
  return 'Usuario'
})

const userEmail = computed(() => {
  return userData.value.correo || 'email@ejemplo.com'
})

const userInitials = computed(() => {
  const nombre = userData.value.nombre || ''
  const apellido = userData.value.apellido || ''
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || 'U'
})

// Menu Items
const menuItems = [
  {
    id: 'profile',
    label: 'Mi Perfil',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
    }
  },
  {
    id: 'orders',
    label: 'Mis Órdenes',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
    }
  },
  {
    id: 'payment',
    label: 'Métodos de Pago',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`
    }
  },
  {
    id: 'addresses',
    label: 'Mis Direcciones',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
    }
  }
]

// Methods
const loadUserData = () => {
  if (user.value) {
    userData.value = { ...user.value }
  }
}

onMounted(() => {
  loadUserData()
})
</script>
