<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        <p class="text-gray-600 mt-2">Complete la información para procesar su pedido</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Formulario de Checkout (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Pasos de navegación -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
                :class="{ 'flex-1': index < steps.length - 1 }"
              >
                <!-- Círculo del paso -->
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition"
                    :class="
                      currentStep === step.id
                        ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    "
                  >
                    <svg
                      v-if="currentStep > step.id"
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span v-else>{{ step.id }}</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p
                      class="text-sm font-medium"
                      :class="currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'"
                    >
                      {{ step.title }}
                    </p>
                  </div>
                </div>

                <!-- Línea conectora -->
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-0.5 mx-4"
                  :class="currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'"
                ></div>
              </div>
            </div>
          </div>

          <!-- Paso 1: Información de Envío -->
          <div v-show="currentStep === 1" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Información de Envío</h2>

            <form @submit.prevent="goToPayment" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Nombre completo -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    v-model="shippingInfo.fullName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    v-model="shippingInfo.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <!-- Teléfono -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    v-model="shippingInfo.phone"
                    type="tel"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="0999999999"
                  />
                </div>

                <!-- Dirección -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    v-model="shippingInfo.address"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="Calle Principal y Secundaria"
                  />
                </div>

                <!-- Ciudad -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    v-model="shippingInfo.city"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="Guayaquil"
                  />
                </div>

                <!-- Código Postal -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    v-model="shippingInfo.zipCode"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="090150"
                  />
                </div>

                <!-- Notas adicionales -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    v-model="shippingInfo.notes"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                    placeholder="Indicaciones especiales para la entrega..."
                  ></textarea>
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Continuar al Pago
                </button>
              </div>
            </form>
          </div>

          <!-- Paso 2: Método de Pago -->
          <div v-show="currentStep === 2" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Método de Pago</h2>

            <!-- Loading métodos de pago -->
            <div v-if="loadingMethods" class="flex items-center justify-center py-8">
              <svg class="animate-spin h-8 w-8 text-[#a3195b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-3 text-gray-600">Cargando métodos de pago...</span>
            </div>

            <div v-else-if="paymentMethods.length === 0" class="text-center py-8 text-gray-500">
              No hay métodos de pago disponibles en este momento.
            </div>

            <div v-else class="space-y-4">
              <label
                v-for="method in paymentMethods"
                :key="method._id"
                class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
                :class="
                  paymentMethod === method._id
                    ? 'border-[#a3195b] bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  v-model="paymentMethod"
                  :value="method._id"
                  class="mt-1 w-5 h-5 text-[#a3195b] focus:ring-[#a3195b]"
                />
                <div class="ml-4 flex-1">
                  <!-- PayPhone (tarjeta) -->
                  <template v-if="method.provider === 'card payment'">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <svg
                          class="w-8 h-8 text-[#a3195b]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <div>
                          <p class="font-semibold text-gray-900">{{ method.name }}</p>
                          <p class="text-sm text-gray-500">Tarjeta de crédito o débito</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" class="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-6" />
                      </div>
                    </div>

                    <!-- Info de redirección -->
                    <div v-if="paymentMethod === method._id" class="mt-4 bg-blue-50 rounded-lg p-4 text-sm">
                      <div class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        <div class="text-gray-700">
                          <p class="font-medium">Serás redirigido a una página segura</p>
                          <p class="text-gray-500 mt-1">Ingresarás los datos de tu tarjeta en un entorno seguro para completar el pago.</p>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Transferencia bancaria -->
                  <template v-else-if="method.provider === 'bank transfer'">
                    <div class="flex items-center gap-3">
                      <svg
                        class="w-8 h-8 text-[#a3195b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                      <div>
                        <p class="font-semibold text-gray-900">{{ method.name }}</p>
                        <p class="text-sm text-gray-500">Realiza una transferencia directa</p>
                      </div>
                    </div>

                    <!-- Información de transferencia desde config -->
                    <div v-if="paymentMethod === method._id" class="mt-4 bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <p class="font-semibold text-gray-700">Datos para la transferencia:</p>
                      <div v-if="method.config" class="space-y-1 text-gray-600">
                        <p v-if="method.config.banco"><span class="font-medium">Banco:</span> {{ method.config.banco }}</p>
                        <p v-if="method.config.tipoCuenta"><span class="font-medium">Tipo de cuenta:</span> {{ method.config.tipoCuenta }}</p>
                        <p v-if="method.config.numeroCuenta"><span class="font-medium">Número de cuenta:</span> {{ method.config.numeroCuenta }}</p>
                        <p v-if="method.config.beneficiario"><span class="font-medium">Beneficiario:</span> {{ method.config.beneficiario }}</p>
                        <p v-if="method.config.ruc"><span class="font-medium">RUC:</span> {{ method.config.ruc }}</p>
                      </div>
                      <div class="mt-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Numero de comprobante *
                        </label>
                        <input
                          v-model="transferInfo.referenceNumber"
                          type="text"
                          placeholder="Ingrese el numero de comprobante"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a3195b] focus:border-transparent"
                        />
                      </div>
                      <div class="mt-3">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Foto del comprobante *
                        </label>
                        <div
                          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#a3195b] transition"
                          :class="transferInfo.receiptFile ? 'border-green-400 bg-green-50' : ''"
                          @click="$refs.receiptInput.click()"
                          @dragover.prevent
                          @drop.prevent="handleFileDrop"
                        >
                          <input
                            ref="receiptInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleFileSelect"
                          />
                          <div v-if="!receiptPreview">
                            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="mt-2 text-sm text-gray-500">Haz clic o arrastra la imagen aqui</p>
                            <p class="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
                          </div>
                          <div v-else class="relative">
                            <img :src="receiptPreview" alt="Comprobante" class="max-h-40 mx-auto rounded-lg" />
                            <p class="mt-2 text-sm text-green-600 font-medium">{{ transferInfo.receiptFile.name }}</p>
                          </div>
                        </div>
                        <button
                          v-if="receiptPreview"
                          type="button"
                          @click="removeReceipt"
                          class="mt-2 text-sm text-red-500 hover:text-red-700 transition"
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    </div>
                  </template>

                  <!-- Proveedor genérico (fallback) -->
                  <template v-else>
                    <div class="flex items-center gap-3">
                      <div>
                        <p class="font-semibold text-gray-900">{{ method.name }}</p>
                        <p class="text-sm text-gray-500">{{ method.provider }}</p>
                      </div>
                    </div>
                  </template>
                </div>
              </label>
            </div>

            <!-- Botones de navegación -->
            <div class="flex justify-between pt-6">
              <button
                @click="currentStep = 1"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Volver
              </button>
              <button
                @click="handlePlaceOrder"
                :disabled="!paymentMethod || processingOrder"
                class="px-8 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="processingOrder"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span v-if="processingOrder">Procesando...</span>
                <span v-else>Realizar Pedido</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del Pedido (1/3) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

            <!-- Productos -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartItems"
                :key="item._id || item.id"
                class="flex gap-3"
              >
                <img
                  :src="getProductImage(item)"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                  <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                  <p class="text-sm font-semibold text-gray-900">
                    ${{ formatPrice(getCurrentPrice(item) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Totales -->
            <div class="border-t border-gray-200 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-gray-900">${{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span class="font-medium text-green-600">Gratis</span>
              </div>
              <div class="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span class="text-gray-900">Total</span>
                <span class="text-[#a3195b]">${{ formatPrice(cartTotal) }}</span>
              </div>
            </div>

            <!-- Información de seguridad -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-start gap-2 text-xs text-gray-500">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Transacción segura. Tu información está protegida.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart.js'
import { useToast } from '../../composables/useToast.js'
import authService from '../../services/authService.js'
import orderService from '../../services/orderService.js'
import paymentService from '../../services/paymentService.js'

const router = useRouter()
const { cartItems, cartTotal, clearCart } = useCart()
const { success, error: showError } = useToast()

// Estado
const currentStep = ref(1)
const processingOrder = ref(false)
const paymentMethod = ref('')
const paymentMethods = ref([])
const loadingMethods = ref(false)

// Pasos del checkout
const steps = [
  { id: 1, title: 'Información de Envío' },
  { id: 2, title: 'Método de Pago' },
]

// Información de envío
const shippingInfo = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  notes: '',
})

// Información de tarjeta
const cardInfo = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
})

// Información de transferencia
const transferInfo = ref({
  referenceNumber: '',
  receiptFile: null,
})
const receiptPreview = ref(null)

// Manejo de archivo de comprobante
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) processReceiptFile(file)
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) processReceiptFile(file)
}

const processReceiptFile = (file) => {
  if (!file.type.startsWith('image/')) {
    showError('Error', 'Solo se permiten imagenes (PNG, JPG)')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showError('Error', 'La imagen no debe superar los 5MB')
    return
  }
  transferInfo.value.receiptFile = file
  receiptPreview.value = URL.createObjectURL(file)
}

const removeReceipt = () => {
  transferInfo.value.receiptFile = null
  receiptPreview.value = null
}

// Computed
const getCurrentPrice = (item) => {
  if (item.precio_descuento > 0) {
    return item.precio_descuento
  }
  return item.precio || 0
}

// Methods
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const getProductImage = (item) => {
  if (item.image) return item.image
  if (item.img_prod) {
    if (item.img_prod.startsWith('http')) {
      return item.img_prod
    }
    return `http://localhost:3000${item.img_prod}`
  }
  return 'https://via.placeholder.com/100x100?text=Producto'
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/100x100?text=Producto'
}

const goToPayment = () => {
  currentStep.value = 2
}

const handlePlaceOrder = async () => {
  if (!paymentMethod.value) {
    showError('Error', 'Por favor selecciona un método de pago')
    return
  }

  // Obtener el método seleccionado
  const selectedMethod = paymentMethods.value.find(m => m._id === paymentMethod.value)
  if (!selectedMethod) {
    showError('Error', 'Método de pago no válido')
    return
  }

  // Validar campos según método de pago
  if (selectedMethod.provider === 'bank transfer') {
    if (!transferInfo.value.referenceNumber) {
      showError('Error', 'Por favor ingresa el numero de comprobante')
      return
    }
    if (!transferInfo.value.receiptFile) {
      showError('Error', 'Por favor sube la foto del comprobante de transferencia')
      return
    }
  }

  processingOrder.value = true

  try {
    // 1. Crear la orden
    const orderItems = cartItems.value.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity
    }))

    // Formatear dirección de envío
    const shippingAddress = `${shippingInfo.value.address}, ${shippingInfo.value.city}${shippingInfo.value.zipCode ? `, CP: ${shippingInfo.value.zipCode}` : ''}`

    const orderResponse = await orderService.create(orderItems, shippingAddress)
    // El backend devuelve { message, order } directamente
    const orderId = orderResponse.order?._id || orderResponse.order?.id || orderResponse.data?._id || orderResponse.data?.id
    const orderNumber = orderResponse.order?.order_number || orderResponse.data?.order_number

    if (!orderId) {
      console.error('Respuesta del backend:', orderResponse)
      throw new Error('No se pudo obtener el ID de la orden')
    }

    // 2. Procesar según método de pago
    if (selectedMethod.provider === 'card payment') {
      // Pago con tarjeta: usar PayPhone
      await handlePayPhonePayment(orderId, orderNumber)
      return // No continuar, el usuario será redirigido

    } else if (selectedMethod.provider === 'bank transfer') {
      // Transferencia bancaria
      const paymentData = {
        payment_method_id: paymentMethod.value,
        transaction_id: transferInfo.value.referenceNumber,
        provider_response: {
          method: 'transfer',
          shipping: shippingInfo.value
        }
      }

      await paymentService.createPayment(orderId, paymentData)

      // 3. Limpiar carrito y redirigir
      clearCart()
      success('¡Pedido realizado!', 'Tu pedido ha sido procesado exitosamente')

      setTimeout(() => {
        router.push('/mis-ordenes')
      }, 2000)

    } else {
      throw new Error(`Método de pago no soportado: ${selectedMethod.provider}`)
    }

  } catch (error) {
    console.error('Error al procesar pedido:', error)

    // Mapear mensajes de error del backend a mensajes amigables
    const errorMessage = getErrorMessage(error.message)
    showError('Error al procesar pedido', errorMessage)
  } finally {
    processingOrder.value = false
  }
}

// Mapear errores del backend a mensajes amigables para el usuario
const getErrorMessage = (backendMessage) => {
  const errorMap = {
    'La orden debe tener al menos un producto': 'Tu carrito está vacío. Agrega productos antes de continuar.',
    'Producto no disponible': 'Uno de los productos ya no está disponible. Por favor revisa tu carrito.',
    'Stock insuficiente': 'No hay suficiente stock para uno de los productos. Reduce la cantidad o elimínalo del carrito.',
    'Error al crear la orden': 'No se pudo procesar tu orden. Por favor intenta nuevamente.',
    'No se recibió la URL de pago de PayPhone': 'Error al conectar con PayPhone. Intenta con otro método de pago.',
    'E11000 duplicate key': 'Error del sistema al generar el número de orden. Por favor contacta a soporte.',
    'order_number': 'Error del sistema al generar el número de orden. Por favor contacta a soporte.',
  }

  // Buscar coincidencia parcial en el mensaje
  for (const [key, value] of Object.entries(errorMap)) {
    if (backendMessage && backendMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  // Si el mensaje contiene "stock insuficiente para" extraer el nombre del producto
  if (backendMessage && backendMessage.toLowerCase().includes('stock insuficiente para')) {
    return backendMessage // Ya es descriptivo
  }

  return backendMessage || 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.'
}

// Manejar pago con PayPhone
const handlePayPhonePayment = async (orderId, orderNumber) => {
  try {
    // Generar ID único de transacción del comercio
    const clientTransactionId = `ORD-${orderId}-${Date.now()}`

    // Convertir monto a centavos (PayPhone usa centavos)
    const amountInCents = paymentService.amountToCents(cartTotal.value)

    // Guardar datos en localStorage para recuperar después del pago
    localStorage.setItem('pending_payphone_payment', JSON.stringify({
      orderId,
      orderNumber,
      clientTransactionId,
      idPaymentMethod: paymentMethod.value,
      shippingInfo: shippingInfo.value,
      cartItems: cartItems.value,
      amount: cartTotal.value
    }))

    // Preparar datos para el backend (según lo que espera /payphone/redirect)
    const paymentData = {
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      clientTransactionId,
      reference: `Orden ${orderId}`,
      responseUrl: `${window.location.origin}/pago/respuesta`,
      cancellationUrl: `${window.location.origin}/pago/cancelado`
    }

    // Llamar al backend para preparar el pago con PayPhone
    const response = await paymentService.preparePayPhonePayment(paymentData)

    // El backend devuelve { success: true, data: { payWithCard, payWithPayPhone, ... } }
    const paymentUrl = response.data?.payWithCard || response.data?.payWithPayPhone

    if (paymentUrl) {
      // Redirigir al usuario a PayPhone
      window.location.href = paymentUrl
    } else {
      console.error('Respuesta de PayPhone:', response)
      throw new Error('No se recibió la URL de pago de PayPhone')
    }

  } catch (error) {
    console.error('Error al preparar pago PayPhone:', error)
    // Limpiar datos pendientes
    localStorage.removeItem('pending_payphone_payment')
    throw error
  }
}

// Cargar métodos de pago del backend
const loadPaymentMethods = async () => {
  loadingMethods.value = true
  try {
    const response = await paymentService.listPaymentMethods()
    // Filtrar solo métodos activos
    const methods = response.data || response.methods || response
    // Normalizar provider a minúsculas para comparaciones consistentes
    paymentMethods.value = Array.isArray(methods)
      ? methods.filter(m => m.active).map(m => ({ ...m, provider: (m.provider || '').toLowerCase() }))
      : []
  } catch (err) {
    console.error('Error al cargar métodos de pago:', err)
    showError('Error', 'No se pudieron cargar los métodos de pago')
  } finally {
    loadingMethods.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Verificar que hay productos en el carrito
  if (cartItems.value.length === 0) {
    showError('Carrito vacío', 'No tienes productos en tu carrito')
    router.push('/carrito')
    return
  }

  // Verificar autenticación
  if (!authService.isAuthenticated()) {
    showError('Autenticación requerida', 'Debes iniciar sesión o crear una cuenta para continuar')
    // Guardar la ruta actual para redirigir después del login
    router.push({ name: 'login', query: { redirect: '/checkout' } })
    return
  }

  // Pre-llenar datos del usuario si están disponibles
  const token = authService.getToken()
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      if (decoded.email) shippingInfo.value.email = decoded.email
      if (decoded.fullName) shippingInfo.value.fullName = decoded.fullName
      if (decoded.phone) shippingInfo.value.phone = decoded.phone
      if (decoded.direccion) shippingInfo.value.address = decoded.direccion
    } catch (error) {
      console.error('Error al decodificar token:', error)
    }
  }

  // Cargar métodos de pago
  loadPaymentMethods()
})
</script>
