import { Link } from 'react-router-dom'
import { FiStar, FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart!')
      })
      .catch((error) => {
        toast.error(error?.error || 'Failed to add to cart')
      })
  }

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="card hover:shadow-lg transition-shadow duration-200">
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.primary_image?.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.discount_percentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
              -{product.discount_percentage}%
            </span>
          )}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.short_description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">
              {product.average_rating?.toFixed(1) || '0.0'} ({product.review_count || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ${product.price}
              </span>
              {product.compare_price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.compare_price}
                </span>
              )}
            </div>
            {product.is_in_stock && (
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FiShoppingCart />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
