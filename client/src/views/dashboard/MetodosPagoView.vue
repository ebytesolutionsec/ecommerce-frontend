<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Metodos de Pago</h2>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Metodo
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3195b]"></div>
      <span class="ml-3 text-gray-600">Cargando metodos de pago...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
      {{ error }}
    </div>

    <!-- Lista de metodos de pago -->
    <div v-else>
      <div v-if="methods.length === 0" class="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
        No hay metodos de pago registrados
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="method in methods"
          :key="method._id"
          class="bg-white rounded-lg shadow-md p-5 border-l-4 transition hover:shadow-lg"
          :class="method.active ? 'border-green-500' : 'border-gray-300'"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
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
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="method.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
            >
              {{ method.active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <!-- Config de transferencia -->
          <div v-if="method.config && isTransferProvider(method.provider)" class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p v-if="method.config.banco"><span class="text-gray-500">Banco:</span> {{ method.config.banco }}</p>
            <p v-if="method.config.tipoCuenta"><span class="text-gray-500">Cuenta:</span> {{ method.config.tipoCuenta }}</p>
            <p v-if="method.config.numeroCuenta"><span class="text-gray-500">N.:</span> {{ method.config.numeroCuenta }}</p>
            <p v-if="method.config.beneficiario"><span class="text-gray-500">Beneficiario:</span> {{ method.config.beneficiario }}</p>
            <p v-if="method.config.ruc"><span class="text-gray-500">RUC:</span> {{ method.config.ruc }}</p>
          </div>

          <!-- Acciones -->
          <div class="mt-4 flex items-center justify-between">
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

    <!-- Modal Crear/Editar Metodo de Pago -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <h3 class="text-2xl font-bold text-gray-900">
                {{ isEditing ? 'Editar Metodo de Pago' : 'Nuevo Metodo de Pago' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Nombre -->
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

              <!-- Proveedor -->
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

              <!-- Estado -->
              <div class="flex items-center gap-2">
                <input
                  v-model="form.active"
                  type="checkbox"
                  id="active"
                  class="w-4 h-4 text-[#a3195b] focus:ring-[#a3195b] rounded"
                />
                <label for="active" class="text-sm font-medium text-gray-700">Activo</label>
              </div>

              <!-- Formulario de transferencia -->
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
                      <label class="block text-sm text-gray-600 mb-1">N. de Cuenta *</label>
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
                    <label class="block text-sm text-gray-600 mb-1">RUC / Cedula *</label>
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

              <!-- Botones -->
              <div class="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-6 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ submitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Metodo') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Confirmar Eliminacion -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Eliminar metodo de pago</h3>
                <p class="text-sm text-gray-500">Esta accion no se puede deshacer</p>
              </div>
            </div>
            <p class="text-gray-700 mb-6">
              Estas seguro de que deseas eliminar <strong>{{ methodToDelete?.name }}</strong>?
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                @click="handleDelete"
                :disabled="deleting"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <svg v-if="deleting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ deleting ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const isEditing = computed(() => !!editingId.value)

// Formulario
const defaultForm = () => ({
  name: '',
  provider: '',
  active: true,
  config: {
    banco: '',
    tipoCuenta: '',
    numeroCuenta: '',
    beneficiario: '',
    ruc: ''
  }
})

const form = ref(defaultForm())

// Cargar metodos
const loadMethods = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await paymentService.listPaymentMethods()
    methods.value = response.data || response.methods || (Array.isArray(response) ? response : [])
  } catch (err) {
    console.error('Error al cargar metodos de pago:', err)
    error.value = err.message || 'Error al cargar los metodos de pago'
  } finally {
    loading.value = false
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

// Cerrar modal
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
      success('Metodo actualizado', 'Los cambios se guardaron correctamente')
    } else {
      await paymentService.createPaymentMethod(payload)
      success('Metodo creado', 'El metodo de pago se creo correctamente')
    }

    closeModal()
    loadMethods()
  } catch (err) {
    console.error('Error al guardar metodo de pago:', err)
    showError('Error', err.message || 'No se pudo guardar el metodo de pago')
  } finally {
    submitting.value = false
  }
}

// Confirmar eliminacion
const confirmDelete = (method) => {
  methodToDelete.value = method
  showDeleteModal.value = true
}

// Eliminar
const handleDelete = async () => {
  deleting.value = true
  try {
    await paymentService.deletePaymentMethod(methodToDelete.value._id)
    success('Metodo eliminado', 'El metodo de pago se elimino correctamente')
    showDeleteModal.value = false
    methodToDelete.value = null
    loadMethods()
  } catch (err) {
    console.error('Error al eliminar metodo de pago:', err)
    showError('Error', err.message || 'No se pudo eliminar el metodo de pago')
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
