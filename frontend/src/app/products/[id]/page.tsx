'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Star, MessageCircle, ShoppingCart, Phone, ChevronLeft, Shield, Heart } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { productService } from '@/services/product.service';
import { chatService } from '@/services/chat.service';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import ReviewForm from '@/components/ReviewForm';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    productService.getOne(id).then((data) => {
      setProduct(data);
      if (user) {
        setIsFavorited(data.favorites?.some((f: any) => f.userId === user.id));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    try {
      const { favorited } = await productService.toggleFavorite(id);
      setIsFavorited(favorited);
      toast.success(favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      title: product.title,
      priceRwf: product.priceRwf,
      imageUrl: product.images?.[0]?.url,
      quantity: 1,
      sellerName: product.seller?.businessName || '',
    });
    toast.success('Added to cart');
  };

  const handleChat = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    try {
      const chat = await chatService.startChat(product.seller.id);
      router.push(`/buyer/chats?chatId=${chat.id}`);
    } catch {
      toast.error('Could not start chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="text-4xl mb-4">😕</p>
            <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
            <button onClick={() => router.back()} className="mt-4 btn-primary">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/600x600?text=No+Image' }];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
              <Image src={images[activeImage]?.url} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">Featured</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: any, i: number) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === activeImage ? 'border-blue-500' : 'border-transparent'}`}>
                    <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">{product.category?.name}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-blue-600">{product.priceRwf.toLocaleString()} RWF</span>
              {product.priceUsd && <span className="text-gray-400 text-lg">${product.priceUsd}</span>}
            </div>

            {product.location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4" /> {product.location}
              </div>
            )}

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`p-3 rounded-xl border border-gray-100 transition-all ${isFavorited ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500' : ''}`} />
              </button>
              <button onClick={handleChat} className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
                <MessageCircle className="w-4 h-4" /> Chat Seller
              </button>
            </div>

            {/* Seller Card */}
            {product.seller && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{product.seller.businessName}</p>
                    <p className="text-sm text-gray-500">{product.seller.location}</p>
                  </div>
                  {product.seller.rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold">{product.seller.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {product.seller.user?.phone && (
                  <a href={`tel:${product.seller.user.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <Phone className="w-4 h-4" /> {product.seller.user.phone}
                  </a>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Verified seller · {product.viewCount} views
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Buyer Reviews</h2>
            {!product.reviews?.length && <p className="text-gray-500 text-sm">No reviews yet</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {product.reviews?.map((review: any) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {review.user.firstName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{review.user.firstName} {review.user.lastName}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              {isAuthenticated ? (
                <ReviewForm productId={id} onSuccess={fetchProduct} />
              ) : (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
                  <p className="text-gray-700 font-medium mb-4">Bought this product?</p>
                  <Link href="/login" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors inline-block">
                    Login to rate
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
