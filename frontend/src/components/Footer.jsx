import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="10" fill="#e60023"/>
                <path d="M11 10h5a6 6 0 0 1 0 16h-5V10z" fill="white"/>
              </svg>
              <span className="text-base font-bold text-gray-900">Dharshaa</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover the latest in women's fashion, beauty, and accessories.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm text-gray-500 hover:text-gray-900">All Products</Link></li>
              <li><Link to="/products?category=fashion" className="text-sm text-gray-500 hover:text-gray-900">Fashion</Link></li>
              <li><Link to="/products?category=beauty" className="text-sm text-gray-500 hover:text-gray-900">Beauty</Link></li>
              <li><Link to="/products?category=accessories" className="text-sm text-gray-500 hover:text-gray-900">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Shipping</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Returns</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Press</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 text-center text-xs text-gray-400">
          <p>© 2024 Dharshaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
