<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a3195b] via-[#662482] to-[#e2312d] p-4 relative overflow-hidden">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Container principal -->
    <div class="w-full max-w-md relative z-10">
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-[#a3195b] to-[#662482] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span class="text-white font-bold text-2xl">E</span>
          </div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">Crear Cuenta</h2>
          <p class="text-gray-600">Únete a EBYTE y comienza a comprar</p>
        </div>

        <!-- Formulario de Registro -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.nombre"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
              :class="{ 'border-red-500': errors.nombre }"
              placeholder="Juan"
            />
            <span v-if="errors.nombre" class="text-red-500 text-sm">{{ errors.nombre }}</span>
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Apellido <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.apellido"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
              :class="{ 'border-red-500': errors.apellido }"
              placeholder="Pérez"
            />
            <span v-if="errors.apellido" class="text-red-500 text-sm">{{ errors.apellido }}</span>
          </div>

          <!-- Correo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.correo"
              type="email"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
              :class="{ 'border-red-500': errors.correo }"
              placeholder="juan@ejemplo.com"
            />
            <span v-if="errors.correo" class="text-red-500 text-sm">{{ errors.correo }}</span>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              v-model="formData.telefono"
              type="tel"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
              placeholder="+1 234 567 890"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="formData.contrasena"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                :class="{ 'border-red-500': errors.contrasena }"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <span v-if="errors.contrasena" class="text-red-500 text-sm">{{ errors.contrasena }}</span>
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <!-- Confirmar Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.confirmarContrasena"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
              :class="{ 'border-red-500': errors.confirmarContrasena }"
              placeholder="••••••••"
            />
            <span v-if="errors.confirmarContrasena" class="text-red-500 text-sm">{{ errors.confirmarContrasena }}</span>
          </div>

          <!-- Términos y Condiciones -->
          <div class="flex items-start">
            <input
              v-model="formData.aceptaTerminos"
              type="checkbox"
              id="terminos"
              required
              class="mt-1 w-4 h-4 text-[#a3195b] border-gray-300 rounded focus:ring-[#a3195b]"
            />
            <label for="terminos" class="ml-2 text-sm text-gray-600">
              Acepto los <a href="#" class="text-[#a3195b] hover:underline">Términos y Condiciones</a> y la
              <a href="#" class="text-[#a3195b] hover:underline">Política de Privacidad</a>
            </label>
          </div>

          <!-- Botón de Registro -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
          </button>
        </form>

        <!-- Separador -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
          </div>
        </div>

        <!-- Link a Login -->
        <router-link
          to="/login"
          class="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Iniciar Sesión
        </router-link>

        <!-- Volver a la Tienda -->
        <router-link
          to="/"
          class="block text-center mt-4 text-sm text-gray-600 hover:text-[#a3195b] transition"
        >
          ← Volver a la tienda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../../composables/useToast.js'

const router = useRouter()
const { success, error: showError } = useToast()

// Estado
const loading = ref(false)
const showPassword = ref(false)
const formData = ref({
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmarContrasena: '',
  rol: 'comprador',
  aceptaTerminos: false
})

const errors = ref({})

// Validación
const validateForm = () => {
  errors.value = {}

  if (!formData.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
  }

  if (!formData.value.apellido.trim()) {
    errors.value.apellido = 'El apellido es requerido'
  }

  if (!formData.value.correo.trim()) {
    errors.value.correo = 'El correo es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.correo)) {
    errors.value.correo = 'El correo no es válido'
  }

  if (!formData.value.contrasena) {
    errors.value.contrasena = 'La contraseña es requerida'
  } else if (formData.value.contrasena.length < 6) {
    errors.value.contrasena = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (formData.value.contrasena !== formData.value.confirmarContrasena) {
    errors.value.confirmarContrasena = 'Las contraseñas no coinciden'
  }

  if (!formData.value.aceptaTerminos) {
    showError('Error', 'Debes aceptar los términos y condiciones')
    return false
  }

  return Object.keys(errors.value).length === 0
}

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    // TODO: Conectar con el backend cuando esté disponible
    // const response = await userService.register(formData.value)

    // Simulación
    await new Promise(resolve => setTimeout(resolve, 1500))

    success(
      'Cuenta creada exitosamente',
      'Tu cuenta ha sido creada. Ya puedes iniciar sesión'
    )

    router.push('/login')
  } catch (error) {
    console.error('Error al crear cuenta:', error)
    showError(
      'Error al crear la cuenta',
      error.message || 'Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.'
    )
  } finally {
    loading.value = false
  }
}
</script>
