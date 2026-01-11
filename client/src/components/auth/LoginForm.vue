<template>
  <div class="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
    <div class="text-center mb-8">
      <!-- Icono de usuario -->
      <div class="mx-auto w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-white drop-shadow-lg">Inicia sesión en tu cuenta</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-white/90 mb-2">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
          :class="{ 'border-red-400': errors.email }"
          placeholder="correo@gmail.com"
          @blur="validateEmail"
          @input="errors.email = ''"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-300">{{ errors.email }}</p>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-medium text-white/90 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
          :class="{ 'border-red-400': errors.password }"
          placeholder="••••••••"
          @blur="validatePassword"
          @input="errors.password = ''"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-300">{{ errors.password }}</p>
      </div>

      <!-- Error de credenciales -->
      <div v-if="errors.credentials" class="p-3 bg-red-500/20 backdrop-blur-md border border-red-300/50 rounded-lg">
        <p class="text-sm text-white">{{ errors.credentials }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-white/90 hover:bg-white text-[#a3195b] font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md border border-white/50 mt-8"
      >
        {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { validateEmailFormat } from '../../utils/validators'
import { useAuth } from '../../composables/useAuth'
import authService from '../../services/authService'

const emit = defineEmits(['login-success'])
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  credentials: ''
})

const isSubmitting = ref(false)

// Validaciones individuales
const validateEmail = () => {
  if (!form.email) {
    errors.email = 'El email es requerido'
    return false
  }
  if (!validateEmailFormat(form.email)) {
    errors.email = 'Email inválido'
    return false
  }
  errors.email = ''
  return true
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    return false
  }
  errors.password = ''
  return true
}

// Submit del formulario - Autenticación con el backend
const handleSubmit = async () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  if (!isEmailValid || !isPasswordValid) return

  errors.credentials = ''
  isSubmitting.value = true

  try {
    // Llamada al backend para autenticación
    const response = await authService.login(form.email, form.password)

    // Guardar token en localStorage
    authService.setToken(response.token)

    // Marcar como autenticado en el composable
    login()

    // Emitir evento de login exitoso
    emit('login-success')
  } catch (error) {
    console.error('Error en login:', error)
    // Mostrar el mensaje de error del backend
    errors.credentials = error.message || 'Usuario o contraseña incorrectos'
  } finally {
    isSubmitting.value = false
  }
}
</script>
