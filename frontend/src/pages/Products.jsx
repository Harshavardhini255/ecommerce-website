import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { products, loading } = useSelector((state) => state.products)
  const [sortBy, setSortBy] = useState('newest')

  const categoryFilter = searchParams.get('category') || ''
  const searchFilter = searchParams.get('search') || ''

  useEffect(() => {
    dispatch(fetchProducts({ category: categoryFilter, search: searchFilter }))
  }, [dispatch, categoryFilter, searchFilter])

  const sortedItems = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return (b.average_rating || 0) - (a.average_rating || 0)
    return 0
  })

  const womenKeywords = ['women', 'girl', 'fashion', 'beauty', 'accessories', 'jewelry', 'footwear', 'handbag', 'makeup', 'skincare', 'ethnic', 'western', 'dress', 'top', 'heel']
  const filteredItems = categoryFilter
    ? sortedItems
    : sortedItems.filter((p) =>
        womenKeywords.some((kw) => (p.name || '').toLowerCase().includes(kw) || (p.category_name || '').toLowerCase().includes(kw))
      )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {searchFilter ? `Results for "${searchFilter}"` : categoryFilter ? categoryFilter.toUpperCase() : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredItems.length} products</p>
        </div>
        {filteredItems.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="bg-gray-100" style={{ aspectRatio: '1/1' }} />
              <div className="p-3 space-y-2">
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">No products found.</p>
        </div>
      )}
    </div>
  )
}

export default Products
