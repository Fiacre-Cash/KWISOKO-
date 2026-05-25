'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Shield, MessageCircle, Star, ArrowRight, TrendingUp, CheckCircle, Users, Package } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { LOCATIONS_BY_COUNTRY } from '@/data/locations';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search);
    if (location) params.set('location', location);
    router.push(`/products?${params.toString()}`);
  };

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
      color: 'from-blue-500/80',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
      color: 'from-pink-500/80',
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
      color: 'from-green-500/80',
    },
    {
      name: 'Vehicles',
      slug: 'vehicles',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
      color: 'from-yellow-500/80',
    },
    {
      name: 'Food & Agriculture',
      slug: 'food-agriculture',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
      color: 'from-orange-500/80',
    },
    {
      name: 'Services',
      slug: 'services',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80',
      color: 'from-purple-500/80',
    },
  ];

  const featuredProducts = [
    {
      id: '1',
      title: 'Samsung Galaxy A54 5G',
      price: '450,000 RWF',
      location: 'Kigali',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
      seller: 'JP Electronics',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'HP Laptop 15 Core i5',
      price: '850,000 RWF',
      location: 'Kigali',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
      seller: 'Tech Hub RW',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Nike Air Max Shoes',
      price: '120,000 RWF',
      location: 'Kigali',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      seller: 'Fashion Store',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Modern Sofa Set',
      price: '380,000 RWF',
      location: 'Musanze',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
      seller: 'Home Decor RW',
      rating: 4.6,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Browse Products',
      desc: 'Search thousands of listings across all categories from verified sellers.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80',
    },
    {
      step: '02',
      title: 'Chat with Seller',
      desc: 'Message sellers directly, ask questions, and negotiate the best price.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80',
    },
    {
      step: '03',
      title: 'Pay Securely',
      desc: 'Complete your purchase with MoMo, card, or cash on delivery.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&q=80',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Listings', icon: <Package className="w-5 h-5" /> },
    { value: '2,500+', label: 'Verified Sellers', icon: <Users className="w-5 h-5" /> },
    { value: '50,000+', label: 'Happy Buyers', icon: <ShoppingBag className="w-5 h-5" /> },
    { value: '4.8★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80"
            alt="Kwisoko marketplace"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-blue-600/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white mb-6">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              Rwanda's #1 Online Marketplace
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              Buy & Sell<br />
              <span className="text-yellow-400">Anything</span> in Rwanda
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Connect with thousands of verified sellers. Find great deals on electronics, fashion, vehicles, and more — all in one place.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
                />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="py-4 px-3 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg bg-white border-0 min-w-[160px]"
              >
                <option value="">📍 All Locations</option>
                {Object.entries(LOCATIONS_BY_COUNTRY).map(([country, cities]) => (
                  <optgroup key={country} label={`${cities[0].flag} ${country}`}>
                    {cities.map((city) => (
                      <option key={`${city.countryCode}-${city.name}`} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-7 py-4 rounded-xl transition-colors shadow-lg whitespace-nowrap">
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mt-5">
              {['Electronics', 'Fashion', 'Vehicles', 'Food'].map((tag) => (
                <Link key={tag} href={`/products?search=${tag}`}
                  className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors border border-white/20">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-blue-700 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="text-yellow-400">{s.icon}</div>
                  <span className="text-2xl font-extrabold">{s.value}</span>
                </div>
                <p className="text-blue-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
              <p className="text-gray-500 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?search=${cat.name}`}
                className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm text-center drop-shadow">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked deals from top sellers</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <Link key={product.id} href="/products"
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{product.title}</h3>
                  <p className="text-blue-600 font-bold text-base mb-1">{product.price}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{product.location}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How Kwisoko Works</h2>
            <p className="text-gray-500">Three simple steps to buy or sell anything</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-5 shadow-md group-hover:shadow-xl transition-shadow">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-blue-900/30" />
                  <div className="absolute top-3 left-3 w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-extrabold text-gray-900 text-sm shadow">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KWISOKO ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Rwanda's Most Trusted<br />
                <span className="text-blue-600">Marketplace</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Kwisoko connects buyers and sellers across Rwanda with a safe, verified, and easy-to-use platform. Every seller is ID-verified and approved by our team.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Verified Sellers', desc: 'Every seller goes through ID verification and admin approval.' },
                  { title: 'Secure Payments', desc: 'Pay with MoMo, card, or cash — your money is always protected.' },
                  { title: 'Direct Communication', desc: 'Chat directly with sellers to negotiate and ask questions.' },
                  { title: 'RWF & USD Pricing', desc: 'All prices shown in both Rwandan Francs and US Dollars.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <Link href="/register" className="btn-primary px-6 py-3">Get Started Free</Link>
                <Link href="/products" className="btn-secondary px-6 py-3">Browse Products</Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80"
                  alt="Shopping experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">100% Verified</p>
                  <p className="text-gray-500 text-xs">All sellers are approved</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">4.8 / 5 Rating</p>
                  <p className="text-gray-500 text-xs">50,000+ happy buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELL BANNER ── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
            alt="Sell on Kwisoko"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-blue-900/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Start Selling Today</h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of sellers already growing their business on Kwisoko. Free to register, easy to use.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link href="/seller/apply" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-colors border border-white/30">
              Apply as Seller
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
