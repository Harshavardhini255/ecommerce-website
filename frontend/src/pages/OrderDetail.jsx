import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrderDetail } from '../store/slices/orderSlice'
import { FiArrowLeft } from 'react-icons/fi'
import { getImageUrl, formatPrice } from '../utils/imageUtils'

const OrderDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentOrder, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrderDetail(id))
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (error || !currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-400 text-sm mb-4">Order not found.</p>
        <Link to="/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">← Back to orders</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        <FiArrowLeft className="w-4 h-4 mr-1" /> Back to orders
      </Link>

      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-lg font-bold text-gray-900">Order #{currentOrder.id}</h1>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              currentOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
              currentOrder.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
              currentOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {currentOrder.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Placed on {new Date(currentOrder.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Items</h2>
          <div className="space-y-3">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={getImageUrl(item.product_image)} alt={item.product_name} className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between text-sm font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(currentOrder.total_amount)}</span>
          </div>
        </div>

        {/* Address */}
        {currentOrder.address && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentOrder.address.street}<br />
              {currentOrder.address.city}, {currentOrder.address.state} {currentOrder.address.zip}<br />
              {currentOrder.address.country}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
