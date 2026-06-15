import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { getImageUrl, formatPrice } from '../utils/imageUtils'
import { toast } from 'react-toastify'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, subtotal, totalItems, loading } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart())
  }, [isAuthenticated, dispatch])

  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty < 1) {
      dispatch(removeFromCart(item.id))
        .unwrap()
        .then(() => toast.success('Removed from cart'))
        .catch(() => toast.error('Failed to remove'))
      return
    }
    dispatch(updateCartItem({ itemId: item.id, quantity: newQty }))
      .unwrap()
      .catch(() => toast.error('Failed to update quantity'))
  }

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => toast.success('Removed from cart'))
      .catch(() => toast.error('Failed to remove'))
  }

  const shipping = subtotal >= 499 ? 0 : 49
  const grandTotal = subtotal + shipping

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view cart</h2>
          <p className="text-sm text-gray-500 mb-6">Please sign in to see your items.</p>
          <Link to="/login" className="btn btn-primary px-8 py-3">Sign in</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
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
          <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary px-8 py-3">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Shopping Cart ({totalItems})</h1>
      <div className="space-y-3">
        {items.map((item) => {
          const p = item.product_details || item.product
          return (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
            <Link to={`/products/${p.slug}`} className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
              <img src={getImageUrl(p.primary_image?.image)} alt={p.name} onError={(e) => { e.target.src = '/placeholder.svg' }} className="w-full h-full object-contain p-2" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${p.slug}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1">{p.name}</Link>
              <p className="text-xs text-gray-400 mt-0.5">{p.category_name}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(p.price)}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-gray-200 rounded-full">
                  <button onClick={() => handleQtyChange(item, -1)} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
                    <FiMinus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item, 1)} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
                    <FiPlus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="p-1.5 hover:bg-red-50 rounded-full transition-colors">
                  <FiTrash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({totalItems} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="text-[11px] text-gray-400">Free shipping on orders above ₹499</p>
          )}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">Grand Total</span>
          <span className="text-lg font-bold text-primary-600">{formatPrice(grandTotal)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary w-full text-center py-3 mt-5">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
