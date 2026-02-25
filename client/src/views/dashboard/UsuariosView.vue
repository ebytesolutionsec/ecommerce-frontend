<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Usuarios</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:from-[#8a1450] hover:to-[#551d6d] transition flex items-center space-x-2 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-12">
                <LoadingSpinner message="Cargando usuarios..." container-class="" size="md" />
              </td>
            </tr>
            <tr v-else-if="paginatedUsers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                No hay usuarios registrados
              </td>
            </tr>
            <tr v-else v-for="user in paginatedUsers" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.dni }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.fullName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.role === 'superadmin' ? 'Super Admin' : 'Comprador' }}
                </span>
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
      :title="isEdit ? 'Editar Usuario' : 'Crear Usuario'"
      :confirm-text="isEdit ? 'Actualizar' : 'Crear'"
      @close="closeModal"
      @confirm="submitForm"
    >
      <UserForm
        ref="userFormRef"
        :user="selectedUser"
        :is-edit="isEdit"
        @submit="handleSubmit"
      />
    </Modal>

    <!-- Modal Eliminar -->
    <Modal
      :show="showDeleteModal"
      title="Eliminar Usuario"
      confirm-text="Eliminar"
      @close="showDeleteModal = false"
      @confirm="deleteUser"
    >
      <p class="text-gray-600">¿Estás seguro que deseas eliminar al usuario <strong>{{ userToDelete?.fullName }}</strong>?</p>
      <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Modal from '../../components/common/Modal.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import UserForm from '../../components/users/UserForm.vue'
import Pagination from '../../components/common/Pagination.vue'
import userService from '../../services/userService.js'
import { useToast } from '../../composables/useToast.js'

const { success, error: showError } = useToast()

// Estado
const usuarios = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const userFormRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// Paginación
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / perPage.value))
const paginatedUsers = computed(() => usuarios.value)

// Cargar usuarios desde el backend
const loadUsers = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await userService.list(currentPage.value, perPage.value)

    // El backend retorna { data, total, limit, page, totalPages }
    usuarios.value = response.data || []
    total.value = response.total || 0

    console.log('Usuarios cargados:', usuarios.value.length, 'Total:', total.value)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    errorMessage.value = error.message || 'Error al cargar los usuarios'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  loadUsers()
}

// Cargar usuarios al montar el componente
onMounted(() => {
  loadUsers()
})

// CRUD Operations
const openCreateModal = () => {
  isEdit.value = false
  selectedUser.value = null
  showModal.value = true
}

const openEditModal = (user) => {
  isEdit.value = true
  selectedUser.value = { ...user }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

const submitForm = () => {
  userFormRef.value?.handleSubmit()
}

const handleSubmit = async (formData) => {
  try {
    loading.value = true
    errorMessage.value = ''

    if (isEdit.value) {
      // Actualizar usuario existente
      await userService.update(selectedUser.value._id, formData)
      success('Usuario actualizado exitosamente', 'Los cambios han sido guardados correctamente')
    } else {
      // Crear nuevo usuario
      await userService.create(formData)
      success('Usuario creado exitosamente', 'El usuario ha sido agregado correctamente')
    }

    closeModal()
    // Recargar la lista de usuarios
    await loadUsers()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    errorMessage.value = error.message || 'Error al guardar el usuario'
    showError('Error al guardar el usuario', errorMessage.value)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Eliminar usuario del backend
    await userService.delete(userToDelete.value._id)

    success('Usuario eliminado exitosamente', 'El usuario ha sido eliminado correctamente')
    showDeleteModal.value = false
    userToDelete.value = null

    // Recargar la lista de usuarios
    await loadUsers()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    errorMessage.value = error.message || 'Error al eliminar el usuario'
    showError('Error al eliminar el usuario', errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>
