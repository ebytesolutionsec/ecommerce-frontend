// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api/v1'

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }))
    throw new Error(error.message || 'Error en la petición')
  }
  return response.json()
}

// Métodos HTTP genéricos
export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    return handleResponse(response)
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },
}

export default api
