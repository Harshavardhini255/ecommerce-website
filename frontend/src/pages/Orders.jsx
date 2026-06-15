import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyOrders } from '../store/slices/orderSlice'
import { FiPackage } from 'react-icons/fi'
import { formatPrice } from '../utils/imageUtils'
import { toast } from 'react-toastify'

const Orders = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.orders)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyOrders())
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    if (error) toast.error(typeof error === 'string' ? error : 'Failed to load orders')
  }, [error])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
          <p className="text-sm text-gray-500 mb-6">Please sign in to see your orders.</p>
          <Link to="/login" className="btn btn-primary px-8 py-3">Sign in</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary px-8 py-3">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders ({items.length})</h1>
      <div className="space-y-3">
        {items.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{order.items?.length || 0} item(s)</span>
              <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Orders
