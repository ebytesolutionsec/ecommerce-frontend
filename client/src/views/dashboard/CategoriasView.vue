<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Categorías</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:from-[#8a1450] hover:to-[#551d6d] transition flex items-center space-x-2 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nueva Categoría</span>
      </button>
    </div>

    <!-- Tabla de categorías -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3195b]"></div>
                  <span class="ml-3">Cargando categorías...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedCategories.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                No hay categorías registradas
              </td>
            </tr>
            <tr v-else v-for="category in paginatedCategories" :key="category._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ category.descripcion }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(category.dateCreation) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button @click="openEditModal(category)" class="text-[#a3195b] hover:text-[#8a1450]">
                  <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(category)" class="text-[#e2312d] hover:text-red-700">
                  <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
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

    <!-- Modal Crear/Editar -->
    <Modal
      :show="showModal"
      :title="isEdit ? 'Editar Categoría' : 'Crear Categoría'"
      :confirm-text="isEdit ? 'Actualizar' : 'Crear'"
      @close="closeModal"
      @confirm="submitForm"
    >
      <CategoryForm
        ref="categoryFormRef"
        :category="selectedCategory"
        :is-edit="isEdit"
        @submit="handleSubmit"
      />
    </Modal>

    <!-- Modal Eliminar -->
    <Modal
      :show="showDeleteModal"
      title="Eliminar Categoría"
      confirm-text="Eliminar"
      @close="showDeleteModal = false"
      @confirm="deleteCategory"
    >
      <p class="text-gray-600">¿Estás seguro que deseas eliminar la categoría <strong>{{ categoryToDelete?.name }}</strong>?</p>
      <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import CategoryForm from '../../components/categories/CategoryForm.vue'
import Pagination from '../../components/common/Pagination.vue'
import categoryService from '../../services/categoryService.js'
import { useToast } from '../../composables/useToast.js'

const { success, error: showError } = useToast()

// Estado
const categorias = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const selectedCategory = ref(null)
const categoryToDelete = ref(null)
const categoryFormRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// Paginación
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / perPage.value))
const paginatedCategories = computed(() => categorias.value)

// Cargar categorías desde el backend
const loadCategories = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await categoryService.list(currentPage.value, perPage.value)

    categorias.value = response.data || []
    total.value = response.total || 0

    console.log('Categorías cargadas:', categorias.value.length, 'Total:', total.value)
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    errorMessage.value = error.message || 'Error al cargar las categorías'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  loadCategories()
}

// Cargar categorías al montar el componente
onMounted(() => {
  loadCategories()
})

// CRUD Operations
const openCreateModal = () => {
  isEdit.value = false
  selectedCategory.value = null
  showModal.value = true
}

const openEditModal = (category) => {
  isEdit.value = true
  selectedCategory.value = { ...category }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCategory.value = null
}

const submitForm = () => {
  categoryFormRef.value?.handleSubmit()
}

const handleSubmit = async (formData) => {
  try {
    loading.value = true
    errorMessage.value = ''

    if (isEdit.value) {
      // Actualizar categoría existente
      await categoryService.update(selectedCategory.value._id, formData)
      success('Categoría actualizada exitosamente', 'Los cambios han sido guardados correctamente')
    } else {
      // Crear nueva categoría
      await categoryService.create(formData)
      success('Categoría creada exitosamente', 'La categoría ha sido agregada correctamente')
    }

    closeModal()
    // Recargar la lista de categorías
    await loadCategories()
  } catch (error) {
    console.error('Error al guardar categoría:', error)
    errorMessage.value = error.message || 'Error al guardar la categoría'
    showError('Error al guardar la categoría', errorMessage.value)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Eliminar categoría del backend
    await categoryService.delete(categoryToDelete.value._id)

    success('Categoría eliminada exitosamente', 'La categoría ha sido eliminada correctamente')
    showDeleteModal.value = false
    categoryToDelete.value = null

    // Recargar la lista de categorías
    await loadCategories()
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    errorMessage.value = error.message || 'Error al eliminar la categoría'
    showError('Error al eliminar la categoría', errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
