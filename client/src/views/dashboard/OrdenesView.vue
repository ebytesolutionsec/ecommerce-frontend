<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Órdenes</h2>
      <button
        @click="loadOrders"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition"
      >
        Actualizar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3195b]"></div>
      <span class="ml-3 text-gray-600">Cargando órdenes...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Tabla de Órdenes -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="ordenes.length === 0" class="text-center py-12 text-gray-500">
        No hay órdenes registradas
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Orden
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="orden in ordenes" :key="orden._id || orden.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ formatOrderId(orden._id || orden.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ orden.usuario?.fullName || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ orden.usuario?.email || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ orden.items?.length || 0 }} producto(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ${{ formatPrice(orden.total || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(orden.estado)"
                >
                  {{ getStatusLabel(orden.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(orden.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="viewOrderDetails(orden)"
                  class="text-[#a3195b] hover:text-[#662482] transition"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedOrder"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Detalles de la Orden</h3>
                <p class="text-sm text-gray-500 font-mono mt-1">
                  ID: {{ formatOrderId(selectedOrder._id || selectedOrder.id) }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Información del Cliente -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Información del Cliente</h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Nombre:</span>
                  <span class="font-medium text-gray-900">{{ selectedOrder.usuario?.fullName || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium text-gray-900">{{ selectedOrder.usuario?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Teléfono:</span>
                  <span class="font-medium text-gray-900">{{ selectedOrder.usuario?.phone || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Dirección:</span>
                  <span class="font-medium text-gray-900">{{ selectedOrder.usuario?.direccion || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Items de la Orden -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">Productos</h4>
              <div class="space-y-3">
                <div
                  v-for="item in selectedOrder.items"
                  :key="item._id"
                  class="flex items-center justify-between bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ item.producto?.name || 'Producto' }}</p>
                    <p class="text-sm text-gray-500">Cantidad: {{ item.cantidad }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">
                      ${{ formatPrice(item.precio * item.cantidad) }}
                    </p>
                    <p class="text-sm text-gray-500">${{ formatPrice(item.precio) }} c/u</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium text-gray-900">${{ formatPrice(selectedOrder.total || 0) }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Envío:</span>
                <span class="font-medium text-green-600">Gratis</span>
              </div>
              <div class="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                <span class="text-gray-900">Total:</span>
                <span class="text-[#a3195b]">${{ formatPrice(selectedOrder.total || 0) }}</span>
              </div>
            </div>

            <!-- Estado y Fecha -->
            <div class="mt-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p class="text-sm text-gray-600">Estado:</p>
                <span
                  class="inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full"
                  :class="getStatusClass(selectedOrder.estado)"
                >
                  {{ getStatusLabel(selectedOrder.estado) }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Fecha de creación:</p>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(selectedOrder.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import orderService from '../../services/orderService.js'
import { useToast } from '../../composables/useToast.js'

const { error: showError } = useToast()

// Estado
const ordenes = ref([])
const loading = ref(false)
const error = ref(null)
const selectedOrder = ref(null)

// Cargar órdenes
const loadOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.listAll()
    ordenes.value = response.data || []
  } catch (err) {
    console.error('Error al cargar órdenes:', err)
    error.value = err.message || 'Error al cargar las órdenes'
    showError('Error', 'No se pudieron cargar las órdenes')
  } finally {
    loading.value = false
  }
}

// Ver detalles de orden
const viewOrderDetails = (orden) => {
  selectedOrder.value = orden
}

// Cerrar modal
const closeModal = () => {
  selectedOrder.value = null
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Obtener clase de estado
const getStatusClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de estado
const getStatusLabel = (estado) => {
  const labels = {
    pendiente: 'Pendiente',
    procesando: 'Procesando',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }
  return labels[estado] || estado || 'N/A'
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>
