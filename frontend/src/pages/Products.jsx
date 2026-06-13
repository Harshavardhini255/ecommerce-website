import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

const Products = () => {
  const dispatch = useDispatch()
  const { products, categories, loading } = useSelector((state) => state.products)
  const [filters, setFilters] = useState({
    category: '',
    min_price: '',
    max_price: '',
    search: '',
  })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params = {}
    if (filters.category) params.category = filters.category
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    if (filters.search) params.search = filters.search

    dispatch(fetchProducts(params))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      min_price: '',
      max_price: '',
      search: '',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="input"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="input"
                />
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="input"
                />
              </div>
            </div>

            <button onClick={clearFilters} className="btn btn-secondary w-full">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
