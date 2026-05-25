'use client';
import { useState, useEffect } from 'react';
import { Package, Search, Plus, Eye, Pencil, Trash2, Loader2, Filter, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/sellers/my-products'); // Assuming this endpoint exists based on similar patterns
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product removed');
    } catch {
      toast.error('Failed to remove product');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/seller/dashboard" className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900">All Products</h1>
          </div>
          <Link href="/seller/products/new" className="btn-primary flex items-center gap-2 py-3 px-6 shadow-lg shadow-blue-100">
            <Plus className="w-5 h-5" /> Add New Product
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-50 flex items-center gap-4">
             <div className="relative flex-1">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-gray-50/50 rounded-xl text-sm focus:outline-none" />
             </div>
             <button className="p-2 bg-gray-50 rounded-xl"><Filter className="w-4 h-4 text-gray-600" /></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50/50">
                 <tr>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Product / Category</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Price</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Stock</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {products.map((p) => (
                   <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden flex-shrink-0">
                            {p.images?.[0] && <Image src={p.images[0].url} alt="" fill className="object-cover" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{p.title}</p>
                            <p className="text-[11px] text-gray-400 uppercase font-black">{p.category?.name}</p>
                          </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 font-black text-blue-600">{p.priceRwf.toLocaleString()} RWF</td>
                     <td className="px-6 py-4 font-bold text-gray-600">{p.stock} units</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Link href={`/products/${p.id}`} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all" title="View product">
                             <Eye className="w-4 h-4" />
                           </Link>
                           <Link href={`/seller/products/${p.id}/edit`} className="p-2 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 rounded-lg transition-all" title="Edit product">
                             <Pencil className="w-4 h-4" />
                           </Link>
                           <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all" title="Delete product">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            {products.length === 0 && (
              <div className="py-20 text-center">
                 <Package className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                 <p className="text-gray-400 font-medium">No products listed yet</p>
                 <Link href="/seller/products/new" className="text-blue-600 font-bold text-sm mt-2 flex items-center justify-center gap-1">Add your first product <ArrowUpRight className="w-4 h-4" /></Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
