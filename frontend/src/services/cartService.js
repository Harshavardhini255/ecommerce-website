import api from './api'

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart/')
    return response.data
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add_item/', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/update-item/${itemId}/`, {
      quantity,
    })
    return response.data
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove-item/${itemId}/`)
    return response.data
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear/')
    return response.data
  },
}

export default cartService
