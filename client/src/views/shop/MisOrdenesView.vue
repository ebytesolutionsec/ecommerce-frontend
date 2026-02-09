<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mis Órdenes</h1>
        <p class="text-gray-600 mt-2">Historial de tus compras y estado de tus pedidos</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3195b]"></div>
        <span class="ml-3 text-gray-600">Cargando órdenes...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 font-medium">{{ error }}</p>
        <button
          @click="loadOrders"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>

      <!-- Sin órdenes -->
      <div v-else-if="ordenes.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No tienes órdenes aún</h2>
        <p class="text-gray-500 mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          Explorar Productos
        </router-link>
      </div>

      <!-- Lista de Órdenes -->
      <div v-else class="space-y-6">
        <div
          v-for="orden in ordenes"
          :key="orden._id || orden.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Header de la Orden -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="text-sm text-gray-500">Orden #</p>
                <p class="font-mono font-semibold text-gray-900">{{ formatOrderId(orden._id || orden.id) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Fecha</p>
                <p class="font-medium text-gray-900">{{ formatDate(orden.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total</p>
                <p class="font-bold text-lg text-[#a3195b]">${{ formatPrice(orden.total) }}</p>
              </div>
              <div>
                <span
                  class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                  :class="getStatusClass(orden.status || orden.estado)"
                >
                  {{ getStatusLabel(orden.status || orden.estado) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Items de la Orden -->
          <div class="p-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Productos</h3>
            <div class="space-y-4">
              <div
                v-for="item in orden.items"
                :key="item._id"
                class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    v-if="item.producto?.img_prod"
                    :src="getProductImage(item.producto)"
                    :alt="item.producto?.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">
                    {{ item.producto?.name || 'Producto' }}
                  </p>
                  <p class="text-sm text-gray-500">Cantidad: {{ item.cantidad }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">${{ formatPrice(item.precio * item.cantidad) }}</p>
                  <p class="text-sm text-gray-500">${{ formatPrice(item.precio) }} c/u</p>
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <p v-if="orden.payment">
                    Pagado con:
                    <span class="font-medium text-gray-700">
                      {{ getPaymentMethodLabel(orden.payment?.payment_method) }}
                    </span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Total de la orden</p>
                  <p class="text-2xl font-bold text-gray-900">${{ formatPrice(orden.total) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import orderService from '../../services/orderService.js'
import authService from '../../services/authService.js'
import { useToast } from '../../composables/useToast.js'

const router = useRouter()
const { error: showError } = useToast()

// Estado
const ordenes = ref([])
const loading = ref(false)
const error = ref(null)

// Cargar órdenes del usuario
const loadOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.list()
    ordenes.value = response.data || []
  } catch (err) {
    console.error('Error al cargar órdenes:', err)
    error.value = err.message || 'Error al cargar tus órdenes. Por favor intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

// Formatear ID de orden
const formatOrderId = (id) => {
  if (!id) return 'N/A'
  return id.substring(0, 8).toUpperCase()
}

// Formatear precio
const formatPrice = (price) => {
  return Number(price || 0).toFixed(2)
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Obtener imagen del producto
const getProductImage = (producto) => {
  if (!producto) return null
  if (producto.img_prod) {
    if (producto.img_prod.startsWith('http')) {
      return producto.img_prod
    }
    return `http://localhost:3000${producto.img_prod}`
  }
  return null
}

// Error de imagen
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// Obtener clase de estado
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    pagado: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    procesando: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    enviado: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    entregado: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    pendiente: 'Pendiente',
    paid: 'Pagado',
    pagado: 'Pagado',
    processing: 'Procesando',
    procesando: 'Procesando',
    shipped: 'Enviado',
    enviado: 'Enviado',
    delivered: 'Entregado',
    entregado: 'Entregado',
    cancelled: 'Cancelado',
    cancelado: 'Cancelado'
  }
  return labels[status] || status || 'N/A'
}

// Obtener etiqueta de método de pago
const getPaymentMethodLabel = (methodId) => {
  // Por ahora retornamos un valor genérico
  // Cuando el backend implemente el endpoint, podemos obtener el nombre real
  return 'Método registrado'
}

// Lifecycle
onMounted(() => {
  // Verificar autenticación
  if (!authService.isAuthenticated()) {
    showError('Autenticación requerida', 'Debes iniciar sesión para ver tus órdenes')
    router.push({ name: 'login', query: { redirect: '/mis-ordenes' } })
    return
  }

  loadOrders()
})
</script>
