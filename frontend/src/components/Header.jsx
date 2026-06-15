import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSearch } from 'react-icons/fi'
import { logout } from '../store/slices/authSlice'
import { useEffect } from 'react'
import { fetchCart } from '../store/slices/cartSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#e60023"/>
              <path d="M11 10h5a6 6 0 0 1 0 16h-5V10z" fill="white"/>
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">Dharshaa</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </form>

          {/* Right */}
          <div className="flex items-center space-x-3">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-1">
                <Link to="/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                  <FiPackage className="w-5 h-5 text-gray-700" />
                </Link>
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FiUser className="w-5 h-5 text-gray-700" />
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                  <FiLogOut className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
