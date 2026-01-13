import { api } from './api.js'

// Servicio para gestión de categorías
export const categoryService = {
  // ========== ENDPOINTS PRIVADOS (requieren autenticación) ==========

  // Listar categorías con paginación (Admin)
  list: async (page = 1, limit = 10) => {
    return api.get(`/categoria/list?page=${page}&limit=${limit}`)
  },

  // Crear nueva categoría
  // Nota: El backend createCategoria busca 'nombre' en lugar de 'name' (inconsistencia)
  // Debemos enviar 'nombre' para validación, pero 'name' para el modelo
  create: async (categoryData) => {
    // Enviar ambos campos para compatibilidad con la validación y el modelo
    const dataToSend = {
      nombre: categoryData.name,  // Para la validación en el controller
      name: categoryData.name,     // Para el modelo Schema
      descripcion: categoryData.descripcion
    }
    return api.post('/categoria/create', dataToSend)
  },

  // Actualizar categoría
  update: async (id, categoryData) => {
    return api.patch(`/categoria/edit/${id}`, categoryData)
  },

  // Eliminar categoría
  delete: async (id) => {
    return api.delete(`/categoria/delete/${id}`)
  },

  // ========== ENDPOINTS PÚBLICOS (sin autenticación) ==========

  // Listar categorías públicamente (para la tienda)
  listPublic: async () => {
    try {
      return await api.getPublic('/categoria/list/public?limit=100')
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      return { data: [] }
    }
  },
}

export default categoryService
