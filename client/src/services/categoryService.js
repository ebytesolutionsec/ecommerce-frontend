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

  // ========== ENDPOINTS PÚBLICOS (intento sin autenticación) ==========

  // Listar categorías públicamente (para la tienda)
  // Nota: El backend aún requiere token, pero intentamos sin él primero
  listPublic: async () => {
    try {
      // Intentar obtener categorías sin autenticación
      return await api.getPublic('/categoria/list?limit=100')
    } catch (error) {
      // Si falla, retornar array vacío o usar categorías mock
      console.warn('No se pudieron cargar categorías desde el backend:', error)
      return { data: [] }
    }
  },
}

export default categoryService
