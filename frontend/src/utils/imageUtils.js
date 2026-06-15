const GITHUB_RAW = 'https://raw.githubusercontent.com/Harshavardhini255/ecommerce-website/main'
const RENDER_BASE = 'https://ecommerce-website-2-qykd.onrender.com'

export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.svg'
  if (imagePath.startsWith(GITHUB_RAW)) return imagePath
  if (imagePath.startsWith(RENDER_BASE)) return imagePath.replace(RENDER_BASE, GITHUB_RAW)
  if (imagePath.startsWith('/media/')) return `${GITHUB_RAW}${imagePath}`
  if (imagePath.startsWith('http')) return imagePath
  return `${GITHUB_RAW}${imagePath}`
}

export function formatPrice(price) {
  return `₹${parseFloat(price).toFixed(2)}`
}
