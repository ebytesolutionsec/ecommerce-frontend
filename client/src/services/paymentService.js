import { api } from './api.js'

// Servicio para gestión de pagos
export const paymentService = {
  // Crear pago para una orden
  createPayment: async (orderId, paymentData) => {
    return api.post(`/payment/order/${orderId}/pay`, paymentData)
  },

  // Listar todos los pagos (Admin)
  listAll: async (page = 1, limit = 100) => {
    return api.get(`/payment/list/all?page=${page}&limit=${limit}`)
  },

  // Listar pagos del usuario autenticado
  list: async (page = 1, limit = 10) => {
    return api.get(`/payment/list?page=${page}&limit=${limit}`)
  },

  // Obtener detalles de un pago específico
  getById: async (paymentId) => {
    return api.get(`/payment/${paymentId}`)
  },

  // Listar métodos de pago disponibles
  listPaymentMethods: async (page = 1, limit = 100) => {
    return api.get(`/payment/method/list?page=${page}&limit=${limit}`)
  },

  // Obtener método de pago específico
  getPaymentMethodById: async (methodId) => {
    return api.get(`/payment/method/${methodId}`)
  },

  // Crear método de pago (Admin)
  createPaymentMethod: async (methodData) => {
    return api.post('/payment/method/create', methodData)
  },

  // Actualizar método de pago (Admin)
  updatePaymentMethod: async (methodId, methodData) => {
    return api.patch(`/payment/method/${methodId}`, methodData)
  },

  // Eliminar método de pago (Admin)
  deletePaymentMethod: async (methodId) => {
    return api.delete(`/payment/method/${methodId}`)
  },

  // Enviar comprobante de transferencia bancaria (multipart/form-data)
  // formData debe incluir: payment_method, amount, number_comprobante, proof_image (archivo)
  sendComprobante: async (orderId, formData) => {
    return api.postFormData(`/payment/send/comprobante/${orderId}`, formData)
  },

  // Aprobar pago de transferencia bancaria (Admin)
  approvePayment: async (paymentId) => {
    return api.post(`/payment/aproved/${paymentId}`)
  },

  // ============================================
  // PAYPHONE - Pasarela de Pago
  // ============================================

  // Preparar pago con PayPhone (llama al backend que tiene el token)
  preparePayPhonePayment: async (paymentData) => {
    // paymentData debe incluir:
    // - amount: monto total en centavos (ej: $10.00 = 1000)
    // - clientTransactionId: ID único de transacción del comercio
    // - reference: referencia de la transacción
    // - responseUrl: URL de respuesta cuando se complete
    // - cancellationUrl: URL cuando se cancele
    return api.post('/payphone/redirect', paymentData)
  },

  // Confirmar pago con PayPhone (cuando el usuario regresa)
  confirmPayPhonePayment: async (confirmData) => {
    // confirmData debe incluir:
    // - id: ID de transacción de PayPhone (viene en la URL de retorno)
    // - clientTransactionId: ID de transacción del comercio (viene en la URL de retorno)
    return api.post('/payphone/confirm', confirmData)
  },

  // Convertir monto a centavos (PayPhone usa centavos)
  amountToCents: (amount) => {
    return Math.round(amount * 100)
  },

  // Convertir centavos a monto
  centsToAmount: (cents) => {
    return cents / 100
  },
}

export default paymentService
