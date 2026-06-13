import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import orderService from '../services/orderService'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id)
        setOrder(data)
      } catch (error) {
        toast.error('Failed to fetch order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id)
        toast.success('Order cancelled successfully')
        const data = await orderService.getOrder(id)
        setOrder(data)
      } catch (error) {
        toast.error('Failed to cancel order')
      }
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <Loading />
  if (!order) return <div className="container mx-auto px-4 py-8">Order not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-600 hover:text-primary-700">
          ← Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order #{order.order_number}</h1>
                <p className="text-gray-600">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getStatusColor(order.status)
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Cancel Order
              </button>
            )}
          </div>

          {/* Items */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.total_price}</p>
                    <p className="text-sm text-gray-600">${item.product_price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-semibold">{order.shipping_full_name}</p>
              <p>{order.shipping_phone}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>
                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          {/* Tracking */}
          {order.tracking_number && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Carrier:</span> {order.carrier}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Tracking Number:</span> {order.tracking_number}
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${order.shipping_cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-${order.discount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${order.total}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Payment Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
