'use client';
import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, Loader2, ArrowLeft, Store } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import { productService } from '@/services/product.service';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    productService.getFavorites()
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (productId: string) => {
    try {
      await productService.toggleFavorite(productId);
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      title: product.title,
      priceRwf: product.priceRwf,
      imageUrl: product.images?.[0]?.url,
      quantity: 1,
      sellerName: product.seller?.businessName || 'Kwisoko Seller',
    });
    toast.success('Added to cart!');
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
        <div className="mb-8">
          <Link href="/buyer/profile" className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            My Favorites <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Items you like will appear here. Start browsing and save what you love!</p>
            <Link href="/products" className="btn-primary py-3 px-8 text-sm">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {fav.product.images?.[0] && (
                    <Image src={fav.product.images[0].url} alt={fav.product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <button 
                    onClick={() => removeFavorite(fav.productId)}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    <Store className="w-3 h-3" /> {fav.product.seller?.businessName || 'Kwisoko Seller'}
                  </div>
                  <Link href={`/products/${fav.productId}`} className="block">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 hover:text-blue-600 transition-colors uppercase tracking-tight">{fav.product.title}</h3>
                  </Link>
                  <p className="text-xl font-black text-gray-900 mb-4">{fav.product.priceRwf.toLocaleString()} RWF</p>
                  
                  <button 
                    onClick={() => handleAddToCart(fav.product)}
                    className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
