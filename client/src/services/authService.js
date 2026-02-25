import { api } from './api.js'
import { jwtDecode } from 'jwt-decode'

// Servicio de autenticación
export const authService = {
  // Login - obtener token
  login: async (email, password) => {
    const response = await api.post('/login', { email, password })
    return response
  },

  // Registro de usuario comprador (público)
  register: async (userData) => {
    const response = await api.postPublic('/usuario/create/comprador', {
      dni: userData.dni,
      fullName: userData.fullName,
      email: userData.email,
      direccion: userData.direccion,
      phone: userData.phone,
      password: userData.password
    })
    return response
  },

  // Guardar token en localStorage
  setToken: (token) => {
    localStorage.setItem('auth_token', token)
  },

  // Obtener token de localStorage
  getToken: () => {
    return localStorage.getItem('auth_token')
  },

  // Remover token de localStorage
  removeToken: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('current_user')
  },

  // Guardar datos del usuario en localStorage
  saveCurrentUser: (data) => {
    const user = data?.user || data?.usuario || data?.data || data || {}
    const fullName = user.fullName || user.nombreCompleto || user.nombre || user.name || ''
    const email = user.email || user.correo || ''
    if (fullName) {
      localStorage.setItem('current_user', JSON.stringify({ fullName, email }))
    }
  },

  // Verificar si el token es válido (existe y no ha expirado)
  isTokenValid: () => {
    const token = authService.getToken()

    if (!token) {
      return false
    }

    try {
      // Decodificar el token para verificar expiración
      const decoded = jwtDecode(token)

      // Verificar si el token ha expirado
      // exp viene en segundos, Date.now() en milisegundos
      if (decoded.exp * 1000 < Date.now()) {
        // Token expirado, limpiarlo
        authService.removeToken()
        return false
      }

      return true
    } catch (error) {
      // Token inválido o corrupto
      console.error('Error al validar token:', error)
      authService.removeToken()
      return false
    }
  },

  // Verificar si hay un token válido
  isAuthenticated: () => {
    return authService.isTokenValid()
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    const token = authService.getToken()
    if (!token) return null
    try {
      // 1. Leer nombre guardado en localStorage (fuente más confiable)
      const saved = localStorage.getItem('current_user')
      const savedUser = saved ? JSON.parse(saved) : {}

      // 2. Leer campos del token como respaldo
      const decoded = jwtDecode(token)
      const fullName = savedUser.fullName || decoded.fullName || decoded.nombreCompleto || decoded.nombre || decoded.name || ''
      const email = savedUser.email || decoded.email || decoded.correo || ''
      const role = decoded.rol || decoded.role || ''
      const firstName = fullName.trim().split(' ')[0] || email.split('@')[0] || ''

      return { fullName, email, role, firstName }
    } catch {
      return null
    }
  },
}

export default authService
