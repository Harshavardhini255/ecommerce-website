import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { getImageUrl, formatPrice } from '../utils/imageUtils'

const ProductDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { currentProduct: product, loading } = useSelector((state) => state.products)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    dispatch(fetchProduct(slug))
  }, [dispatch, slug])

  useEffect(() => {
    if (product?.images?.length > 0) {
      const primary = product.images.find((img) => img.is_primary)
      setSelectedImage(primary || product.images[0])
    }
  }, [product])

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart!')
        setQuantity(1)
      })
      .catch((error) => {
        toast.error(error?.error || 'Failed to add to cart')
      })
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) return <Loading />
  if (!product) return <div className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">Product not found</div>

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden mb-3" style={{ aspectRatio: '4/3' }}>
            <img
              src={getImageUrl(selectedImage?.image)}
              alt={product.name}
              onError={(e) => { e.target.src = '/placeholder.svg' }}
              className="w-full h-full object-contain p-6"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`bg-white rounded-xl border overflow-hidden cursor-pointer ${
                    selectedImage?.id === image.id ? 'ring-2 ring-primary-500 border-primary-500' : 'border-gray-100 hover:border-gray-200'
                  }`}
                  style={{ aspectRatio: '1/1' }}
                >
                  <img
                    src={getImageUrl(image.image)}
                    alt={image.alt_text}
                    onError={(e) => { e.target.src = '/placeholder.svg' }}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category_name}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.average_rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {product.average_rating?.toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-5">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
              {product.discount_percentage > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  -{product.discount_percentage}%
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-5">
            {product.is_in_stock ? (
              <span className="text-green-600 text-sm font-medium">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.is_in_stock && (
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-full transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-semibold text-gray-900 min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-50 text-gray-600 rounded-full transition-colors"
                  disabled={quantity >= product.stock_quantity}
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary flex-1 flex items-center justify-center space-x-2 py-2.5">
                <FiShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t border-gray-100 pt-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Product Details</h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex">
                <dt className="font-medium w-24 text-gray-500">SKU:</dt>
                <dd className="text-gray-700">{product.sku}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-24 text-gray-500">Category:</dt>
                <dd className="text-gray-700">{product.category_name}</dd>
              </div>
              {product.weight && (
                <div className="flex">
                  <dt className="font-medium w-24 text-gray-500">Weight:</dt>
                  <dd className="text-gray-700">{product.weight} kg</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Customer Reviews</h2>
          <div className="space-y-3">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-900">{review.user_name}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{review.title}</h3>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
