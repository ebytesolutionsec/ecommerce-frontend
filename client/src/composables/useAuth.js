import { ref } from 'vue'

const isAuthenticated = ref(false)

export const useAuth = () => {
  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
  }

  const logout = () => {
    isAuthenticated.value = false
    // Remover token y estado de autenticación
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('auth_token')
  }

  const checkAuth = () => {
    // Verificar si existe el token y el estado de autenticación
    const authStatus = localStorage.getItem('isAuthenticated')
    const token = localStorage.getItem('auth_token')
    isAuthenticated.value = authStatus === 'true' && !!token
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
