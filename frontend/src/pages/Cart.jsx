import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, subtotal, total, loading } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateCartItem({ itemId, quantity: newQuantity }))
      .unwrap()
      .catch((error) => {
        toast.error(error?.error || 'Failed to update quantity')
      })
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => {
        toast.success('Item removed from cart')
      })
      .catch((error) => {
        toast.error(error?.error || 'Failed to remove item')
      })
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (loading) return <Loading />

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-4">Please login to view your cart</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card flex items-center space-x-4">
                <img
                  src={item.product_details.primary_image?.image || '/placeholder.jpg'}
                  alt={item.product_details.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product_details.slug}`}
                    className="text-lg font-semibold hover:text-primary-600"
                  >
                    {item.product_details.name}
                  </Link>
                  <p className="text-gray-600">${item.product_details.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 border rounded-lg hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 border rounded-lg hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="text-lg font-semibold">${item.total_price}</div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">$10.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${(parseFloat(total) + 10 + subtotal * 0.1).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary w-full">
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-secondary w-full mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
