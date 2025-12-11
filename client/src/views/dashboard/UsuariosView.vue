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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                No hay usuarios registrados
              </td>
            </tr>
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.rol }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button @click="openEditModal(user)" class="text-[#a3195b] hover:text-[#8a1450]">
                  <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(user)" class="text-[#e2312d] hover:text-red-700">
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
        v-if="usuarios.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="usuarios.length"
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
      <p class="text-gray-600">¿Estás seguro que deseas eliminar al usuario <strong>{{ userToDelete?.nombre }}</strong>?</p>
      <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '../../components/common/Modal.vue'
import UserForm from '../../components/users/UserForm.vue'
import Pagination from '../../components/common/Pagination.vue'

// Estado
const usuarios = ref([
  { id: 1, nombre: 'Admin Usuario', email: 'admin@gmail.com', rol: 'admin' },
  { id: 2, nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'usuario' },
  { id: 3, nombre: 'María García', email: 'maria@ejemplo.com', rol: 'usuario' }
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const userFormRef = ref(null)

// Paginación
const currentPage = ref(1)
const perPage = ref(10)
const totalPages = computed(() => Math.ceil(usuarios.value.length / perPage.value))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return usuarios.value.slice(start, end)
})

const changePage = (page) => {
  currentPage.value = page
}

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
    if (isEdit.value) {
      // Aquí irá la llamada al API para actualizar
      // await fetch(`/api/usuarios/${selectedUser.value.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulación - actualizar localmente
      const index = usuarios.value.findIndex(u => u.id === selectedUser.value.id)
      if (index !== -1) {
        usuarios.value[index] = { ...usuarios.value[index], ...formData }
      }
    } else {
      // Aquí irá la llamada al API para crear
      // const response = await fetch('/api/usuarios', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const newUser = await response.json()

      // Simulación - agregar localmente
      const newUser = {
        id: usuarios.value.length + 1,
        ...formData
      }
      usuarios.value.push(newUser)
    }

    closeModal()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    // Aquí irá la llamada al API para eliminar
    // await fetch(`/api/usuarios/${userToDelete.value.id}`, {
    //   method: 'DELETE'
    // })

    // Simulación - eliminar localmente
    usuarios.value = usuarios.value.filter(u => u.id !== userToDelete.value.id)

    showDeleteModal.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}
</script>
