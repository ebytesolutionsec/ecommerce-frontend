<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span>DNI / Cédula</span>
        </span>
      </label>
      <input
        v-model="formData.dni"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.dni ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="0123456789"
      />
      <p v-if="errors.dni" class="text-red-500 text-sm mt-1">{{ errors.dni }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Nombre Completo</span>
        </span>
      </label>
      <input
        v-model="formData.fullName"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Nombre completo"
      />
      <p v-if="errors.fullName" class="text-red-500 text-sm mt-1">{{ errors.fullName }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Email</span>
        </span>
      </label>
      <input
        v-model="formData.email"
        type="email"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="correo@ejemplo.com"
      />
      <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Teléfono</span>
        </span>
      </label>
      <input
        v-model="formData.phone"
        type="tel"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="0999999999"
      />
      <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Dirección</span>
        </span>
      </label>
      <input
        v-model="formData.direccion"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.direccion ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Loja, Ecuador"
      />
      <p v-if="errors.direccion" class="text-red-500 text-sm mt-1">{{ errors.direccion }}</p>
    </div>

    <div v-if="!isEdit">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Contraseña</span>
        </span>
      </label>
      <input
        v-model="formData.password"
        type="password"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Mínimo 6 caracteres"
      />
      <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Rol</span>
        </span>
      </label>
      <select
        v-model="formData.role"
        required
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a3195b] focus:border-[#a3195b] transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
      >
        <option value="superadmin">Super Admin</option>
        <option value="comprador">Comprador</option>
      </select>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const formData = reactive({
  dni: '',
  fullName: '',
  email: '',
  phone: '',
  direccion: '',
  role: 'comprador',
  password: ''
})

const errors = reactive({
  dni: '',
  fullName: '',
  email: '',
  phone: '',
  direccion: '',
  password: ''
})

// Resetear formulario
const resetForm = () => {
  formData.dni = ''
  formData.fullName = ''
  formData.email = ''
  formData.phone = ''
  formData.direccion = ''
  formData.role = 'comprador'
  formData.password = ''
  errors.dni = ''
  errors.fullName = ''
  errors.email = ''
  errors.phone = ''
  errors.direccion = ''
  errors.password = ''
}

// Cargar datos si es edición o resetear si es creación
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    formData.dni = newUser.dni || ''
    formData.fullName = newUser.fullName || ''
    formData.email = newUser.email || ''
    formData.phone = newUser.phone || ''
    formData.direccion = newUser.direccion || ''
    formData.role = newUser.role || 'comprador'
    // Limpiar errores al cargar datos
    errors.dni = ''
    errors.fullName = ''
    errors.email = ''
    errors.phone = ''
    errors.direccion = ''
    errors.password = ''
  } else if (!newUser && !props.isEdit) {
    // Resetear formulario cuando es creación nueva
    resetForm()
  }
}, { immediate: true })

// Validación de campos
const validateForm = () => {
  let isValid = true

  // Reset errores
  errors.dni = ''
  errors.fullName = ''
  errors.email = ''
  errors.phone = ''
  errors.direccion = ''
  errors.password = ''

  // Validar DNI
  if (!formData.dni || formData.dni.trim() === '') {
    errors.dni = 'El DNI es obligatorio'
    isValid = false
  }

  // Validar nombre completo
  if (!formData.fullName || formData.fullName.trim() === '') {
    errors.fullName = 'El nombre completo es obligatorio'
    isValid = false
  }

  // Validar email
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'El email es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'El email no es válido'
    isValid = false
  }

  // Validar teléfono
  if (!formData.phone || formData.phone.trim() === '') {
    errors.phone = 'El teléfono es obligatorio'
    isValid = false
  }

  // Validar dirección
  if (!formData.direccion || formData.direccion.trim() === '') {
    errors.direccion = 'La dirección es obligatoria'
    isValid = false
  }

  // Validar password solo si no es edición
  if (!props.isEdit) {
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'La contraseña es obligatoria'
      isValid = false
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData })
  }
}

// Exponer método para submit desde el padre
defineExpose({ handleSubmit })
</script>
