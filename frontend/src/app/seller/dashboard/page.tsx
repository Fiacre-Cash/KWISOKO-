'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Star, Plus, Eye, Pencil, Trash2, Loader2, TrendingUp, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function SellerDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') { router.push('/'); return; }
    api.get('/sellers/dashboard').then((r) => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [isAuthenticated, user]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Remove this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product removed');
      setData((prev: any) => ({
        ...prev,
        recentProducts: prev.recentProducts.filter((p: any) => p.id !== productId),
      }));
    } catch {
      toast.error('Failed to remove product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: data?.totalProducts ?? 0, icon: <Package className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: data?.totalOrders ?? 0, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { label: 'Rating', value: data?.seller?.rating ? data.seller.rating.toFixed(1) : 'N/A', icon: <Star className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{data?.seller?.businessName}</p>
          </div>
          <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Seller Status */}
        {data?.seller?.status !== 'APPROVED' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-yellow-800">Account Pending Approval</p>
              <p className="text-sm text-yellow-700">Your seller account is being reviewed by our admin team.</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/seller/analytics" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-center group">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Analytics</span>
          </Link>
          <Link href="/seller/subscriptions" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-center group">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Subscription</span>
          </Link>
          <Link href="/seller/orders" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-center group">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Orders</span>
          </Link>
          <Link href="/seller/settings" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex flex-col items-center gap-2 text-center group">
            <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Settings</span>
          </Link>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Products</h2>
            <Link href="/seller/products" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>

          {data?.recentProducts?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products yet</p>
              <Link href="/seller/products/new" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add your first product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data?.recentProducts?.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <Image src={product.images[0].url} alt={product.title} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-sm text-blue-600 font-semibold">{product.priceRwf.toLocaleString()} RWF</p>
                  </div>
                  <span className={`badge text-xs ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link href={`/products/${product.id}`}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/seller/products/${product.id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
