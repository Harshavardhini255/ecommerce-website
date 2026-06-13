import api from './api'

const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register/', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/users/login/', credentials)
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/profile/')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile/', userData)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password/', passwordData)
    return response.data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },
}

export default authService
