<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Ordenes</h2>
      <button
        @click="loadOrders"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition"
      >
        Actualizar
      </button>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Cargando ordenes..." />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Tabla de Ordenes -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="ordenes.length === 0" class="text-center py-12 text-gray-500">
        No hay ordenes registradas
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N. Orden
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
            <tr v-for="orden in ordenes" :key="orden._id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ orden.order_number || formatId(orden._id) }}</div>
                <div class="text-xs font-mono text-gray-400">{{ formatId(orden._id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ orden.userId?.fullName || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ orden.userId?.email || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ orden.items?.length || 0 }} producto(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ${{ formatPrice(orden.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(orden.status)"
                >
                  {{ getStatusLabel(orden.status) }}
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
    <Modal
      :show="!!selectedOrder"
      title="Detalles de la Orden"
      :show-footer="false"
      @close="closeModal"
    >
      <template v-if="selectedOrder">
        <!-- Subtitulo -->
        <p class="text-sm text-gray-500 -mt-2 mb-4">
          <span class="font-semibold">{{ selectedOrder.order_number }}</span>
          <span class="font-mono ml-2">{{ formatId(selectedOrder._id) }}</span>
        </p>

        <!-- Informacion del Cliente -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Informacion del Cliente</h4>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Nombre:</span>
              <span class="font-medium text-gray-900">{{ selectedOrder.userId?.fullName || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-medium text-gray-900">{{ selectedOrder.userId?.email || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Telefono:</span>
              <span class="font-medium text-gray-900">{{ selectedOrder.userId?.phone || 'N/A' }}</span>
            </div>
            <div v-if="selectedOrder.shipping_address" class="flex justify-between">
              <span class="text-gray-600">Direccion de envio:</span>
              <span class="font-medium text-gray-900">
                {{ formatShippingAddress(selectedOrder.shipping_address) }}
              </span>
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
                <p class="font-medium text-gray-900">{{ item.product_name || item.product?.name || 'Producto' }}</p>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                <p v-if="item.product_sku" class="text-xs text-gray-400">SKU: {{ item.product_sku }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">${{ formatPrice(item.total_price) }}</p>
                <p class="text-sm text-gray-500">${{ formatPrice(item.unit_price) }} c/u</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-medium text-gray-900">${{ formatPrice(selectedOrder.subtotal) }}</span>
          </div>
          <div v-if="selectedOrder.tax" class="flex justify-between items-center mb-2">
            <span class="text-gray-600">IVA (12%):</span>
            <span class="font-medium text-gray-900">${{ formatPrice(selectedOrder.tax) }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">Envio:</span>
            <span class="font-medium text-green-600">{{ selectedOrder.shipping_cost > 0 ? '$' + formatPrice(selectedOrder.shipping_cost) : 'Gratis' }}</span>
          </div>
          <div class="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2 mt-2">
            <span class="text-gray-900">Total:</span>
            <span class="text-[#a3195b]">${{ formatPrice(selectedOrder.total) }}</span>
          </div>
        </div>

        <!-- Estado y Fecha -->
        <div class="mt-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <p class="text-sm text-gray-600">Estado:</p>
            <span
              class="inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full"
              :class="getStatusClass(selectedOrder.status)"
            >
              {{ getStatusLabel(selectedOrder.status) }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Fecha de creacion:</p>
            <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(selectedOrder.createdAt) }}</p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import orderService from '../../services/orderService.js'
import { useToast } from '../../composables/useToast.js'

const { error: showError } = useToast()

// Estado
const ordenes = ref([])
const loading = ref(false)
const error = ref(null)
const selectedOrder = ref(null)

// Cargar ordenes
const loadOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.listAll()
    ordenes.value = response.data || []
  } catch (err) {
    console.error('Error al cargar ordenes:', err)
    error.value = err.message || 'Error al cargar las ordenes'
    showError('Error', 'No se pudieron cargar las ordenes')
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

// Formatear ID
const formatId = (id) => {
  if (!id) return 'N/A'
  return String(id).substring(0, 8).toUpperCase()
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

// Formatear direccion de envio
const formatShippingAddress = (address) => {
  if (!address) return 'N/A'
  if (typeof address === 'string') return address
  const parts = [address.address, address.city, address.country, address.zip].filter(Boolean)
  return parts.join(', ') || 'N/A'
}

// Obtener clase de estado
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    canceled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagada',
    shipped: 'Enviada',
    completed: 'Completada',
    canceled: 'Cancelada'
  }
  return labels[status] || status || 'N/A'
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>
