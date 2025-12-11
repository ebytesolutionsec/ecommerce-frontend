<template>
  <aside
    class="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 z-20"
    :class="[
      'w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <nav class="p-4 space-y-2">
      <!-- Menu items -->
      <a
        v-for="item in menuItems"
        :key="item.name"
        href="#"
        @click.prevent="handleItemClick(item)"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition"
        :class="activeItem === item.name ? 'bg-gradient-to-r from-[#a3195b] to-[#662482]' : 'hover:bg-gray-700'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </a>

      <!-- Divider -->
      <div class="border-t border-gray-700 my-4"></div>

      <!-- Logout -->
      <a
        href="#"
        @click.prevent="handleLogout"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition text-[#e2312d] hover:bg-[#e2312d] hover:text-white"
      >
        <LogoutIcon class="w-5 h-5" />
        <span>Cerrar sesión</span>
      </a>
    </nav>
  </aside>

  <!-- Overlay (mobile) -->
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden top-16"
  ></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const router = useRouter()
const { logout } = useAuth()
const activeItem = ref('Inicio')

// Icon components (definir antes de usar)
const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
}

const UsersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
}

const OrdersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
}

const PaymentsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`
}

const ProductsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`
}

const CategoriesIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>`
}

const InventoryIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>`
}

const LogoutIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>`
}

const menuItems = [
  { name: 'Inicio', label: 'Inicio', icon: HomeIcon, path: '/dashboard' },
  { name: 'Usuarios', label: 'Usuarios', icon: UsersIcon, path: '/dashboard/usuarios' },
  { name: 'Ordenes', label: 'Ordenes', icon: OrdersIcon, path: '/dashboard/ordenes' },
  { name: 'Pagos', label: 'Pagos', icon: PaymentsIcon, path: '/dashboard/pagos' },
  { name: 'Productos', label: 'Productos', icon: ProductsIcon, path: '/dashboard/productos' },
  { name: 'Categorias', label: 'Categorías', icon: CategoriesIcon, path: '/dashboard/categorias' },
  { name: 'Inventario', label: 'Inventario', icon: InventoryIcon, path: '/dashboard/inventario' }
]

const handleItemClick = (item) => {
  activeItem.value = item.name
  emit('close')
  router.push(item.path)
}

const handleLogout = () => {
  logout() // Limpiar autenticación
  router.push('/login')
}
</script>
