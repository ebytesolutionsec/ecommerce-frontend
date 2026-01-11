<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar
      @toggle-sidebar="toggleSidebar"
      @open-edit-profile="openEditProfile"
    />
    <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />

    <!-- Main content -->
    <main class="pt-16 lg:pl-64 transition-all duration-300">
      <div class="p-6">
        <slot />
      </div>
    </main>

    <!-- Modal Editar Perfil -->
    <Modal
      :show="showEditProfileModal"
      title="Editar Perfil"
      confirm-text="Guardar Cambios"
      @close="closeEditProfile"
      @confirm="submitEditProfile"
    >
      <EditProfileForm
        ref="editProfileFormRef"
        @submit="handleEditProfileSubmit"
      />
    </Modal>

    <!-- Toast Notification -->
    <Toast
      :show="toastState.show"
      :type="toastState.type"
      :title="toastState.title"
      :message="toastState.message"
      :duration="toastState.duration"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import Modal from '../common/Modal.vue'
import Toast from '../common/Toast.vue'
import EditProfileForm from '../profile/EditProfileForm.vue'
import { userService } from '../../services/userService.js'
import { useToast } from '../../composables/useToast.js'

const sidebarOpen = ref(false)
const showEditProfileModal = ref(false)
const editProfileFormRef = ref(null)

const { toastState, success, error, hideToast } = useToast()

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const openEditProfile = () => {
  showEditProfileModal.value = true
}

const closeEditProfile = () => {
  showEditProfileModal.value = false
}

const submitEditProfile = () => {
  editProfileFormRef.value?.handleSubmit()
}

const handleEditProfileSubmit = async (formData) => {
  try {
    await userService.update(formData.id, formData)
    success('Perfil actualizado exitosamente', 'Tus cambios han sido guardados correctamente')
    closeEditProfile()
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    error('Error al actualizar el perfil', error.message || 'Ocurrió un error inesperado')
  }
}
</script>
