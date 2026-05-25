'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Loader2, MapPin } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ProductCard from '@/components/cards/ProductCard';
import { productService } from '@/services/product.service';
import api from '@/services/api';
import { LOCATIONS_BY_COUNTRY } from '@/data/locations';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    categoryId: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);

      const res = await productService.getAll(params);
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({ search: '', categoryId: '', location: '', minPrice: '', maxPrice: '' });
    setPage(1);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="max-w-7xl mx-auto mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="input text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input text-sm"
            >
              <option value="">📍 All Locations</option>
              {Object.entries(LOCATIONS_BY_COUNTRY).map(([country, cities]) => (
                <optgroup key={country} label={`${cities[0].flag} ${country}`}>
                  {cities.map((city) => (
                    <option key={`${city.countryCode}-${city.name}`} value={city.name}>
                      {city.name}{city.province ? ` — ${city.province}` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="Min price (RWF)"
              className="input text-sm"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Max price (RWF)"
              className="input text-sm"
            />
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
              <X className="w-4 h-4" /> Clear filters
            </button>
          </div>
        )}
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${total} products found`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
        <ProductsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
