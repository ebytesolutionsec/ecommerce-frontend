<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-6">
          <svg class="animate-spin w-full h-full text-[#a3195b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Procesando tu pago</h2>
        <p class="text-gray-600">Por favor espera mientras confirmamos tu transacción...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentStatus === 'success'" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
        <p class="text-gray-600 mb-6">Tu pedido ha sido procesado correctamente.</p>

        <!-- Detalles del pago -->
        <div v-if="paymentDetails" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 class="font-semibold text-gray-900 mb-3">Detalles de la transacción</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">ID de transacción:</span>
              <span class="font-medium text-gray-900">{{ paymentDetails.transactionId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Monto:</span>
              <span class="font-medium text-gray-900">${{ formatAmount(paymentDetails.amount) }}</span>
            </div>
            <div v-if="paymentDetails.authorizationCode" class="flex justify-between">
              <span class="text-gray-600">Código de autorización:</span>
              <span class="font-medium text-gray-900">{{ paymentDetails.authorizationCode }}</span>
            </div>
            <div v-if="paymentDetails.cardBrand" class="flex justify-between">
              <span class="text-gray-600">Tarjeta:</span>
              <span class="font-medium text-gray-900">{{ paymentDetails.cardBrand }} ****{{ paymentDetails.lastDigits }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <router-link
            to="/mis-ordenes"
            class="block w-full px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition text-center"
          >
            Ver mis pedidos
          </router-link>
          <router-link
            to="/"
            class="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Seguir comprando
          </router-link>
        </div>
      </div>

      <!-- Cancelled State -->
      <div v-else-if="paymentStatus === 'cancelled'" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Pago Cancelado</h2>
        <p class="text-gray-600 mb-6">Tu pago ha sido cancelado. No se ha realizado ningún cargo.</p>

        <div class="space-y-3">
          <router-link
            to="/checkout"
            class="block w-full px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition text-center"
          >
            Intentar de nuevo
          </router-link>
          <router-link
            to="/carrito"
            class="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Volver al carrito
          </router-link>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="paymentStatus === 'error'" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Error en el Pago</h2>
        <p class="text-gray-600 mb-2">{{ errorMessage }}</p>
        <p class="text-sm text-gray-500 mb-6">Si el problema persiste, contacta a soporte.</p>

        <div class="space-y-3">
          <router-link
            to="/checkout"
            class="block w-full px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition text-center"
          >
            Intentar de nuevo
          </router-link>
          <router-link
            to="/"
            class="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart.js'
import { useToast } from '../../composables/useToast.js'
import paymentService from '../../services/paymentService.js'

const route = useRoute()
const router = useRouter()
const { clearCart } = useCart()
const { success, error: showError } = useToast()

// Estado
const loading = ref(true)
const paymentStatus = ref('') // 'success', 'cancelled', 'error'
const paymentDetails = ref(null)
const errorMessage = ref('Hubo un problema al procesar tu pago.')

// Formatear monto (de centavos a dólares)
const formatAmount = (cents) => {
  return (cents / 100).toFixed(2)
}

// Procesar respuesta de PayPhone
const processPayPhoneResponse = async () => {
  try {
    // DEBUG: Ver todos los parámetros que envía PayPhone
    //console.log('URL completa:', window.location.href)
   // console.log('Query params:', route.query)

    // Obtener parámetros de la URL (PayPhone los envía como query params)
    const { id, clientTransactionId } = route.query

    // Verificar si es una cancelación (ruta /pago/cancelado)
    if (route.path.includes('cancelado')) {
      paymentStatus.value = 'cancelled'
      loading.value = false
      return
    }

    // Si no hay parámetros, verificar localStorage
    if (!id || !clientTransactionId) {
      // Intentar recuperar datos de localStorage
      const pendingPayment = localStorage.getItem('pending_payphone_payment')
      if (!pendingPayment) {
        paymentStatus.value = 'error'
        errorMessage.value = 'No se encontraron datos de la transacción.'
        loading.value = false
        return
      }
    }

    // Recuperar idOrden de localStorage
    const pendingPayment = JSON.parse(localStorage.getItem('pending_payphone_payment') || '{}')

    // Confirmar el pago con el backend (id debe ser número)
    const confirmData = {
      id: parseInt(id),
      clientTransactionId,
      idOrden: pendingPayment.orderId,
      idPaymentMethod: pendingPayment.idPaymentMethod
    }

    const response = await paymentService.confirmPayPhonePayment(confirmData)

    // Verificar estado de la transacción
    if (response.data && response.data.transactionStatus === 'Approved') {
      paymentStatus.value = 'success'
      paymentDetails.value = {
        transactionId: response.data.transactionId || id,
        amount: response.data.amount,
        authorizationCode: response.data.authorizationCode,
        cardBrand: response.data.cardBrand,
        lastDigits: response.data.lastDigits
      }

      // Limpiar carrito y datos pendientes
      clearCart()
      localStorage.removeItem('pending_payphone_payment')

      success('¡Pago exitoso!', 'Tu pedido ha sido procesado correctamente.')
    } else if (response.data && response.data.transactionStatus === 'Canceled') {
      paymentStatus.value = 'cancelled'
    } else {
      paymentStatus.value = 'error'
      errorMessage.value = response.data?.message || 'La transacción no pudo ser completada.'
    }

  } catch (error) {
    console.error('Error al procesar respuesta de PayPhone:', error)
    paymentStatus.value = 'error'
    errorMessage.value = error.response?.data?.message || 'Error al confirmar el pago. Por favor contacta a soporte.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  processPayPhoneResponse()
})
</script>
