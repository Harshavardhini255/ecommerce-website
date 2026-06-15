import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createOrder } from '../store/slices/orderSlice'
import { getImageUrl, formatPrice } from '../utils/imageUtils'
import { toast } from 'react-toastify'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.orders)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [deliverySpeed, setDeliverySpeed] = useState('standard')
  const [address, setAddress] = useState({
    shipping_full_name: '',
    shipping_phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'India',
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (items.length === 0 && isAuthenticated) navigate('/cart')
  }, [items, isAuthenticated, navigate])

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const subtotal = useMemo(() =>
    items.reduce((sum, item) => {
      const p = item.product_details || item.product
      return sum + (parseFloat(p.price) || 0) * item.quantity
    }, 0),
  [items])

  const deliveryOptions = {
    standard: { label: 'Standard Delivery', fee: subtotal >= 499 ? 0 : 49, days: '5-7 business days' },
    express: { label: 'Express Delivery', fee: 99, days: '2-3 business days' },
  }

  const delivery = deliveryOptions[deliverySpeed]
  const total = subtotal + delivery.fee

  const estimatedDates = useMemo(() => {
    const now = new Date()
    const addDays = (d) => { const r = new Date(now); r.setDate(r.getDate() + d); return r }
    const min = deliverySpeed === 'express' ? addDays(2) : addDays(5)
    const max = deliverySpeed === 'express' ? addDays(3) : addDays(7)
    return {
      min: min.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      max: max.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }
  }, [deliverySpeed])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const required = ['shipping_full_name', 'shipping_phone', 'shipping_address_line1', 'shipping_city', 'shipping_state', 'shipping_postal_code']
    const missing = required.filter((f) => !address[f].trim())
    if (missing.length > 0) {
      toast.error('Please fill in all required address fields')
      return
    }

    try {
      const order = await dispatch(createOrder({
        ...address,
        billing_same_as_shipping: true,
        payment_method: paymentMethod === 'cash' ? 'cash' : 'stripe',
        notes: `Delivery: ${deliverySpeed}`,
      })).unwrap()
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to place order')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="space-y-6">
        {/* Items Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Items ({items.length})</h2>
          <div className="space-y-3">
            {items.map((item) => {
              const p = item.product_details || item.product
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(p.primary_image?.image)} alt={p.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-2">{formatPrice(p.price * item.quantity)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Delivery</h2>
          <div className="space-y-2">
            {Object.entries(deliveryOptions).map(([key, opt]) => (
              <label key={key} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${deliverySpeed === key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="delivery" value={key} checked={deliverySpeed === key} onChange={() => setDeliverySpeed(key)} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${deliverySpeed === key ? 'border-primary-600' : 'border-gray-300'}`}>
                  {deliverySpeed === key && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">Estimated delivery: {estimatedDates.min} – {estimatedDates.max}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{opt.fee === 0 ? 'FREE' : formatPrice(opt.fee)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h2>
          <div className="space-y-2">
            <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="sr-only" />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary-600' : 'border-gray-300'}`}>
                {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-primary-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
            </label>
            <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-600' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-primary-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
                <p className="text-xs text-gray-500">Pay via Stripe (requires setup)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Shipping Address */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="shipping_full_name" value={address.shipping_full_name} onChange={handleChange} className="input" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" name="shipping_phone" value={address.shipping_phone} onChange={handleChange} className="input" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input type="text" name="shipping_address_line1" value={address.shipping_address_line1} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input type="text" name="shipping_address_line2" value={address.shipping_address_line2} onChange={handleChange} className="input" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="shipping_city" value={address.shipping_city} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input type="text" name="shipping_state" value={address.shipping_state} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
              <input type="text" name="shipping_postal_code" value={address.shipping_postal_code} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" name="shipping_country" value={address.shipping_country} onChange={handleChange} className="input bg-gray-50" readOnly />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery ({delivery.label})</span>
              <span>{delivery.fee === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(delivery.fee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(total)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
            {loading ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
          </button>
          {paymentMethod === 'cash' && (
            <p className="text-center text-xs text-gray-400">Pay when your order is delivered</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Checkout
