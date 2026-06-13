import api from './api'

const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products/', { params })
    return response.data
  },

  getProduct: async (slug) => {
    const response = await api.get(`/products/${slug}/`)
    return response.data
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured/')
    return response.data
  },

  searchProducts: async (query) => {
    const response = await api.get('/products/search/', { params: { q: query } })
    return response.data
  },

  getCategories: async () => {
    const response = await api.get('/products/categories/')
    return response.data
  },

  getReviews: async (productId) => {
    const response = await api.get('/products/reviews/', { params: { product: productId } })
    return response.data
  },

  createReview: async (reviewData) => {
    const response = await api.post('/products/reviews/', reviewData)
    return response.data
  },
}

export default productService
