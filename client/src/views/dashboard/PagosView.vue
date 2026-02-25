<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Pagos</h2>
      <button
        @click="loadPayments"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition"
      >
        Actualizar
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3195b]"></div>
      <span class="ml-3 text-gray-600">Cargando pagos...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Tabla de Pagos -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="pagos.length === 0" class="text-center py-12 text-gray-500">
        No hay pagos registrados
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pago
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Transacción
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
            <tr v-for="pago in pagos" :key="pago._id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ formatId(pago._id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-gray-900">{{ formatId(getOrderId(pago)) }}</div>
                <div v-if="pago.order?.order_number" class="text-xs text-gray-500">
                  #{{ pago.order.order_number }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ${{ formatPrice(pago.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getMethodClass(pago.payment_method)"
                >
                  {{ getMethodLabel(pago.payment_method) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                {{ pago.transaction_id || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(pago.status)"
                >
                  {{ getStatusLabel(pago.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pago.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="viewPaymentDetails(pago)"
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
        v-if="selectedPayment"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Detalles del Pago</h3>
                <p class="text-sm text-gray-500 font-mono mt-1">
                  ID: {{ formatId(selectedPayment._id) }}
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

            <!-- Orden Asociada -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Orden Asociada</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">ID Orden:</span>
                  <span class="text-sm font-mono font-medium text-gray-900">
                    {{ formatId(getOrderId(selectedPayment)) }}
                  </span>
                </div>
                <div v-if="selectedPayment.order?.order_number" class="flex justify-between">
                  <span class="text-sm text-gray-600">N. Orden:</span>
                  <span class="text-sm font-medium text-gray-900">
                    #{{ selectedPayment.order.order_number }}
                  </span>
                </div>
                <div v-if="selectedPayment.order?.status" class="flex justify-between">
                  <span class="text-sm text-gray-600">Estado Orden:</span>
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getOrderStatusClass(selectedPayment.order.status)"
                  >
                    {{ getOrderStatusLabel(selectedPayment.order.status) }}
                  </span>
                </div>
                <div v-if="selectedPayment.order?.total" class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Orden:</span>
                  <span class="text-sm font-semibold text-gray-900">
                    ${{ formatPrice(selectedPayment.order.total) }}
                  </span>
                </div>
                <div v-if="selectedPayment.order?.userId?.fullName" class="flex justify-between">
                  <span class="text-sm text-gray-600">Cliente:</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ selectedPayment.order.userId.fullName }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detalles del Pago -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Informacion del Pago</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Monto:</span>
                  <span class="text-lg font-bold text-[#a3195b]">
                    ${{ formatPrice(selectedPayment.amount) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Metodo de Pago:</span>
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getMethodClass(selectedPayment.payment_method)"
                  >
                    {{ getMethodLabel(selectedPayment.payment_method) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">ID Transaccion:</span>
                  <span class="text-sm font-mono font-medium text-gray-900">
                    {{ selectedPayment.transaction_id || 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Estado:</span>
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(selectedPayment.status)"
                  >
                    {{ getStatusLabel(selectedPayment.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Fecha de Pago:</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ formatDate(selectedPayment.paid_at || selectedPayment.createdAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Respuesta del Proveedor -->
            <div v-if="selectedPayment.provider_response" class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Respuesta del Proveedor</h4>
              <div class="bg-white rounded border border-gray-200 p-3">
                <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ formatJSON(selectedPayment.provider_response) }}</pre>
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
import paymentService from '../../services/paymentService.js'
import { useToast } from '../../composables/useToast.js'

const { error: showError } = useToast()

// Estado
const pagos = ref([])
const loading = ref(false)
const error = ref(null)
const selectedPayment = ref(null)

// Cargar pagos
const loadPayments = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await paymentService.listAll()
    pagos.value = response.data || []
  } catch (err) {
    console.error('Error al cargar pagos:', err)
    error.value = err.message || 'Error al cargar los pagos'
    showError('Error', 'No se pudieron cargar los pagos')
  } finally {
    loading.value = false
  }
}

// Ver detalles de pago
const viewPaymentDetails = (pago) => {
  selectedPayment.value = pago
}

// Cerrar modal
const closeModal = () => {
  selectedPayment.value = null
}

// Obtener ID de la orden (puede ser objeto populado o string)
const getOrderId = (pago) => {
  if (!pago.order) return null
  return typeof pago.order === 'object' ? pago.order._id : pago.order
}

// Formatear ID
const formatId = (id) => {
  if (!id) return 'N/A'
  return String(id).substring(0, 8).toUpperCase()
}

// Formatear precio
const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = typeof price === 'object' && price.$numberDecimal
    ? parseFloat(price.$numberDecimal)
    : Number(price)
  return num.toFixed(2)
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

// Formatear JSON
const formatJSON = (obj) => {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return JSON.stringify(obj)
  }
}

// Obtener clase de metodo de pago
const getMethodClass = (method) => {
  if (!method) return 'bg-gray-100 text-gray-800'
  const name = typeof method === 'object' ? (method.provider || method.name || '') : String(method)
  const lower = name.toLowerCase()
  if (lower.includes('card') || lower.includes('payphone') || lower.includes('tarjeta')) return 'bg-blue-100 text-blue-800'
  if (lower.includes('transfer') || lower.includes('bancaria')) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de metodo de pago
const getMethodLabel = (method) => {
  if (!method) return 'N/A'
  if (typeof method === 'object') return method.name || method.provider || 'N/A'
  return String(method).substring(0, 8)
}

// Obtener clase de estado de pago
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de estado de pago
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado'
  }
  return labels[status] || status || 'N/A'
}

// Estado de la orden
const getOrderStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-emerald-100 text-emerald-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagada',
    canceled: 'Cancelada',
    shipped: 'Enviada',
    delivered: 'Entregada'
  }
  return labels[status] || status || 'N/A'
}

// Lifecycle
onMounted(() => {
  loadPayments()
})
</script>
