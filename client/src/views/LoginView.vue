<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a3195b] via-[#662482] to-[#e2312d] p-4 relative overflow-hidden">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Círculos decorativos -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Container principal con dos columnas -->
    <div class="w-full max-w-7xl relative z-10">
      <div class="grid lg:grid-cols-[40%_auto_60%] gap-0 items-center">
        <!-- Columna izquierda - Formulario (40%) -->
        <div class="order-2 lg:order-1 px-4 sm:px-8 py-8 lg:py-0">
          <LoginForm @login-success="handleLoginSuccess" />
        </div>

        <!-- Línea separatoria -->
        <div class="hidden lg:flex items-center justify-center h-full order-2">
          <div class="w-px h-3/4 bg-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
        </div>

        <!-- Columna derecha - Imagen (60%) -->
        <div class="order-1 lg:order-3 flex flex-col items-center justify-center px-4 sm:px-8 py-8 lg:py-0 space-y-4 sm:space-y-6">
          <div class="relative w-full max-w-xs sm:max-w-md">
            <!-- Efecto de brillo detrás de la imagen -->
            <div class="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
            <img
              src="../img/login.png"
              alt="Login illustration"
              class="relative w-full h-auto drop-shadow-2xl animate-float"
            />
          </div>
          <!-- Texto de Bienvenida -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-tight text-center">Bienvenido</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'

const router = useRouter()

const handleLoginSuccess = () => {
  router.push('/admin')
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
