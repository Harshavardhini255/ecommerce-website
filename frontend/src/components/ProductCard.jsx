import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { getImageUrl, formatPrice } from '../utils/imageUtils'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart!'))
      .catch((error) => toast.error(error?.error || 'Failed to add to cart'))
  }

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <div className="relative bg-gray-100" style={{ aspectRatio: '1/1' }}>
          <img
            src={getImageUrl(product.primary_image?.image)}
            alt={product.name}
            onError={(e) => { e.target.src = '/placeholder.svg' }}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount_percentage > 0 && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.discount_percentage}% OFF
            </span>
          )}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-gray-900 text-xs font-semibold">Out of Stock</span>
            </div>
          )}
          {product.is_in_stock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">{product.category_name || 'Category'}</p>
          <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 flex-1 leading-snug">{product.name}</p>

          <div className="flex items-center mb-2">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.average_rating || 0) ? 'text-yellow-500' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 ml-1">({product.review_count || 0})</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
