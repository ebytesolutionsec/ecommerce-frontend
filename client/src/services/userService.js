import { api } from './api.js'

// Servicio para gestión de usuarios
export const userService = {
  // Listar usuarios con paginación
  list: async (page = 1, limit = 10) => {
    return api.get(`/usuario/list?page=${page}&limit=${limit}`)
  },

  // Crear nuevo usuario
  create: async (userData) => {
    return api.post('/usuario/create', userData)
  },

  // Actualizar usuario
  update: async (id, userData) => {
    return api.patch(`/usuario/edit/${id}`, userData)
  },

  // Eliminar usuario
  delete: async (id) => {
    return api.delete(`/usuario/delete/${id}`)
  },

  // Obtener información de un usuario
  getById: async (id) => {
    return api.get(`/usuario/info/${id}`)
  },
}

export default userService
