<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto px-1">
    <!-- Nombre del Producto -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Nombre del Producto</span>
        </span>
      </label>
      <input
        v-model="formData.name"
        @blur="generateSku"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Ej: Laptop HP Pavilion 15"
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <!-- SKU (Auto-generado) -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <span>SKU (Código único)</span>
        </span>
      </label>
      <div class="flex space-x-2">
        <input
          v-model="formData.sku"
          type="text"
          :class="[
            'flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-100',
            errors.sku ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
          ]"
          placeholder="Se genera automáticamente"
          readonly
        />
        <button
          type="button"
          @click="generateSku"
          :disabled="!formData.name || generatingSku"
          class="px-4 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-xl hover:from-[#8a1450] hover:to-[#551d6d] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ generatingSku ? 'Generando...' : 'Generar' }}
        </button>
      </div>
      <p v-if="errors.sku" class="text-red-500 text-sm mt-1">{{ errors.sku }}</p>
    </div>

    <!-- Imagen del Producto -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Imagen del Producto</span>
        </span>
      </label>

      <div class="space-y-3">
        <!-- Cuadro de subida de imagen -->
        <div
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          :class="[
            'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all',
            isDragging ? 'border-[#a3195b] bg-[#a3195b]/5' : 'border-gray-300 hover:border-[#a3195b] bg-gray-50 hover:bg-gray-100',
            errors.img_prod ? 'border-red-500' : ''
          ]"
        >
          <!-- Preview de imagen -->
          <div v-if="imagePreview" class="absolute inset-0 p-2">
            <img
              :src="imagePreview"
              alt="Preview"
              class="w-full h-full object-contain rounded-lg"
            />
            <button
              type="button"
              @click.stop="removeImage"
              class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Placeholder cuando no hay imagen -->
          <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click para subir</span> o arrastra aquí
            </p>
            <p class="text-xs text-gray-500">PNG, JPG o WEBP (máx. 5MB)</p>
          </div>

          <!-- Input de archivo oculto -->
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            @change="handleFileChange"
          />
        </div>

        <!-- Nombre del archivo seleccionado -->
        <p v-if="selectedFileName" class="text-sm text-gray-600 flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="font-medium">{{ selectedFileName }}</span>
        </p>
      </div>

      <p v-if="errors.img_prod" class="text-red-500 text-sm mt-1">{{ errors.img_prod }}</p>
    </div>

    <!-- Categoría -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>Categoría</span>
        </span>
      </label>
      <select
        v-model="formData.categoria"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.categoria ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
      >
        <option value="">Selecciona una categoría</option>
        <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="errors.categoria" class="text-red-500 text-sm mt-1">{{ errors.categoria }}</p>
    </div>

    <!-- Descripción Corta -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          <span>Descripción Corta</span>
        </span>
      </label>
      <input
        v-model="formData.descripcion_corta"
        type="text"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
          errors.descripcion_corta ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Resumen breve del producto"
      />
      <p v-if="errors.descripcion_corta" class="text-red-500 text-sm mt-1">{{ errors.descripcion_corta }}</p>
    </div>

    <!-- Descripción Completa -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <span class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span>Descripción Completa</span>
        </span>
      </label>
      <textarea
        v-model="formData.descripcion"
        rows="3"
        :class="[
          'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white resize-none',
          errors.descripcion ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
        ]"
        placeholder="Descripción detallada del producto..."
      ></textarea>
      <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
    </div>

    <!-- Precio y Precio con Descuento -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Precio</span>
          </span>
        </label>
        <input
          v-model.number="formData.precio"
          type="number"
          step="0.01"
          min="0"
          :class="[
            'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
            errors.precio ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
          ]"
          placeholder="0.00"
        />
        <p v-if="errors.precio" class="text-red-500 text-sm mt-1">{{ errors.precio }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Precio Descuento</span>
          </span>
        </label>
        <input
          v-model.number="formData.precio_descuento"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-[#a3195b] focus:ring-[#a3195b] transition-all bg-gray-50/50 hover:bg-white"
          placeholder="0.00 (opcional)"
        />
      </div>
    </div>

    <!-- Stock y Rating -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-[#a3195b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Stock</span>
          </span>
        </label>
        <input
          v-model.number="formData.stock"
          type="number"
          min="0"
          :class="[
            'w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white',
            errors.stock ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#a3195b] focus:ring-[#a3195b]'
          ]"
          placeholder="0"
        />
        <p v-if="errors.stock" class="text-red-500 text-sm mt-1">{{ errors.stock }}</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <span class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Rating (opcional)</span>
          </span>
        </label>
        <input
          v-model.number="formData.rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-[#a3195b] focus:ring-[#a3195b] transition-all bg-gray-50/50 hover:bg-white"
          placeholder="0.0"
        />
      </div>
    </div>

    <!-- Checkboxes -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
        <input
          v-model="formData.disponible"
          type="checkbox"
          id="disponible"
          class="w-5 h-5 text-[#a3195b] border-gray-300 rounded focus:ring-[#a3195b]"
        />
        <label for="disponible" class="text-sm font-medium text-gray-700 cursor-pointer">
          Disponible para venta
        </label>
      </div>

      <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
        <input
          v-model="formData.destacado"
          type="checkbox"
          id="destacado"
          class="w-5 h-5 text-[#a3195b] border-gray-300 rounded focus:ring-[#a3195b]"
        />
        <label for="destacado" class="text-sm font-medium text-gray-700 cursor-pointer">
          Producto destacado
        </label>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, onMounted, ref } from 'vue'
import productService from '../../services/productService.js'
import categoryService from '../../services/categoryService.js'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const categorias = ref([])
const generatingSku = ref(false)
const fileInput = ref(null)
const imagePreview = ref(null)
const selectedFileName = ref('')
const selectedFile = ref(null)
const isDragging = ref(false)

const formData = reactive({
  name: '',
  sku: '',
  img_prod: '',
  descripcion: '',
  descripcion_corta: '',
  categoria: '',
  precio: 0,
  precio_descuento: 0,
  stock: 0,
  disponible: true,
  rating: 0,
  destacado: false,
  estado: true
})

const errors = reactive({
  name: '',
  sku: '',
  img_prod: '',
  descripcion: '',
  descripcion_corta: '',
  categoria: '',
  precio: '',
  stock: ''
})

// Cargar categorías
const loadCategories = async () => {
  try {
    const response = await categoryService.list(1, 100)
    categorias.value = response.data || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

// Generar SKU automáticamente
const generateSku = async () => {
  if (!formData.name || formData.name.trim().length < 3) {
    return
  }

  try {
    generatingSku.value = true

    // Obtener las primeras 3 letras del nombre (sin espacios ni caracteres especiales)
    const cleanName = formData.name.trim().replace(/[^a-zA-Z]/g, '').toUpperCase()
    if (cleanName.length < 3) {
      errors.sku = 'El nombre debe tener al menos 3 letras'
      return
    }

    const prefix = cleanName.substring(0, 3)

    // Obtener productos con el mismo prefijo
    const existingProducts = await productService.getBySkuPrefix(prefix)

    // Encontrar el número más alto
    let maxNumber = 0
    existingProducts.forEach(product => {
      const match = product.sku.match(/-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNumber) {
          maxNumber = num
        }
      }
    })

    // Generar el siguiente número
    const nextNumber = (maxNumber + 1).toString().padStart(3, '0')
    formData.sku = `${prefix}-${nextNumber}`

    errors.sku = ''
  } catch (error) {
    console.error('Error al generar SKU:', error)
    errors.sku = 'Error al generar SKU automático'
  } finally {
    generatingSku.value = false
  }
}

// Funciones para manejar archivos de imagen
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndPreviewFile(file)
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndPreviewFile(file)
  }
}

const validateAndPreviewFile = (file) => {
  // Validar tipo de archivo
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errors.img_prod = 'Solo se permiten archivos PNG, JPG o WEBP'
    return
  }

  // Validar tamaño (máx 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.img_prod = 'La imagen no debe superar los 5MB'
    return
  }

  // Todo válido, guardar archivo y mostrar preview
  selectedFile.value = file
  selectedFileName.value = file.name
  errors.img_prod = ''

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  selectedFile.value = null
  selectedFileName.value = ''
  imagePreview.value = null
  formData.img_prod = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Resetear formulario
const resetForm = () => {
  formData.name = ''
  formData.sku = ''
  formData.img_prod = ''
  formData.descripcion = ''
  formData.descripcion_corta = ''
  formData.categoria = ''
  formData.precio = 0
  formData.precio_descuento = 0
  formData.stock = 0
  formData.disponible = true
  formData.rating = 0
  formData.destacado = false
  formData.estado = true

  // Limpiar imagen
  removeImage()

  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// Cargar datos si es edición
watch(() => props.product, (newProduct) => {
  if (newProduct && props.isEdit) {
    formData.name = newProduct.name || ''
    formData.sku = newProduct.sku || ''
    formData.img_prod = newProduct.img_prod || ''
    formData.descripcion = newProduct.descripcion || ''
    formData.descripcion_corta = newProduct.descripcion_corta || ''
    formData.categoria = newProduct.categoria?._id || newProduct.categoria || ''
    formData.precio = newProduct.precio || 0
    formData.precio_descuento = newProduct.precio_descuento || 0
    formData.stock = newProduct.stock || 0
    formData.disponible = newProduct.disponible !== undefined ? newProduct.disponible : true
    formData.rating = newProduct.rating || 0
    formData.destacado = newProduct.destacado || false
    formData.estado = newProduct.estado !== undefined ? newProduct.estado : true

    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
  } else if (!newProduct && !props.isEdit) {
    resetForm()
  }
}, { immediate: true })

// Validación de campos
const validateForm = () => {
  let isValid = true

  // Reset errores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Validar nombre
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'El nombre del producto es obligatorio'
    isValid = false
  }

  // Validar SKU
  if (!formData.sku || formData.sku.trim() === '') {
    errors.sku = 'El SKU es obligatorio. Genera uno automáticamente.'
    isValid = false
  }

  // Validar imagen (debe haber seleccionado un archivo)
  if (!selectedFile.value) {
    errors.img_prod = 'Debes seleccionar una imagen del producto'
    isValid = false
  }

  // Validar descripción
  if (!formData.descripcion || formData.descripcion.trim() === '') {
    errors.descripcion = 'La descripción es obligatoria'
    isValid = false
  }

  // Validar descripción corta
  if (!formData.descripcion_corta || formData.descripcion_corta.trim() === '') {
    errors.descripcion_corta = 'La descripción corta es obligatoria'
    isValid = false
  }

  // Validar categoría
  if (!formData.categoria || formData.categoria === '') {
    errors.categoria = 'Debes seleccionar una categoría'
    isValid = false
  }

  // Validar precio
  if (formData.precio === undefined || formData.precio <= 0) {
    errors.precio = 'El precio debe ser mayor a 0'
    isValid = false
  }

  // Validar stock
  if (formData.stock === undefined || formData.stock < 0) {
    errors.stock = 'El stock no puede ser negativo'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // Enviar datos del formulario junto con el archivo
    emit('submit', {
      formData: { ...formData },
      file: selectedFile.value
    })
  }
}

// Cargar categorías al montar
onMounted(() => {
  loadCategories()
})

// Exponer método para submit desde el padre
defineExpose({ handleSubmit })
</script>
