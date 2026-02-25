<template>
  <div>
    <!-- Secciones del home (hero + carruseles + promo) — se ocultan con fade al filtrar -->
    <Transition name="home-sections">
      <div v-if="!activeCategoryName && !activeSearch">
        <!-- Hero Section / Banner Principal -->
        <section class="bg-gradient-to-r from-[#a3195b] via-[#662482] to-[#e2312d] text-white py-16 relative overflow-hidden">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                Bienvenido a EBYTE
              </h1>
              <p class="text-xl md:text-2xl mb-8 text-white/90">
                Encuentra los mejores productos a los mejores precios
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button class="px-8 py-3 bg-white text-[#a3195b] font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
                  Ver Ofertas
                </button>
                <button class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
                  Explorar Categorías
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Productos Destacados - Carrusel -->
        <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-gray-800">Productos Destacados</h2>
            <div class="flex space-x-2">
              <button
                @click="scrollCarousel('featured', 'left')"
                class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="scrollCarousel('featured', 'right')"
                class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div ref="featuredCarouselRef" class="flex overflow-x-auto space-x-6 pb-4 scroll-smooth hide-scrollbar">
            <ProductCard
              v-for="product in featuredProducts"
              :key="product._id || product.id"
              :product="product"
              class="flex-shrink-0 w-64"
            />
          </div>
        </section>

        <!-- Sección de Promoción -->
        <section class="py-12 bg-gradient-to-r from-[#f8edf2] to-[#f3edf5]">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 class="text-4xl font-black text-gray-800 mb-4">
                  ¡Ofertas Especiales!
                </h2>
                <p class="text-lg text-gray-600 mb-6">
                  Descuentos de hasta 50% en productos seleccionados. ¡No te lo pierdas!
                </p>
                <button class="px-8 py-3 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg">
                  Ver Ofertas
                </button>
              </div>
              <div class="flex justify-center">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-[#a3195b] to-[#662482] opacity-20 rounded-full blur-3xl"></div>
                  <svg class="w-64 h-64 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Nuevos Productos - Carrusel -->
        <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-gray-800">Nuevos Productos</h2>
            <div class="flex space-x-2">
              <button
                @click="scrollCarousel('new', 'left')"
                class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="scrollCarousel('new', 'right')"
                class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div ref="newCarouselRef" class="flex overflow-x-auto space-x-6 pb-4 scroll-smooth hide-scrollbar">
            <ProductCard
              v-for="product in newProducts"
              :key="product._id || product.id"
              :product="product"
              class="flex-shrink-0 w-64"
            />
          </div>
        </section>
      </div>
    </Transition>

    <!-- Todos los Productos - Grid -->
    <section ref="productsSectionRef" class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Encabezado dinámico -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-800">
              {{ activeCategoryName ? activeCategoryName : (activeSearch ? 'Resultados de búsqueda' : 'Todos los Productos') }}
            </h2>
            <p v-if="!loading" class="text-sm text-gray-500 mt-1">
              {{ totalProducts }} producto{{ totalProducts !== 1 ? 's' : '' }} encontrado{{ totalProducts !== 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Badge de filtro activo -->
          <div v-if="activeCategoryName || activeSearch" class="flex items-center gap-2">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#a3195b]/10 to-[#662482]/10 border border-[#a3195b]/30 text-[#a3195b] text-sm font-medium rounded-full">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
              </svg>
              {{ activeCategoryName || activeSearch }}
              <button @click="clearFilter" class="ml-1 hover:text-[#662482] transition">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- Transición entre spinner y contenido (solo 2 estados) -->
        <Transition name="products-fade" mode="out-in">

          <!-- Estado: cargando -->
          <div v-if="loading" key="loading">
            <LoadingSpinner message="Cargando productos..." />
          </div>

          <!-- Estado: contenido (grid o vacío) -->
          <div v-else key="content">
            <!-- Grid de Productos -->
            <div v-if="allProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductCard
                v-for="product in allProducts"
                :key="product._id || product.id"
                :product="product"
              />
            </div>

            <!-- Mensaje si no hay productos -->
            <div v-else class="text-center py-20">
              <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-gray-500 text-lg mb-4">
                {{ activeCategoryName ? `No hay productos en "${activeCategoryName}"` : 'No hay productos disponibles' }}
              </p>
              <button v-if="activeCategoryName || activeSearch" @click="clearFilter" class="px-6 py-2 bg-gradient-to-r from-[#a3195b] to-[#662482] text-white rounded-lg hover:opacity-90 transition text-sm font-medium">
                Ver todos los productos
              </button>
            </div>
          </div>

        </Transition>

        <!-- Paginación -->
        <div v-if="!loading && totalPages > 1" class="mt-8">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total="totalProducts"
            :per-page="perPage"
            @page-change="changePage"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../../components/shop/ProductCard.vue'
import Pagination from '../../components/common/Pagination.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import { productService } from '../../services/productService.js'
import { useToast } from '../../composables/useToast.js'

const route = useRoute()
const router = useRouter()
const { error: showError } = useToast()

// Referencias a los carruseles y sección de productos
const featuredCarouselRef = ref(null)
const newCarouselRef = ref(null)
const productsSectionRef = ref(null)

// Filtros activos
const activeCategoryName = computed(() => route.query.cn || '')
const activeSearch = computed(() => route.query.search || '')

// Estado (iniciar en true para evitar flash de "sin productos" antes del primer fetch)
const loading = ref(true)
const currentPage = ref(1)
const perPage = ref(12)
const totalProducts = ref(0)
const totalPages = computed(() => Math.ceil(totalProducts.value / perPage.value))

// Limpiar filtro activo y volver a todos los productos
const clearFilter = () => {
  router.push({ name: 'home' })
}

// Scroll a la sección de productos
const scrollToProducts = () => {
  nextTick(() => {
    productsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Productos desde el backend
const featuredProducts = ref([])
const newProducts = ref([])
const allProducts = ref([])

// Función helper para procesar productos
const processProduct = (product) => {
  // El backend guarda: /uploads/productos/imagen.jpg
  // Pero sirve con: app.use('/uploads/productos', express.static('uploads'))
  // Entonces necesitamos duplicar 'productos' en la URL
  let imageUrl = product.img_prod

  if (imageUrl && !imageUrl.startsWith('http')) {
    // Si es /uploads/productos/imagen.jpg, cambiar a /uploads/productos/productos/imagen.jpg
    imageUrl = imageUrl.replace('/uploads/productos/', '/uploads/productos/productos/')
    imageUrl = `http://localhost:3000${imageUrl}`
  }

  return {
    ...product,
    discount: product.precio_descuento > 0
      ? Math.round(((product.precio - product.precio_descuento) / product.precio) * 100)
      : 0,
    img_prod: imageUrl
  }
}

// Función para hacer scroll en los carruseles
const scrollCarousel = (carousel, direction) => {
  const ref = carousel === 'featured' ? featuredCarouselRef.value : newCarouselRef.value
  if (ref) {
    const scrollAmount = 280
    const scrollDirection = direction === 'left' ? -scrollAmount : scrollAmount
    ref.scrollBy({ left: scrollDirection, behavior: 'smooth' })
  }
}

// Cambiar página
const changePage = async (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await loadAllProducts()
}

// Cargar productos destacados
const loadFeaturedProducts = async () => {
  try {
    const response = await productService.listPublic(1, 10, {
      destacado: true,
      disponible: true,
      estado: true
    })

    if (response.data && response.data.length > 0) {
      featuredProducts.value = response.data.map(processProduct)
    }
  } catch (err) {
    console.error('Error al cargar productos destacados:', err)
  }
}

// Cargar productos recientes (nuevos)
const loadNewProducts = async () => {
  try {
    const response = await productService.listPublic(1, 10, {
      disponible: true,
      estado: true
    })

    if (response.data && response.data.length > 0) {
      newProducts.value = response.data.slice(0, 10).map(product => ({
        ...processProduct(product),
        isNew: true
      }))
    }
  } catch (err) {
    console.error('Error al cargar productos nuevos:', err)
  }
}

// Cargar todos los productos con paginación y filtros
const loadAllProducts = async () => {
  loading.value = true
  try {
    const searchQuery = route.query.search
    const categoryId = route.query.category

    let response

    // Si hay búsqueda, usar el endpoint de search
    if (searchQuery) {
      response = await productService.search(searchQuery, currentPage.value, perPage.value)
    }
    // Si hay categoría, filtrar por categoría
    else if (categoryId) {
      response = await productService.listPublic(currentPage.value, perPage.value, {
        categoria: categoryId,
        disponible: true,
        estado: true
      })
    }
    // Por defecto, cargar todos los productos disponibles
    else {
      response = await productService.listPublic(currentPage.value, perPage.value, {
        disponible: true,
        estado: true
      })
    }

    if (response.data) {
      allProducts.value = response.data.map(processProduct)
      totalProducts.value = response.total || 0
    }
  } catch (err) {
    console.error('Error al cargar productos:', err)
    showError('Error', 'No se pudieron cargar los productos. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

// Watch para cambios en la ruta (búsqueda o categoría)
watch(
  [() => route.query.search, () => route.query.category],
  ([newSearch, newCategory]) => {
    currentPage.value = 1
    loadAllProducts()
    if (newSearch || newCategory) scrollToProducts()
  }
)

// Cargar todos los datos al montar el componente
onMounted(async () => {
  await Promise.all([
    loadFeaturedProducts(),
    loadNewProducts(),
    loadAllProducts()
  ])
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Transición del bloque hero + carruseles + promo */
.home-sections-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.home-sections-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.home-sections-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.home-sections-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Transición del contenido de la grilla de productos */
.products-fade-enter-active,
.products-fade-leave-active {
  transition: opacity 0.3s ease;
}
.products-fade-enter-from,
.products-fade-leave-to {
  opacity: 0;
}
</style>
