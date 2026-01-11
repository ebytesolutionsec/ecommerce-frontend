import { api } from './api.js'

// Servicio para gestión de productos
export const productService = {
  // ========== ENDPOINTS PRIVADOS (requieren autenticación) ==========

  // Listar productos con paginación (Admin)
  list: async (page = 1, limit = 10) => {
    return api.get(`/producto/list?page=${page}&limit=${limit}`)
  },

  // Crear nuevo producto con FormData (incluye archivo de imagen)
  create: async (productData, imageFile) => {
    const formData = new FormData()

    // Agregar campos del producto
    formData.append('name', productData.name)
    formData.append('sku', productData.sku)
    formData.append('descripcion', productData.descripcion)
    formData.append('descripcion_corta', productData.descripcion_corta)
    formData.append('categoria', productData.categoria)
    formData.append('precio', productData.precio)
    formData.append('precio_descuento', productData.precio_descuento || 0)
    formData.append('stock', productData.stock)
    formData.append('disponible', productData.disponible)
    formData.append('rating', productData.rating || 0)
    formData.append('destacado', productData.destacado)
    formData.append('estado', productData.estado)

    // Agregar archivo de imagen
    if (imageFile) {
      formData.append('img_prod', imageFile)
    }

    return api.postFormData('/producto/create', formData)
  },

  // Verificar si existe un SKU
  checkSkuExists: async (sku) => {
    try {
      const response = await api.get(`/producto/list?sku=${sku}`)
      return response.data && response.data.length > 0
    } catch (error) {
      return false
    }
  },

  // Obtener productos por prefijo SKU (para generar siguiente número)
  getBySkuPrefix: async (prefix) => {
    try {
      const response = await api.get(`/producto/list?limit=1000`)
      const products = response.data || []

      // Filtrar productos que empiecen con el prefijo
      return products.filter(p => p.sku && p.sku.startsWith(prefix))
    } catch (error) {
      console.error('Error al obtener productos por prefijo:', error)
      return []
    }
  },

  // ========== ENDPOINTS PÚBLICOS (no requieren autenticación) ==========

  // Listar productos públicamente (para la tienda)
  listPublic: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })

    return api.getPublic(`/producto/list/public?${queryParams.toString()}`)
  },

  // Obtener detalles de un producto específico
  getById: async (id) => {
    return api.getPublic(`/producto/info/public/${id}`)
  },

  // Buscar productos por nombre o categoría
  search: async (query, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    })

    return api.getPublic(`/producto/search/public?${queryParams.toString()}`)
  },
}

export default productService
