import { api } from './api.js'

// Servicio para gestión de órdenes
export const orderService = {
  // Crear una nueva orden
  create: async (items, shippingAddress = null) => {
    const payload = { items }
    if (shippingAddress) {
      payload.shipping_address = shippingAddress
    }
    return api.post('/orders/create', payload)
  },

  // Listar todas las órdenes (Admin)
  listAll: async (page = 1, limit = 100) => {
    return api.get(`/orders/list?page=${page}&limit=${limit}`)
  },

  // Listar órdenes del usuario autenticado
  list: async (page = 1, limit = 10) => {
    return api.get(`/orders/list?page=${page}&limit=${limit}`)
  },

  // Obtener detalles de una orden específica
  getById: async (orderId) => {
    return api.get(`/orders/${orderId}`)
  },

  // Actualizar estado de una orden (Admin)
  updateStatus: async (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status })
  },

  // Cancelar orden
  cancel: async (orderId) => {
    return api.delete(`/orders/${orderId}`)
  },
}

export default orderService
