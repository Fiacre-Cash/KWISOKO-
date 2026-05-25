'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import api from '@/services/api';

const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'home-garden': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  vehicles: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',
  'food-agriculture': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  services: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
};

const categoryColors: Record<string, string> = {
  electronics: 'from-blue-600/80',
  fashion: 'from-pink-600/80',
  'home-garden': 'from-green-600/80',
  vehicles: 'from-yellow-600/80',
  'food-agriculture': 'from-orange-600/80',
  services: 'from-purple-600/80',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((r) => setCategories(r.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-3xl font-extrabold mb-2">All Categories</h1>
          <p className="text-blue-200">Browse products by category and find exactly what you need</p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 text-sm">Categories will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: any) => {
              const img = categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';
              const gradient = categoryColors[cat.slug] || 'from-gray-600/80';
              return (
                <Link
                  key={cat.id}
                  href={`/products?search=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-white font-bold text-xl drop-shadow">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-1">{cat.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-white/90 text-sm font-medium">
                      <span>Browse products</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  {cat._count?.products > 0 && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
                      {cat._count.products} items
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
