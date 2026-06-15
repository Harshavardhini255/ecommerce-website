const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const MEDIA_BASE = API_BASE.replace('/api', '')

export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.svg'
  if (imagePath.startsWith('http')) return imagePath
  return `${MEDIA_BASE}${imagePath}`
}

export function formatPrice(price) {
  return `₹${parseFloat(price).toFixed(2)}`
}
