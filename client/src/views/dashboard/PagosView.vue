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
                ID Orden
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
            <tr v-for="pago in pagos" :key="pago._id || pago.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ formatId(pago._id || pago.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                {{ formatId(pago.orden_id || pago.orden) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ${{ formatPrice(pago.monto || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getMethodClass(pago.payment_method_id)"
                >
                  {{ getMethodLabel(pago.payment_method_id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                {{ pago.transaction_id || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(pago.estado)"
                >
                  {{ getStatusLabel(pago.estado) }}
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
                  ID: {{ formatId(selectedPayment._id || selectedPayment.id) }}
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

            <!-- Información del Pago -->
            <div class="space-y-4">
              <!-- Orden asociada -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Orden Asociada</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">ID Orden:</span>
                    <span class="text-sm font-mono font-medium text-gray-900">
                      {{ formatId(selectedPayment.orden_id || selectedPayment.orden) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Detalles del Pago -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Información del Pago</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Monto:</span>
                    <span class="text-lg font-bold text-[#a3195b]">
                      ${{ formatPrice(selectedPayment.monto || 0) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Método de Pago:</span>
                    <span
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getMethodClass(selectedPayment.payment_method_id)"
                    >
                      {{ getMethodLabel(selectedPayment.payment_method_id) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">ID Transacción:</span>
                    <span class="text-sm font-mono font-medium text-gray-900">
                      {{ selectedPayment.transaction_id || 'N/A' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Estado:</span>
                    <span
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(selectedPayment.estado)"
                    >
                      {{ getStatusLabel(selectedPayment.estado) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Fecha:</span>
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatDate(selectedPayment.createdAt) }}
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

// Formatear ID
const formatId = (id) => {
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

// Formatear JSON
const formatJSON = (obj) => {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return JSON.stringify(obj)
  }
}

// Obtener clase de método
const getMethodClass = (method) => {
  const classes = {
    CARD: 'bg-blue-100 text-blue-800',
    TRANSFER: 'bg-green-100 text-green-800',
    CASH: 'bg-yellow-100 text-yellow-800'
  }
  return classes[method] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de método
const getMethodLabel = (method) => {
  const labels = {
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    CASH: 'Efectivo'
  }
  return labels[method] || method || 'N/A'
}

// Obtener clase de estado
const getStatusClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    completado: 'bg-green-100 text-green-800',
    fallido: 'bg-red-100 text-red-800',
    reembolsado: 'bg-purple-100 text-purple-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

// Obtener etiqueta de estado
const getStatusLabel = (estado) => {
  const labels = {
    pendiente: 'Pendiente',
    procesando: 'Procesando',
    completado: 'Completado',
    fallido: 'Fallido',
    reembolsado: 'Reembolsado'
  }
  return labels[estado] || estado || 'N/A'
}

// Lifecycle
onMounted(() => {
  loadPayments()
})
</script>
