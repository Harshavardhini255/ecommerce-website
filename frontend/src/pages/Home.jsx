import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedProducts, fetchCategories } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const dispatch = useDispatch()
  const { featuredProducts, categories } = useSelector((state) => state.products)

  const womenCategories = categories

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              New Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Fashion for <span className="text-primary-600">every moment</span>
            </h1>
            <p className="text-base text-gray-500 mb-8 max-w-md mx-auto">
              Discover the latest trends in women's fashion, beauty, and accessories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/products" className="btn btn-primary px-8 py-3">
                Shop Now
              </Link>
              <Link to="/products" className="btn btn-secondary px-8 py-3">
                Explore Fashion
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {womenCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {womenCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Trending Now</h2>
          <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all →
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">No featured products available.</p>
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">New Season, New Styles</h2>
          <p className="text-primary-100 mb-6 text-sm">Get ready for the latest trends</p>
          <Link to="/products" className="inline-block bg-white text-primary-600 font-semibold px-8 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors">
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Free Shipping</p>
            <p className="text-xs text-gray-500">On orders above ₹499</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Secure</p>
            <p className="text-xs text-gray-500">100% secure payments</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Easy Returns</p>
            <p className="text-xs text-gray-500">7-day return policy</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">24/7 Support</p>
            <p className="text-xs text-gray-500">Dedicated help center</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
