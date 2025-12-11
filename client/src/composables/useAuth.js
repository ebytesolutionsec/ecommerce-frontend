import { ref } from 'vue'

const isAuthenticated = ref(false)

export const useAuth = () => {
  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }

  const checkAuth = () => {
    const authStatus = localStorage.getItem('isAuthenticated')
    isAuthenticated.value = authStatus === 'true'
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
