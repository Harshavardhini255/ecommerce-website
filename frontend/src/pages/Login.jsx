import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Login failed')
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#e60023"/>
              <path d="M11 10h5a6 6 0 0 1 0 16h-5V10z" fill="white"/>
            </svg>
            <span className="text-xl font-bold text-gray-900">Dharshaa</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
