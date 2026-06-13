import api from './api'

const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders/')
    return response.data
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}/`)
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders/', orderData)
    return response.data
  },

  cancelOrder: async (id, notes = '') => {
    const response = await api.post(`/orders/${id}/cancel/`, { notes })
    return response.data
  },
}

export default orderService
