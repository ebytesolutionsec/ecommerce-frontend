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
}

export default authService
