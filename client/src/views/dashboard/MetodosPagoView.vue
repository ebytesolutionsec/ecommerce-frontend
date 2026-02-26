<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Métodos de Pago</h2>
        <p v-if="!loading && !error" class="text-sm text-gray-500 mt-1">
          {{ filteredMethods.length }} de {{ methods.length }} método(s)
        </p>
      </div>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Método
      </button>
    </div>

    <!-- Filtros -->
    <div v-if="!loading && !error && methods.length > 0" class="flex flex-wrap gap-2 mb-5">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        @click="filterProvider = opt.value"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition"
        :class="filterProvider === opt.value
          ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ opt.label }}
        <span class="ml-1 text-xs opacity-70">({{ opt.count }})</span>
      </button>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Cargando métodos de pago..." />

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Lista -->
    <div v-else>
      <div v-if="filteredMethods.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
        {{ methods.length === 0 ? 'No hay métodos de pago registrados' : 'No hay métodos que coincidan con el filtro' }}
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="method in filteredMethods"
          :key="method._id"
          class="bg-white rounded-lg shadow-md p-5 border-l-4 transition hover:shadow-lg"
          :class="method.active ? 'border-green-500' : 'border-gray-300'"
        >
          <!-- Header tarjeta -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getProviderIconClass(method.provider)"
              >
                <svg v-if="isCardProvider(method.provider)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ method.name }}</h3>
                <p class="text-xs text-gray-500">{{ method.provider }}</p>
              </div>
            </div>

            <!-- Toggle activo/inactivo -->
            <button
              @click="toggleActive(method)"
              :disabled="togglingId === method._id"
              class="px-2 py-1 text-xs font-semibold rounded-full transition flex items-center gap-1"
              :class="method.active
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              :title="method.active ? 'Click para desactivar' : 'Click para activar'"
            >
              <svg v-if="togglingId === method._id" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>{{ method.active ? 'Activo' : 'Inactivo' }}</span>
            </button>
          </div>

          <!-- Config de transferencia -->
          <div v-if="method.config && isTransferProvider(method.provider)" class="bg-gray-50 rounded-lg p-3 text-sm space-y-1 mb-3">
            <p v-if="method.config.banco"><span class="text-gray-500">Banco:</span> <strong>{{ method.config.banco }}</strong></p>
            <p v-if="method.config.tipoCuenta"><span class="text-gray-500">Tipo:</span> {{ method.config.tipoCuenta }}</p>
            <p v-if="method.config.numeroCuenta"><span class="text-gray-500">N° Cuenta:</span> <strong>{{ method.config.numeroCuenta }}</strong></p>
            <p v-if="method.config.beneficiario"><span class="text-gray-500">Beneficiario:</span> {{ method.config.beneficiario }}</p>
            <p v-if="method.config.ruc"><span class="text-gray-500">RUC:</span> {{ method.config.ruc }}</p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400">{{ formatDate(method.createdAt) }}</span>
            <div class="flex gap-2">
              <button
                @click="openModal(method)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Editar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(method)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Eliminar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <Modal
      :show="showModal"
      :title="isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'"
      :confirm-text="isEditing ? 'Guardar Cambios' : 'Crear Método'"
      :loading="submitting"
      @close="closeModal"
      @confirm="submitForm"
    >
      <form ref="formRef" @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
            placeholder="Ej: Pago con Tarjeta"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Proveedor *</label>
          <select
            v-model="form.provider"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
          >
            <option value="">Seleccionar...</option>
            <option value="card payment">Pago con Tarjeta (PayPhone)</option>
            <option value="bank transfer">Transferencia Bancaria</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.active"
            type="checkbox"
            id="active"
            class="w-4 h-4 text-[#a3195b] focus:ring-[#a3195b] rounded"
          />
          <label for="active" class="text-sm font-medium text-gray-700">Activo</label>
        </div>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="form.provider === 'bank transfer'" class="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 class="text-sm font-semibold text-gray-700">Datos de la cuenta bancaria</h4>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Banco *</label>
              <input
                v-model="form.config.banco"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent text-sm"
                placeholder="Ej: Banco Pichincha"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Tipo de Cuenta *</label>
                <select
                  v-model="form.config.tipoCuenta"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent text-sm"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Ahorros">Ahorros</option>
                  <option value="Corriente">Corriente</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">N° de Cuenta *</label>
                <input
                  v-model="form.config.numeroCuenta"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent text-sm"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Beneficiario *</label>
              <input
                v-model="form.config.beneficiario"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent text-sm"
                placeholder="EBYTE SOLUTIONS"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">RUC / Cédula *</label>
              <input
                v-model="form.config.ruc"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent text-sm"
                placeholder="0999999999001"
              />
            </div>
          </div>
        </transition>

        <button type="submit" class="hidden"></button>
      </form>
    </Modal>

    <!-- Modal Confirmar Eliminación -->
    <Modal
      :show="showDeleteModal"
      title="Eliminar Método de Pago"
      confirm-text="Eliminar"
      :loading="deleting"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    >
      <p class="text-gray-600">¿Estás seguro de que deseas eliminar <strong>{{ methodToDelete?.name }}</strong>?</p>
      <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import paymentService from '../../services/paymentService.js'
import { useToast } from '../../composables/useToast.js'

const { success, error: showError } = useToast()

// Estado
const methods = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const showDeleteModal = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const editingId = ref(null)
const methodToDelete = ref(null)
const formRef = ref(null)
const togglingId = ref(null)
const filterProvider = ref('')

const isEditing = computed(() => !!editingId.value)

// Opciones de filtro con conteos
const filterOptions = computed(() => [
  { value: '', label: 'Todos', count: methods.value.length },
  {
    value: 'card payment',
    label: 'Tarjeta',
    count: methods.value.filter(m => isCardProvider(m.provider)).length
  },
  {
    value: 'bank transfer',
    label: 'Transferencia',
    count: methods.value.filter(m => isTransferProvider(m.provider)).length
  },
])

// Métodos filtrados
const filteredMethods = computed(() => {
  if (!filterProvider.value) return methods.value
  if (filterProvider.value === 'card payment') return methods.value.filter(m => isCardProvider(m.provider))
  if (filterProvider.value === 'bank transfer') return methods.value.filter(m => isTransferProvider(m.provider))
  return methods.value
})

// Formulario
const defaultForm = () => ({
  name: '',
  provider: '',
  active: true,
  config: { banco: '', tipoCuenta: '', numeroCuenta: '', beneficiario: '', ruc: '' }
})

const form = ref(defaultForm())

const submitForm = () => formRef.value?.requestSubmit()

// Cargar métodos
const loadMethods = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await paymentService.listPaymentMethods()
    methods.value = response.data || []
  } catch (err) {
    console.error('Error al cargar métodos de pago:', err)
    error.value = err.message || 'Error al cargar los métodos de pago'
  } finally {
    loading.value = false
  }
}

// Toggle activo/inactivo sin abrir modal
const toggleActive = async (method) => {
  togglingId.value = method._id
  try {
    await paymentService.updatePaymentMethod(method._id, { active: !method.active })
    method.active = !method.active
    success(
      method.active ? 'Método activado' : 'Método desactivado',
      `"${method.name}" fue ${method.active ? 'activado' : 'desactivado'} correctamente`
    )
  } catch (err) {
    showError('Error', err.message || 'No se pudo cambiar el estado')
  } finally {
    togglingId.value = null
  }
}

// Abrir modal (crear o editar)
const openModal = (method = null) => {
  if (method) {
    editingId.value = method._id
    form.value = {
      name: method.name || '',
      provider: method.provider || '',
      active: method.active !== undefined ? method.active : true,
      config: {
        banco: method.config?.banco || '',
        tipoCuenta: method.config?.tipoCuenta || '',
        numeroCuenta: method.config?.numeroCuenta || '',
        beneficiario: method.config?.beneficiario || '',
        ruc: method.config?.ruc || ''
      }
    }
  } else {
    editingId.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  form.value = defaultForm()
}

// Crear o editar
const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = {
      name: form.value.name,
      provider: form.value.provider,
      active: form.value.active
    }

    if (form.value.provider === 'bank transfer') {
      payload.config = { ...form.value.config }
    }

    if (isEditing.value) {
      await paymentService.updatePaymentMethod(editingId.value, payload)
      success('Método actualizado', 'Los cambios se guardaron correctamente')
    } else {
      await paymentService.createPaymentMethod(payload)
      success('Método creado', 'El método de pago se creó correctamente')
    }

    closeModal()
    loadMethods()
  } catch (err) {
    showError('Error', err.message || 'No se pudo guardar el método de pago')
  } finally {
    submitting.value = false
  }
}

// Confirmar eliminación
const confirmDelete = (method) => {
  methodToDelete.value = method
  showDeleteModal.value = true
}

// Eliminar
const handleDelete = async () => {
  deleting.value = true
  try {
    await paymentService.deletePaymentMethod(methodToDelete.value._id)
    success('Método eliminado', 'El método de pago se eliminó correctamente')
    showDeleteModal.value = false
    methodToDelete.value = null
    loadMethods()
  } catch (err) {
    showError('Error', err.message || 'No se pudo eliminar el método de pago')
  } finally {
    deleting.value = false
  }
}

// Helpers
const isCardProvider = (provider) => {
  const p = (provider || '').toLowerCase()
  return p.includes('card') || p.includes('payphone') || p.includes('tarjeta')
}

const isTransferProvider = (provider) => {
  const p = (provider || '').toLowerCase()
  return p.includes('transfer') || p.includes('bancaria')
}

const getProviderIconClass = (provider) => {
  if (isCardProvider(provider)) return 'bg-blue-100 text-blue-600'
  if (isTransferProvider(provider)) return 'bg-green-100 text-green-600'
  return 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadMethods()
})
</script>
