<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Nombre</span>
        </span>
      </label>
      <input
        v-model="formData.nombre"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Nombre completo"
      />
      <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>
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
        v-model="formData.rol"
        required
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a3195b] focus:border-[#a3195b] transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
      >
        <option value="admin">Admin</option>
        <option value="usuario">Usuario</option>
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
  nombre: '',
  email: '',
  password: '',
  rol: 'usuario'
})

const errors = reactive({
  nombre: '',
  email: '',
  password: ''
})

// Resetear formulario
const resetForm = () => {
  formData.nombre = ''
  formData.email = ''
  formData.password = ''
  formData.rol = 'usuario'
  errors.nombre = ''
  errors.email = ''
  errors.password = ''
}

// Cargar datos si es edición o resetear si es creación
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    formData.nombre = newUser.nombre
    formData.email = newUser.email
    formData.rol = newUser.rol
    // Limpiar errores al cargar datos
    errors.nombre = ''
    errors.email = ''
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
  errors.nombre = ''
  errors.email = ''
  errors.password = ''

  // Validar nombre
  if (!formData.nombre || formData.nombre.trim() === '') {
    errors.nombre = 'El nombre es obligatorio'
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

  // Validar password solo si no es edición
  if (!props.isEdit) {
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'La contraseña es obligatoria'
      isValid = false
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
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
