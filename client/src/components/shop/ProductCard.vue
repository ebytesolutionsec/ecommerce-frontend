<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
    <!-- Imagen del Producto -->
    <div class="relative overflow-hidden bg-gray-100 aspect-square">
      <img
        :src="product.image || product.img_prod || 'https://via.placeholder.com/300x300?text=Producto'"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        @error="handleImageError"
      />

      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-2">
        <span
          v-if="product.discount"
          class="px-2 py-1 bg-[#e2312d] text-white text-xs font-bold rounded"
        >
          -{{ product.discount }}%
        </span>
        <span
          v-if="product.isNew"
          class="px-2 py-1 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white text-xs font-bold rounded"
        >
          NUEVO
        </span>
        <span
          v-if="product.destacado"
          class="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded flex items-center"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          DESTACADO
        </span>
      </div>

      <!-- Botón de Acción Rápida -->
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          @click="handleQuickView"
          class="px-6 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition transform scale-90 group-hover:scale-100"
        >
          Ver Detalles
        </button>
      </div>

      <!-- Estado de Stock -->
      <div v-if="!isInStock" class="absolute inset-0 bg-black/60 flex items-center justify-center">
        <span class="px-4 py-2 bg-red-600 text-white font-bold rounded-lg">
          Agotado
        </span>
      </div>
    </div>

    <!-- Información del Producto -->
    <div class="p-4">
      <!-- Nombre del Producto -->
      <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
        {{ product.name }}
      </h3>

      <!-- Descripción Corta (si existe) -->
      <p v-if="product.descripcion_corta" class="text-sm text-gray-500 mb-3 line-clamp-2">
        {{ product.descripcion_corta }}
      </p>

      <!-- Rating -->
      <div v-if="product.rating" class="flex items-center mb-3">
        <div class="flex items-center">
          <svg
            v-for="star in 5"
            :key="star"
            class="w-4 h-4"
            :class="star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span class="ml-2 text-sm text-gray-600">({{ product.rating }})</span>
      </div>

      <!-- Precio -->
      <div class="mb-4">
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-gray-900">
            ${{ formatPrice(currentPrice) }}
          </span>
          <span
            v-if="product.originalPrice || product.precio_descuento > 0"
            class="text-sm text-gray-400 line-through"
          >
            ${{ formatPrice(product.originalPrice || product.precio) }}
          </span>
        </div>
        <span v-if="product.stock && product.stock <= 10" class="text-xs text-orange-600 font-semibold">
          ¡Solo quedan {{ product.stock }} unidades!
        </span>
      </div>

      <!-- Botón Agregar al Carrito -->
      <button
        @click="handleAddToCart"
        :disabled="!isInStock"
        class="w-full py-2.5 rounded-lg font-semibold transition"
        :class="isInStock
          ? 'bg-gradient-to-r from-[#a3195b] to-[#662482] text-white hover:opacity-90'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
      >
        <span v-if="isInStock">Agregar al Carrito</span>
        <span v-else>No Disponible</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart.js'
import { useToast } from '../../composables/useToast.js'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { addToCart } = useCart()
const { success } = useToast()

// Computed
const isInStock = computed(() => {
  if (props.product.inStock !== undefined) {
    return props.product.inStock
  }
  if (props.product.disponible !== undefined) {
    return props.product.disponible && (props.product.stock === undefined || props.product.stock > 0)
  }
  return true
})

const currentPrice = computed(() => {
  if (props.product.price) {
    return props.product.price
  }
  if (props.product.precio_descuento > 0) {
    return props.product.precio_descuento
  }
  return props.product.precio || 0
})

// Methods
const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x300?text=Producto'
}

const handleQuickView = () => {
  // Navegar a la página de detalle del producto
  router.push(`/producto/${props.product._id || props.product.id}`)
}

const handleAddToCart = () => {
  if (!isInStock.value) return

  addToCart(props.product, 1)
  success('Producto agregado', `${props.product.name} se agregó al carrito`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
