'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

interface Props {
  product: {
    id: string;
    title: string;
    priceRwf: number;
    priceUsd?: number;
    location?: string;
    isFeatured?: boolean;
    images?: { url: string; isPrimary: boolean }[];
    seller?: { businessName: string; rating?: number };
    category?: { name: string };
  };
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = product.images?.[0]?.url || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      title: product.title,
      priceRwf: product.priceRwf,
      imageUrl,
      quantity: 1,
      sellerName: product.seller?.businessName || '',
    });
    toast.success('Added to cart');
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toast('Saved to favorites'); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-base font-bold text-blue-600">
                {product.priceRwf.toLocaleString()} RWF
              </p>
              {product.priceUsd && (
                <p className="text-xs text-gray-400">${product.priceUsd}</p>
              )}
            </div>
          </div>

          {product.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3" />
              {product.location}
            </div>
          )}

          {product.seller && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
              <span className="truncate">{product.seller.businessName}</span>
              {product.seller.rating ? (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{product.seller.rating.toFixed(1)}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
