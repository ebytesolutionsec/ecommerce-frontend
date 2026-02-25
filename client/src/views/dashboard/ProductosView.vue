<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Productos</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:from-[#8a1450] hover:to-[#551d6d] transition flex items-center space-x-2 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo Producto</span>
      </button>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-12">
                <LoadingSpinner message="Cargando productos..." container-class="" size="md" />
              </td>
            </tr>
            <tr v-else-if="paginatedProducts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                No hay productos registrados
              </td>
            </tr>
            <tr v-else v-for="product in paginatedProducts" :key="product._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{{ product.sku }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="product.img_prod"
                      :src="getImageUrl(product.img_prod)"
                      :alt="product.name"
                      class="h-10 w-10 rounded object-cover"
                      @error="(e) => e.target.src = 'https://via.placeholder.com/40'"
                    />
                    <div v-else class="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.descripcion_corta }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                  {{ getCategoryName(product.categoria) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <span class="font-semibold">${{ product.precio.toFixed(2) }}</span>
                  <div v-if="product.precio_descuento > 0" class="text-xs text-green-600">
                    Descuento: ${{ product.precio_descuento.toFixed(2) }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ product.stock }} unidades
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex flex-col space-y-1">
                  <span v-if="product.destacado" class="inline-flex items-center text-xs text-yellow-600">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Destacado
                  </span>
                  <span :class="[
                    'inline-flex items-center text-xs',
                    product.disponible ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ product.disponible ? '✓ Disponible' : '✗ No disponible' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <Pagination
        v-if="total > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        :per-page="perPage"
        @page-change="changePage"
      />
    </div>

    <!-- Modal Crear Producto -->
    <Modal
      :show="showModal"
      title="Crear Producto"
      confirm-text="Crear Producto"
      @close="closeModal"
      @confirm="submitForm"
    >
      <ProductForm
        ref="productFormRef"
        :product="selectedProduct"
        :is-edit="isEdit"
        @submit="handleSubmit"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import ProductForm from '../../components/products/ProductForm.vue'
import Pagination from '../../components/common/Pagination.vue'
import productService from '../../services/productService.js'
import categoryService from '../../services/categoryService.js'
import { useToast } from '../../composables/useToast.js'

const { success, error: showError } = useToast()

// Estado
const productos = ref([])
const categorias = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const selectedProduct = ref(null)
const productFormRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// Paginación
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / perPage.value))
const paginatedProducts = computed(() => productos.value)

// Cargar categorías para mostrar nombres
const loadCategories = async () => {
  try {
    const response = await categoryService.list(1, 100)
    categorias.value = response.data || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

// Obtener nombre de categoría
const getCategoryName = (categoriaId) => {
  if (typeof categoriaId === 'object' && categoriaId?.name) {
    return categoriaId.name
  }
  const categoria = categorias.value.find(c => c._id === categoriaId)
  return categoria ? categoria.name : 'Sin categoría'
}

// Obtener URL correcta de la imagen
// El backend guarda: /uploads/productos/imagen.jpg
// Pero sirve con: app.use('/uploads/productos', express.static('uploads'))
// Entonces necesitamos duplicar 'productos' en la URL
const getImageUrl = (imgPath) => {
  if (!imgPath) return 'https://via.placeholder.com/40'
  if (imgPath.startsWith('http')) return imgPath

  // Si es /uploads/productos/imagen.jpg, cambiar a /uploads/productos/productos/imagen.jpg
  const adjustedPath = imgPath.replace('/uploads/productos/', '/uploads/productos/productos/')
  return `http://localhost:3000${adjustedPath}`
}

// Cargar productos desde el backend
const loadProducts = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await productService.list(currentPage.value, perPage.value)

    productos.value = response.data || []
    total.value = response.total || 0

    console.log('Productos cargados:', productos.value.length, 'Total:', total.value)
  } catch (error) {
    console.error('Error al cargar productos:', error)
    errorMessage.value = error.message || 'Error al cargar los productos'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  loadProducts()
}

// Cargar datos al montar el componente
onMounted(() => {
  loadCategories()
  loadProducts()
})

// CRUD Operations
const openCreateModal = () => {
  isEdit.value = false
  selectedProduct.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const submitForm = () => {
  productFormRef.value?.handleSubmit()
}

const handleSubmit = async (data) => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Crear nuevo producto con FormData (datos + archivo)
    await productService.create(data.formData, data.file)

    success('Producto creado exitosamente', 'El producto ha sido agregado correctamente')
    closeModal()
    // Recargar la lista de productos
    await loadProducts()
  } catch (error) {
    console.error('Error al guardar producto:', error)
    errorMessage.value = error.message || 'Error al guardar el producto'
    showError('Error al guardar el producto', errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>
