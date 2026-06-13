import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../store/slices/cartSlice'
import orderService from '../services/orderService'
import paymentService from '../services/paymentService'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ orderData, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setProcessing(true)

    try {
      // Create order
      const order = await orderService.createOrder(orderData)

      // Create payment intent
      const { client_secret } = await paymentService.createPaymentIntent(order.id)

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (error) {
        toast.error(error.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        await paymentService.confirmPayment(paymentIntent.id)
        toast.success('Order placed successfully!')
        onSuccess(order.id)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Payment failed')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, subtotal, loading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    shipping_full_name: '',
    shipping_phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: '',
    billing_same_as_shipping: true,
    payment_method: 'stripe',
    notes: '',
  })

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shipping_full_name: user.full_name || '',
        shipping_phone: user.phone || '',
        shipping_address_line1: user.address_line1 || '',
        shipping_address_line2: user.address_line2 || '',
        shipping_city: user.city || '',
        shipping_state: user.state || '',
        shipping_postal_code: user.postal_code || '',
        shipping_country: user.country || '',
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSuccess = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  if (loading) return <Loading />

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const shippingCost = 10.0
  const tax = subtotal * 0.1
  const total = parseFloat(subtotal) + shippingCost + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="shipping_full_name"
                  value={formData.shipping_full_name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="shipping_phone"
                  value={formData.shipping_phone}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                <input
                  type="text"
                  name="shipping_address_line1"
                  value={formData.shipping_address_line1}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="shipping_address_line2"
                  value={formData.shipping_address_line2}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="shipping_state"
                  value={formData.shipping_state}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  name="shipping_postal_code"
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  name="shipping_country"
                  value={formData.shipping_country}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm orderData={formData} onSuccess={handleSuccess} />
            </Elements>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_details.name} x {item.quantity}
                  </span>
                  <span>${item.total_price}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
