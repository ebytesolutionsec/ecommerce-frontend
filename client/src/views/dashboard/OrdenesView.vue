<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Órdenes</h2>
        <p v-if="!loading && !error" class="text-sm text-gray-500 mt-1">
          {{ filteredOrders.length }} de {{ ordenes.length }} orden(es)
        </p>
      </div>
      <button
        @click="loadOrders"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Filtros y búsqueda -->
    <div v-if="!loading && !error && ordenes.length > 0" class="space-y-3 mb-5">
      <!-- Búsqueda -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por N° orden o cliente..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
        />
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
    <LoadingSpinner v-if="loading" message="Cargando órdenes..." />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="filteredOrders.length === 0" class="text-center py-12 text-gray-500">
        {{ ordenes.length === 0 ? 'No hay órdenes registradas' : 'No hay órdenes que coincidan con la búsqueda' }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Orden</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="orden in filteredOrders"
              :key="orden._id"
              class="hover:bg-gray-50 transition cursor-pointer"
              @click="viewOrderDetails(orden)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ orden.order_number || formatId(orden._id) }}</div>
                <div class="text-xs font-mono text-gray-400">{{ formatId(orden._id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ orden.userId?.fullName || 'N/A' }}</div>
                <div class="text-xs text-gray-500">{{ orden.userId?.email || '' }}</div>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
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
        <!-- Subtítulo -->
        <div class="flex items-center gap-3 -mt-2 mb-5">
          <span class="font-semibold text-gray-700">{{ selectedOrder.order_number }}</span>
          <span class="font-mono text-sm text-gray-400">{{ formatId(selectedOrder._id) }}</span>
          <span
            class="ml-auto px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(selectedOrder.status)"
          >
            {{ getStatusLabel(selectedOrder.status) }}
          </span>
        </div>

        <!-- Info del Cliente -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Cliente</h4>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Nombre:</span>
              <span class="text-sm font-medium text-gray-900">{{ selectedOrder.userId?.fullName || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500">Email:</span>
              <span class="text-sm font-medium text-gray-900">{{ selectedOrder.userId?.email || 'N/A' }}</span>
            </div>
            <div v-if="selectedOrder.userId?.phone" class="flex justify-between">
              <span class="text-sm text-gray-500">Teléfono:</span>
              <span class="text-sm font-medium text-gray-900">{{ selectedOrder.userId.phone }}</span>
            </div>
            <div v-if="selectedOrder.shipping_address" class="flex justify-between gap-4">
              <span class="text-sm text-gray-500 flex-shrink-0">Dirección:</span>
              <span class="text-sm font-medium text-gray-900 text-right">{{ formatShippingAddress(selectedOrder.shipping_address) }}</span>
            </div>
          </div>
        </div>

        <!-- Productos -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Productos ({{ selectedOrder.items?.length || 0 }})
          </h4>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.items"
              :key="item._id"
              class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.product_name || item.product?.name || 'Producto' }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ item.quantity }} x ${{ formatPrice(item.unit_price) }}
                  <span v-if="item.product_sku" class="ml-2 text-gray-400">SKU: {{ item.product_sku }}</span>
                </p>
              </div>
              <p class="text-sm font-semibold text-gray-900 ml-4 flex-shrink-0">
                ${{ formatPrice(item.total_price) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Resumen financiero -->
        <div class="border-t border-gray-200 pt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Subtotal:</span>
            <span class="text-gray-900">${{ formatPrice(selectedOrder.subtotal) }}</span>
          </div>
          <div v-if="selectedOrder.tax" class="flex justify-between text-sm">
            <span class="text-gray-500">IVA (12%):</span>
            <span class="text-gray-900">${{ formatPrice(selectedOrder.tax) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Envío:</span>
            <span :class="selectedOrder.shipping_cost > 0 ? 'text-gray-900' : 'text-green-600'">
              {{ selectedOrder.shipping_cost > 0 ? '$' + formatPrice(selectedOrder.shipping_cost) : 'Gratis' }}
            </span>
          </div>
          <div class="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-1">
            <span>Total:</span>
            <span class="text-[#a3195b]">${{ formatPrice(selectedOrder.total) }}</span>
          </div>
        </div>

        <!-- Fecha -->
        <p class="text-xs text-gray-400 mt-4 text-right">
          Creada el {{ formatDate(selectedOrder.createdAt) }}
        </p>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const search = ref('')
const filterStatus = ref('')

// Opciones de filtro con conteos dinámicos
const statusFilterOptions = computed(() => [
  { value: '', label: 'Todas', count: ordenes.value.length },
  { value: 'pending',   label: 'Pendientes', count: ordenes.value.filter(o => o.status === 'pending').length },
  { value: 'paid',      label: 'Pagadas',    count: ordenes.value.filter(o => o.status === 'paid').length },
  { value: 'shipped',   label: 'Enviadas',   count: ordenes.value.filter(o => o.status === 'shipped').length },
  { value: 'completed', label: 'Completadas',count: ordenes.value.filter(o => o.status === 'completed').length },
  { value: 'canceled',  label: 'Canceladas', count: ordenes.value.filter(o => o.status === 'canceled').length },
].filter(opt => opt.value === '' || opt.count > 0))

// Órdenes filtradas por estado + búsqueda
const filteredOrders = computed(() => {
  let result = ordenes.value

  if (filterStatus.value) {
    result = result.filter(o => o.status === filterStatus.value)
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(o =>
      (o.order_number || '').toLowerCase().includes(q) ||
      (o.userId?.fullName || '').toLowerCase().includes(q) ||
      (o.userId?.email || '').toLowerCase().includes(q)
    )
  }

  return result
})

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

const viewOrderDetails = (orden) => { selectedOrder.value = orden }
const closeModal = () => { selectedOrder.value = null }

// Helpers
const formatId = (id) => {
  if (!id) return 'N/A'
  return String(id).substring(0, 8).toUpperCase()
}

const formatPrice = (price) => {
  return Number(price || 0).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-EC', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatShippingAddress = (address) => {
  if (!address) return 'N/A'
  if (typeof address === 'string') return address
  return [address.address, address.city, address.country, address.zip].filter(Boolean).join(', ') || 'N/A'
}

const getStatusClass = (status) => {
  const classes = {
    pending:   'bg-yellow-100 text-yellow-800',
    paid:      'bg-green-100 text-green-800',
    shipped:   'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    canceled:  'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending:   'Pendiente',
    paid:      'Pagada',
    shipped:   'Enviada',
    completed: 'Completada',
    canceled:  'Cancelada'
  }
  return labels[status] || status || 'N/A'
}

onMounted(() => loadOrders())
</script>
