import api from './api'

const paymentService = {
  createPaymentIntent: async (orderId) => {
    const response = await api.post('/payments/create_payment_intent/', {
      order_id: orderId,
    })
    return response.data
  },

  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm_payment/', {
      payment_intent_id: paymentIntentId,
    })
    return response.data
  },
}

export default paymentService
