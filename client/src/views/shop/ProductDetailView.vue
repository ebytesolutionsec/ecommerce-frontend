<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3195b]"></div>
        <span class="ml-3 text-gray-600">Cargando producto...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Producto no encontrado</h2>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <router-link
          to="/"
          class="inline-block px-6 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          Volver a la tienda
        </router-link>
      </div>

      <!-- Producto -->
      <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Breadcrumb -->
        <div class="px-6 py-4 border-b border-gray-200">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2 text-sm">
              <li>
                <router-link to="/" class="text-gray-500 hover:text-[#a3195b] transition">
                  Inicio
                </router-link>
              </li>
              <li>
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </li>
              <li>
                <span class="text-gray-700 font-medium">{{ product.name }}</span>
              </li>
            </ol>
          </nav>
        </div>

        <!-- Contenido Principal -->
        <div class="grid md:grid-cols-2 gap-8 p-6">
          <!-- Galería de Imágenes -->
          <div class="space-y-4">
            <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                :src="getProductImage(product)"
                :alt="product.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />

              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span
                  v-if="productDiscount > 0"
                  class="px-3 py-1 bg-[#e2312d] text-white text-sm font-bold rounded"
                >
                  -{{ productDiscount }}%
                </span>
                <span
                  v-if="product.destacado"
                  class="px-3 py-1 bg-yellow-500 text-white text-sm font-bold rounded flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  DESTACADO
                </span>
              </div>

              <!-- Estado de Stock -->
              <div v-if="!isInStock" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span class="px-6 py-3 bg-red-600 text-white font-bold rounded-lg text-lg">
                  Agotado
                </span>
              </div>
            </div>
          </div>

          <!-- Información del Producto -->
          <div class="space-y-6">
            <!-- Título -->
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
              <p v-if="product.sku" class="text-sm text-gray-500">SKU: {{ product.sku }}</p>
            </div>

            <!-- Precio -->
            <div class="border-t border-b border-gray-200 py-4">
              <div class="flex items-baseline gap-3">
                <span class="text-4xl font-bold text-gray-900">
                  ${{ formatPrice(currentPrice) }}
                </span>
                <span
                  v-if="product.precio_descuento > 0"
                  class="text-xl text-gray-400 line-through"
                >
                  ${{ formatPrice(product.precio) }}
                </span>
              </div>
              <p v-if="productDiscount > 0" class="text-green-600 font-semibold mt-2">
                ¡Ahorra ${{ formatPrice(product.precio - product.precio_descuento) }}!
              </p>
            </div>

            <!-- Stock -->
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-700">Disponibilidad:</span>
                <span
                  v-if="isInStock"
                  class="text-sm font-semibold text-green-600"
                >
                  En stock
                </span>
                <span v-else class="text-sm font-semibold text-red-600">
                  Agotado
                </span>
              </div>
              <p v-if="isInStock && product.stock && product.stock <= 10" class="text-sm text-orange-600 font-semibold mt-1">
                ¡Solo quedan {{ product.stock }} unidades!
              </p>
            </div>

            <!-- Descripción Corta -->
            <div v-if="product.descripcion_corta">
              <p class="text-gray-600 leading-relaxed">{{ product.descripcion_corta }}</p>
            </div>

            <!-- Cantidad y Agregar al Carrito -->
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700">Cantidad:</label>
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button
                    @click="decreaseQuantity"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    :disabled="quantity <= 1"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    v-model.number="quantity"
                    class="w-20 text-center border-x border-gray-300 py-2 focus:outline-none"
                    min="1"
                    :max="product.stock || 999"
                  />
                  <button
                    @click="increaseQuantity"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    :disabled="product.stock && quantity >= product.stock"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                @click="handleAddToCart"
                :disabled="!isInStock"
                class="w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
                :class="isInStock
                  ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span v-if="isInStock">Agregar al Carrito</span>
                <span v-else>No Disponible</span>
              </button>
            </div>

            <!-- Información Adicional -->
            <div class="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Envío gratis en todos los pedidos</span>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Devoluciones gratis en 30 días</span>
              </div>
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700">Garantía de satisfacción</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Descripción Completa -->
        <div v-if="product.descripcion" class="border-t border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Descripción del Producto</h2>
          <div class="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {{ product.descripcion }}
          </div>
        </div>

        <!-- Especificaciones -->
        <div v-if="hasSpecifications" class="border-t border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Especificaciones</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div v-if="product.categoria_nombre" class="flex justify-between py-2 border-b border-gray-200">
              <span class="font-medium text-gray-700">Categoría:</span>
              <span class="text-gray-600">{{ product.categoria_nombre }}</span>
            </div>
            <div v-if="product.sku" class="flex justify-between py-2 border-b border-gray-200">
              <span class="font-medium text-gray-700">SKU:</span>
              <span class="text-gray-600">{{ product.sku }}</span>
            </div>
            <div v-if="product.stock" class="flex justify-between py-2 border-b border-gray-200">
              <span class="font-medium text-gray-700">Stock disponible:</span>
              <span class="text-gray-600">{{ product.stock }} unidades</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart.js'
import { useToast } from '../../composables/useToast.js'
import { productService } from '../../services/productService.js'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()
const { success, error: showError } = useToast()

// Estado
const loading = ref(true)
const error = ref(null)
const product = ref(null)
const quantity = ref(1)

// Computed
const isInStock = computed(() => {
  if (!product.value) return false
  if (product.value.disponible !== undefined) {
    return product.value.disponible && (product.value.stock === undefined || product.value.stock > 0)
  }
  return true
})

const currentPrice = computed(() => {
  if (!product.value) return 0
  if (product.value.precio_descuento > 0) {
    return product.value.precio_descuento
  }
  return product.value.precio || 0
})

const productDiscount = computed(() => {
  if (!product.value || !product.value.precio_descuento || product.value.precio_descuento <= 0) {
    return 0
  }
  return Math.round(((product.value.precio - product.value.precio_descuento) / product.value.precio) * 100)
})

const hasSpecifications = computed(() => {
  if (!product.value) return false
  return product.value.categoria_nombre || product.value.sku || product.value.stock
})

// Methods
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const getProductImage = (prod) => {
  if (prod.image) return prod.image
  if (prod.img_prod) {
    if (prod.img_prod.startsWith('http')) {
      return prod.img_prod
    }
    return `http://localhost:3000${prod.img_prod}`
  }
  return 'https://via.placeholder.com/600x600?text=Producto'
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/600x600?text=Producto'
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (!product.value.stock || quantity.value < product.value.stock) {
    quantity.value++
  }
}

const handleAddToCart = () => {
  if (!isInStock.value) return

  addToCart(product.value, quantity.value)
  success('Producto agregado', `${product.value.name} (x${quantity.value}) se agregó al carrito`)

  // Preguntar si quiere ir al carrito o seguir comprando
  setTimeout(() => {
    const goToCart = confirm('¿Deseas ir al carrito o seguir comprando?')
    if (goToCart) {
      router.push('/carrito')
    }
  }, 500)
}

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const productId = route.params.id
    const response = await productService.getById(productId)

    if (response.data) {
      // Procesar la imagen del producto
      let imageUrl = response.data.img_prod
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = imageUrl.replace('/uploads/productos/', '/uploads/productos/productos/')
        imageUrl = `http://localhost:3000${imageUrl}`
      }

      product.value = {
        ...response.data,
        img_prod: imageUrl
      }
    } else {
      error.value = 'No se pudo cargar el producto'
    }
  } catch (err) {
    console.error('Error al cargar producto:', err)
    error.value = err.message || 'Error al cargar el producto'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>
