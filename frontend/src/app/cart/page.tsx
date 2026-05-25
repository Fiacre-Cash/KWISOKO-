'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { productService } from '@/services/product.service';
import ProductCard from '@/components/cards/ProductCard';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalRwf, totalItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    // Fetch some recommended products if cart is empty or just for cross-selling
    productService.getAll({ limit: 4 }).then(res => setRecommended(res.data));
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-20">
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any items yet. Start exploring our marketplace for the best deals.</p>
            <Link href="/products" className="bg-gray-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all uppercase text-sm tracking-widest shadow-xl shadow-gray-200">
              Start Shopping
            </Link>
          </div>

          {recommended.length > 0 && (
            <div className="border-t border-gray-100 pt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Recently Added <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommended.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/products" className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Shopping Bag</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Summary of your {totalItems()} items</p>
            </div>
          </div>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest py-2 px-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all">
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-3xl border border-gray-100 p-5 flex gap-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all group">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={item.imageUrl || 'https://via.placeholder.com/200'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 flex flex-col py-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight uppercase tracking-tight line-clamp-1">{item.title}</h3>
                    <button onClick={() => { removeItem(item.productId); toast.success('Item removed'); }} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{item.sellerName}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-xl font-black text-gray-900">{item.priceRwf.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold ml-0.5 uppercase">Rwf</span></p>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 px-1 border border-gray-100">
                      <button
                        onClick={() => item.quantity > 1 ? updateQuantity(item.productId, item.quantity - 1) : removeItem(item.productId)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Added Value */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {[
                { icon: ShieldCheck, title: 'Secure Payment', desc: '100% Protected' },
                { icon: Truck, title: 'Fast Delivery', desc: 'Across Rwanda' },
                { icon: RotateCcw, title: 'Easy Returns', desc: '7 Day Policy' },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/50 border border-white rounded-2xl">
                  <v.icon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">{v.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white sticky top-24 shadow-2xl shadow-blue-900/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Order Total</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal ({totalItems()})</span>
                  <span className="text-white">{totalRwf().toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="h-px bg-gray-800 my-4" />
                <div className="flex justify-between items-end bg-white/5 p-4 rounded-2xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Payable</span>
                  <span className="text-3xl font-black text-blue-400">{totalRwf().toLocaleString()} <span className="text-xs ml-0.5">RWF</span></span>
                </div>
              </div>
              
              <Link
                href={isAuthenticated ? "/checkout" : "/login?redirect=/cart"}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                <ShoppingBag className="w-5 h-5" /> Proceed to Checkout
              </Link>
              
              <p className="text-[10px] text-center text-gray-500 mt-6 font-bold uppercase tracking-widest">
                Powered by Mobile Money & Secure Bank Transfer
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
