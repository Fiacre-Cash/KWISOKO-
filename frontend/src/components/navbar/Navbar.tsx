'use client';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Home, Phone } from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { authService } from '@/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authService.logout();
    clearUser();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/products', label: 'Products', icon: null },
    { href: '/categories', label: 'Categories', icon: null },
    { href: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900">Kwi<span className="text-blue-600">soko</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {user?.role === 'SELLER' && (
              <Link
                href="/seller/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/seller/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" className={`relative p-2 rounded-lg transition-colors ${isActive('/cart') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated && <NotificationCenter />}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user?.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{user?.role}</span>
                    </div>
                    <Link href="/buyer/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 text-gray-400" /> My Profile
                    </Link>
                    {user?.role === 'SELLER' && (
                      <Link href="/seller/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" /> Seller Dashboard
                      </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">Login</Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg font-medium ${
                  isActive(link.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {link.icon}
                {link.label}
              </Link>
            ))}
            {user?.role === 'SELLER' && (
              <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
