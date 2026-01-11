<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>Nombre de la Categoría</span>
        </span>
      </label>
      <input
        v-model="formData.name"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Ej: Electrónica, Ropa, Alimentos..."
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span>Descripción</span>
        </span>
      </label>
      <textarea
        v-model="formData.descripcion"
        rows="4"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white resize-none',
          errors.descripcion ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Describe brevemente esta categoría..."
      ></textarea>
      <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  category: {
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
  name: '',
  descripcion: ''
})

const errors = reactive({
  name: '',
  descripcion: ''
})

// Resetear formulario
const resetForm = () => {
  formData.name = ''
  formData.descripcion = ''
  errors.name = ''
  errors.descripcion = ''
}

// Cargar datos si es edición o resetear si es creación
watch(() => props.category, (newCategory) => {
  if (newCategory && props.isEdit) {
    formData.name = newCategory.name || ''
    formData.descripcion = newCategory.descripcion || ''
    errors.name = ''
    errors.descripcion = ''
  } else if (!newCategory && !props.isEdit) {
    resetForm()
  }
}, { immediate: true })

// Validación de campos
const validateForm = () => {
  let isValid = true

  // Reset errores
  errors.name = ''
  errors.descripcion = ''

  // Validar nombre
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'El nombre de la categoría es obligatorio'
    isValid = false
  }

  // Validar descripción
  if (!formData.descripcion || formData.descripcion.trim() === '') {
    errors.descripcion = 'La descripción es obligatoria'
    isValid = false
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
