<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Carrito de Compras</h1>
        <p class="text-gray-600">{{ cartItemCount }} artículo(s) en tu carrito</p>
      </div>

      <!-- Carrito Vacío -->
      <div v-if="cartItems.length === 0" class="text-center py-20">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-500 mb-6">¡Agrega productos para comenzar tu compra!</p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          Continuar Comprando
        </router-link>
      </div>

      <!-- Contenido del Carrito -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Lista de Productos -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item._id || item.id"
            class="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6"
          >
            <!-- Imagen del Producto -->
            <div class="flex-shrink-0">
              <img
                :src="getProductImage(item)"
                :alt="item.name"
                class="w-32 h-32 object-cover rounded-lg"
                @error="handleImageError"
              />
            </div>

            <!-- Información del Producto -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                <button
                  @click="removeFromCart(item._id || item.id)"
                  class="text-red-500 hover:text-red-700 transition"
                  title="Eliminar del carrito"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <p v-if="item.descripcion_corta" class="text-sm text-gray-600 mb-4">
                {{ item.descripcion_corta }}
              </p>

              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <!-- Precio -->
                <div>
                  <span class="text-2xl font-bold text-gray-900">
                    ${{ formatPrice(getItemPrice(item)) }}
                  </span>
                  <span v-if="item.originalPrice || (item.precio && item.precio_descuento > 0)" class="text-sm text-gray-400 line-through ml-2">
                    ${{ formatPrice(item.originalPrice || item.precio) }}
                  </span>
                </div>

                <!-- Cantidad -->
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">Cantidad:</span>
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                      @click="updateQuantity(item._id || item.id, item.quantity - 1)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      :disabled="item.quantity <= 1"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      :value="item.quantity"
                      @change="handleQuantityChange(item._id || item.id, $event)"
                      class="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
                      min="1"
                      :max="item.stock || 999"
                    />
                    <button
                      @click="updateQuantity(item._id || item.id, item.quantity + 1)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      :disabled="item.stock && item.quantity >= item.stock"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- Subtotal -->
              <div class="mt-4 text-right">
                <span class="text-sm text-gray-600">Subtotal: </span>
                <span class="text-xl font-bold text-gray-900">
                  ${{ formatPrice(getItemPrice(item) * item.quantity) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del Pedido -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartItemCount }} artículos)</span>
                <span>${{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span class="text-green-600 font-semibold">GRATIS</span>
              </div>
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span class="text-2xl">${{ formatPrice(cartTotal) }}</span>
                </div>
              </div>
            </div>

            <router-link
              to="/checkout"
              class="block w-full py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition mb-3 text-center"
            >
              Proceder al Pago
            </router-link>

            <router-link
              to="/"
              class="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Continuar Comprando
            </router-link>

            <!-- Información Adicional -->
            <div class="mt-6 space-y-3 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Envío gratis en todos los pedidos</span>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Devoluciones gratis en 30 días</span>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Pago seguro garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../../composables/useCart.js'

const { cartItems, cartItemCount, cartTotal, removeFromCart, updateQuantity } = useCart()

// Methods
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const getProductImage = (item) => {
  if (item.image) return item.image
  if (item.img_prod) {
    // Si ya es una URL completa, devolverla tal cual
    if (item.img_prod.startsWith('http')) {
      return item.img_prod
    }
    // Si es una ruta relativa, agregar el servidor
    return `http://localhost:3000${item.img_prod}`
  }
  return 'https://via.placeholder.com/300x300?text=Producto'
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x300?text=Producto'
}

const getItemPrice = (item) => {
  if (item.price) return item.price
  if (item.precio_descuento > 0) return item.precio_descuento
  return item.precio || 0
}

const handleQuantityChange = (productId, event) => {
  const newQuantity = parseInt(event.target.value)
  if (!isNaN(newQuantity) && newQuantity > 0) {
    updateQuantity(productId, newQuantity)
  }
}
</script>
