import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '', username: '', first_name: '', last_name: '', password: '', password2: '',
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      if (typeof error === 'object') {
        Object.keys(error).forEach((key) => {
          const msg = Array.isArray(error[key]) ? error[key][0] : error[key]
          toast.error(`${key}: ${msg}`)
        })
      } else toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match')
      return
    }
    dispatch(register(formData))
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
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join Dharshaa today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" name="password2" required value={formData.password2} onChange={handleChange} className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
