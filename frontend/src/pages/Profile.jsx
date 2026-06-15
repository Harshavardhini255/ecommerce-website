import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../store/slices/orderSlice'
import { FiUser, FiPackage, FiMail, FiCalendar } from 'react-icons/fi'
import { formatPrice } from '../utils/imageUtils'

const Profile = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.orders)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyOrders())
  }, [isAuthenticated, dispatch])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view profile</h2>
          <p className="text-sm text-gray-500 mb-6">Please sign in to see your profile.</p>
          <Link to="/login" className="btn btn-primary px-8 py-3">Sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="space-y-4">
        {/* Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-600">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <FiMail className="w-4 h-4 mr-2 text-gray-400" />
              {user?.email}
            </div>
            <div className="flex items-center text-gray-600">
              <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
              Joined {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-xs font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.slice(0, 3).map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
