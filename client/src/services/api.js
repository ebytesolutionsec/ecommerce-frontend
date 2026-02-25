// Configuración base de la API
//const API_BASE_URL = 'https://rzflw305-3000.use2.devtunnels.ms/api/v1'
const API_BASE_URL = 'http://localhost:3000/api/v1'

// Obtener token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// Obtener headers con autenticación
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  // Si el token es inválido o expiró, redirigir al login
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/login'
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error en la petición' }))
    // El backend puede enviar el error en 'message' o en 'error'
    const errorMessage = errorData.error || errorData.message || 'Error en la petición'
    throw new Error(errorMessage)
  }
  return response.json()
}

// Métodos HTTP genéricos
export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    })
    return handleResponse(response)
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },

  // Método especial para enviar FormData (archivos)
  postFormData: async (endpoint, formData) => {
    const token = getAuthToken()
    const headers = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // No establecer Content-Type, el navegador lo hará automáticamente con el boundary correcto
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    })
    return handleResponse(response)
  },

  // Método público (sin autenticación) para endpoints públicos GET
  getPublic: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Para endpoints públicos, no redirigir al login en caso de error
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error en la petición' }))
      throw new Error(error.message || 'Error en la petición')
    }

    return response.json()
  },

  // Método público (sin autenticación) para endpoints públicos POST
  postPublic: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    // Para endpoints públicos, no redirigir al login en caso de error
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error en la petición' }))
      throw new Error(error.message || 'Error en la petición')
    }

    return response.json()
  },
}

export default api
