const GITHUB_RAW = 'https://raw.githubusercontent.com/Harshavardhini255/ecommerce-website/main'

export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.svg'
  if (imagePath.startsWith('http')) return imagePath
  return `${GITHUB_RAW}${imagePath}`
}

export function formatPrice(price) {
  return `₹${parseFloat(price).toFixed(2)}`
}
