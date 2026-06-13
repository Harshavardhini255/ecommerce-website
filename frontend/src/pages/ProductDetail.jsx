import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

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
  if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={selectedImage?.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <img
                  key={image.id}
                  src={image.image}
                  alt={image.alt_text}
                  onClick={() => setSelectedImage(image)}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                    selectedImage?.id === image.id ? 'ring-2 ring-primary-600' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.average_rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {product.average_rating?.toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-primary-600">${product.price}</span>
              {product.compare_price && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.compare_price}
                </span>
              )}
              {product.discount_percentage > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                  -{product.discount_percentage}%
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.is_in_stock ? (
              <span className="text-green-600 font-semibold">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.is_in_stock && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity >= product.stock_quantity}
                >
                  <FiPlus />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary flex-1 flex items-center justify-center space-x-2">
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          )}

          {/* Product Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="font-semibold w-32">SKU:</dt>
                <dd className="text-gray-700">{product.sku}</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-32">Category:</dt>
                <dd className="text-gray-700">{product.category_name}</dd>
              </div>
              {product.weight && (
                <div className="flex">
                  <dt className="font-semibold w-32">Weight:</dt>
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
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{review.user_name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{review.title}</h3>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
