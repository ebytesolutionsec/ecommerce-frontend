<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Pagos</h2>
        <p v-if="!loading && !error" class="text-sm text-gray-500 mt-1">
          {{ filteredPagos.length }} pago(s) encontrados
        </p>
      </div>
      <button
        @click="loadPayments"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Filtros -->
    <div v-if="!loading && !error && pagos.length > 0" class="space-y-3 mb-5">
      <!-- Búsqueda + Fechas -->
      <div class="flex flex-wrap gap-3">
        <!-- Búsqueda -->
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por N° orden o ID transacción..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
          />
        </div>

        <!-- Desde -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-500 whitespace-nowrap">Desde:</label>
          <input
            v-model="filterDateFrom"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
          />
        </div>

        <!-- Hasta -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-500 whitespace-nowrap">Hasta:</label>
          <input
            v-model="filterDateTo"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
          />
        </div>

        <!-- Limpiar fechas -->
        <button
          v-if="filterDateFrom || filterDateTo"
          @click="filterDateFrom = ''; filterDateTo = ''"
          class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Limpiar fechas
        </button>
      </div>

      <!-- Filtro por estado -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="opt in statusFilterOptions"
          :key="opt.value"
          @click="filterStatus = opt.value"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition"
          :class="filterStatus === opt.value
            ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ opt.label }}
          <span class="ml-1 text-xs opacity-70">({{ opt.count }})</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Cargando pagos..." />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="filteredPagos.length === 0" class="text-center py-12 text-gray-500">
        {{ pagos.length === 0 ? 'No hay pagos registrados' : 'No hay pagos que coincidan con los filtros' }}
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pago</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transacción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="pago in paginatedPagos"
                :key="pago._id"
                class="hover:bg-gray-50 transition cursor-pointer"
                @click="viewPaymentDetails(pago)"
              >
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
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

        <!-- Paginación -->
        <div class="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Info -->
          <p class="text-sm text-gray-500">
            Mostrando
            <span class="font-medium text-gray-700">{{ pageStart }}</span>
            –
            <span class="font-medium text-gray-700">{{ pageEnd }}</span>
            de
            <span class="font-medium text-gray-700">{{ filteredPagos.length }}</span>
            pagos
          </p>

          <!-- Controles -->
          <div class="flex items-center gap-1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
            >
              ‹ Ant.
            </button>

            <template v-for="page in pageNumbers" :key="page">
              <span v-if="page === '...'" class="px-2 py-1.5 text-gray-400 text-sm">…</span>
              <button
                v-else
                @click="currentPage = page"
                class="w-8 h-8 rounded-lg text-sm font-medium transition"
                :class="currentPage === page
                  ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </template>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
            >
              Sig. ›
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <Modal
      :show="!!selectedPayment"
      title="Detalles del Pago"
      :show-footer="false"
      @close="closeModal"
    >
      <template v-if="selectedPayment">
        <p class="text-sm text-gray-500 font-mono -mt-2 mb-4">ID: {{ formatId(selectedPayment._id) }}</p>

        <!-- Orden Asociada -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Orden Asociada</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">ID Orden:</span>
              <span class="text-sm font-mono font-medium text-gray-900">{{ formatId(getOrderId(selectedPayment)) }}</span>
            </div>
            <div v-if="selectedPayment.order?.order_number" class="flex justify-between">
              <span class="text-sm text-gray-600">N. Orden:</span>
              <span class="text-sm font-medium text-gray-900">#{{ selectedPayment.order.order_number }}</span>
            </div>
            <div v-if="selectedPayment.order?.status" class="flex justify-between">
              <span class="text-sm text-gray-600">Estado Orden:</span>
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getOrderStatusClass(selectedPayment.order.status)">
                {{ getOrderStatusLabel(selectedPayment.order.status) }}
              </span>
            </div>
            <div v-if="selectedPayment.order?.total" class="flex justify-between">
              <span class="text-sm text-gray-600">Total Orden:</span>
              <span class="text-sm font-semibold text-gray-900">${{ formatPrice(selectedPayment.order.total) }}</span>
            </div>
            <div v-if="selectedPayment.order?.userId?.fullName" class="flex justify-between">
              <span class="text-sm text-gray-600">Cliente:</span>
              <span class="text-sm font-medium text-gray-900">{{ selectedPayment.order.userId.fullName }}</span>
            </div>
          </div>
        </div>

        <!-- Detalles del Pago -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Información del Pago</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Monto:</span>
              <span class="text-lg font-bold text-[#a3195b]">${{ formatPrice(selectedPayment.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Método de Pago:</span>
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getMethodClass(selectedPayment.payment_method)">
                {{ getMethodLabel(selectedPayment.payment_method) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">ID Transacción:</span>
              <span class="text-sm font-mono font-medium text-gray-900">{{ selectedPayment.transaction_id || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Estado:</span>
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(selectedPayment.status)">
                {{ getStatusLabel(selectedPayment.status) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Fecha de Pago:</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedPayment.paid_at || selectedPayment.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Acción: Aprobar pago pendiente de transferencia -->
        <div v-if="selectedPayment.status === 'pending' && selectedPayment.proof_image" class="flex gap-3 mb-4">
          <button
            @click="handleApprove"
            :disabled="approving"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium rounded-lg transition"
          >
            <svg v-if="approving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ approving ? 'Aprobando...' : 'Aprobar pago' }}
          </button>
          <button
            disabled
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed"
            title="Próximamente — el backend aún no tiene este endpoint"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Rechazar pago
          </button>
        </div>

        <!-- Comprobante de transferencia -->
        <div v-if="selectedPayment.proof_image" class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Comprobante de Transferencia</h4>
          <a :href="buildFileUrl(selectedPayment.proof_image)" target="_blank" rel="noopener">
            <img
              :src="buildFileUrl(selectedPayment.proof_image)"
              alt="Comprobante de pago"
              class="w-full rounded-lg border border-gray-200 object-contain max-h-64 cursor-pointer hover:opacity-90 transition"
            />
          </a>
          <p class="text-xs text-gray-400 mt-2 text-center">Click en la imagen para verla completa</p>
        </div>

        <!-- Respuesta del Proveedor -->
        <div v-if="selectedPayment.provider_response" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Respuesta del Proveedor</h4>
          <div class="bg-white rounded border border-gray-200 p-3">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ formatJSON(selectedPayment.provider_response) }}</pre>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import paymentService from '../../services/paymentService.js'
import { useToast } from '../../composables/useToast.js'

const { success, error: showError } = useToast()

const PAGE_SIZE = 10

// Estado
const pagos = ref([])
const loading = ref(false)
const error = ref(null)
const selectedPayment = ref(null)
const approving = ref(false)
const search = ref('')
const filterStatus = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const currentPage = ref(1)

// Resetear página al cambiar cualquier filtro
watch([search, filterStatus, filterDateFrom, filterDateTo], () => {
  currentPage.value = 1
})

// Opciones de filtro por estado
const statusFilterOptions = computed(() => [
  { value: '',         label: 'Todos',        count: pagos.value.length },
  { value: 'pending',  label: 'Pendientes',   count: pagos.value.filter(p => p.status === 'pending').length },
  { value: 'approved', label: 'Aprobados',    count: pagos.value.filter(p => p.status === 'approved').length },
  { value: 'rejected', label: 'Rechazados',   count: pagos.value.filter(p => p.status === 'rejected').length },
  { value: 'refunded', label: 'Reembolsados', count: pagos.value.filter(p => p.status === 'refunded').length },
].filter(opt => opt.value === '' || opt.count > 0))

// Pagos filtrados (estado + búsqueda + fechas)
const filteredPagos = computed(() => {
  let result = pagos.value

  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(p =>
      (p.transaction_id || '').toLowerCase().includes(q) ||
      (p.order?.order_number || '').toLowerCase().includes(q) ||
      formatId(p._id).toLowerCase().includes(q)
    )
  }

  if (filterDateFrom.value) {
    const from = new Date(filterDateFrom.value)
    from.setHours(0, 0, 0, 0)
    result = result.filter(p => new Date(p.createdAt) >= from)
  }

  if (filterDateTo.value) {
    const to = new Date(filterDateTo.value)
    to.setHours(23, 59, 59, 999)
    result = result.filter(p => new Date(p.createdAt) <= to)
  }

  return result
})

// Paginación
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPagos.value.length / PAGE_SIZE)))
const pageStart  = computed(() => filteredPagos.value.length === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1)
const pageEnd    = computed(() => Math.min(currentPage.value * PAGE_SIZE, filteredPagos.value.length))

const paginatedPagos = computed(() =>
  filteredPagos.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE)
)

const pageNumbers = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, currentPage.value])
  if (currentPage.value > 1) pages.add(currentPage.value - 1)
  if (currentPage.value < total) pages.add(currentPage.value + 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
})

// Cargar pagos — más reciente primero
const loadPayments = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await paymentService.listAll()
    const data = response.data || []
    pagos.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error('Error al cargar pagos:', err)
    error.value = err.message || 'Error al cargar los pagos'
    showError('Error', 'No se pudieron cargar los pagos')
  } finally {
    loading.value = false
  }
}

const viewPaymentDetails = (pago) => { selectedPayment.value = pago }
const closeModal = () => { selectedPayment.value = null }

const handleApprove = async () => {
  approving.value = true
  try {
    await paymentService.approvePayment(selectedPayment.value._id)
    // Actualizar estado en la lista sin recargar todo
    const pago = pagos.value.find(p => p._id === selectedPayment.value._id)
    if (pago) {
      pago.status = 'approved'
      pago.paid_at = new Date().toISOString()
    }
    selectedPayment.value = null
    success('Pago aprobado', 'La orden ha sido marcada como pagada')
  } catch (err) {
    showError('Error', err.message || 'No se pudo aprobar el pago')
  } finally {
    approving.value = false
  }
}

const getOrderId = (pago) => {
  if (!pago.order) return null
  return typeof pago.order === 'object' ? pago.order._id : pago.order
}

const formatId = (id) => {
  if (!id) return 'N/A'
  return String(id).substring(0, 8).toUpperCase()
}

const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = typeof price === 'object' && price.$numberDecimal
    ? parseFloat(price.$numberDecimal)
    : Number(price)
  return num.toFixed(2)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-EC', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatJSON = (obj) => {
  try { return JSON.stringify(obj, null, 2) } catch { return String(obj) }
}

// Construir URL completa para archivos del servidor (uploads)
const buildFileUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const serverBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'
  return `${serverBase}${path}`
}

const getMethodClass = (method) => {
  if (!method) return 'bg-gray-100 text-gray-800'
  const name = typeof method === 'object' ? (method.provider || method.name || '') : String(method)
  const lower = name.toLowerCase()
  if (lower.includes('card') || lower.includes('payphone') || lower.includes('tarjeta')) return 'bg-blue-100 text-blue-800'
  if (lower.includes('transfer') || lower.includes('bancaria')) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

const getMethodLabel = (method) => {
  if (!method) return 'N/A'
  if (typeof method === 'object') return method.name || method.provider || 'N/A'
  return String(method).substring(0, 8)
}

const getStatusClass = (status) => {
  const classes = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending:  'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado'
  }
  return labels[status] || status || 'N/A'
}

const getOrderStatusClass = (status) => {
  const classes = {
    pending:   'bg-yellow-100 text-yellow-800',
    paid:      'bg-green-100 text-green-800',
    canceled:  'bg-red-100 text-red-800',
    shipped:   'bg-blue-100 text-blue-800',
    delivered: 'bg-emerald-100 text-emerald-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusLabel = (status) => {
  const labels = {
    pending:   'Pendiente',
    paid:      'Pagada',
    canceled:  'Cancelada',
    shipped:   'Enviada',
    delivered: 'Entregada'
  }
  return labels[status] || status || 'N/A'
}

onMounted(() => loadPayments())
</script>
