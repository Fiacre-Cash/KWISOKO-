import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-white font-extrabold text-lg">Kwisoko</span>
            </div>
            <p className="text-sm leading-relaxed">Rwanda's trusted marketplace connecting buyers and sellers across the country.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/sellers" className="hover:text-white transition-colors">Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seller/apply" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="mailto:support@kwisoko.rw" className="hover:text-white transition-colors">support@kwisoko.rw</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Kwisoko. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
