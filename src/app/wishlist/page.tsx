'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const matched = (data.products || []).filter((p: any) => items.includes(p.id));
          setProducts(matched);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Saved Favorites
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">My Wishlist</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-cocoa-500 animate-pulse">
          Loading saved favorites...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-cocoa-500/10 text-center space-y-4 max-w-md mx-auto shadow-soft">
          <div className="w-16 h-16 rounded-3xl bg-vanilla-200 text-strawberry-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-700">Your wishlist is empty</h3>
          <p className="text-xs text-cocoa-500">
            Explore our collections and tap the heart icon on any romper or dress to save it here.
          </p>
          <Link
            href="/shop"
            className="inline-block py-2.5 px-6 rounded-full bg-strawberry-400 text-white font-bold text-xs shadow-pill"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const primaryImage = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80';
            const variant = p.variants?.[0];

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-3 border border-cocoa-500/10 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-vanilla-200">
                    <Image src={primaryImage} alt={p.title} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white text-strawberry-400 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 px-1">
                    <span className="text-[10px] font-bold text-strawberry-500 uppercase">
                      {p.category?.name || 'Organic Baby'}
                    </span>
                    <h3 className="font-serif text-sm font-semibold text-charcoal-700 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="font-bold text-xs text-charcoal-700 mt-1">
                      {formatPrice(p.salePrice || p.regularPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-cocoa-500/10">
                  <button
                    type="button"
                    onClick={() => {
                      if (!variant) return;
                      addItem({
                        productId: p.id,
                        variantId: variant.id,
                        title: p.title,
                        slug: p.slug,
                        sku: variant.sku,
                        size: variant.size,
                        colorName: variant.colorName,
                        colorHex: variant.colorHex,
                        price: p.salePrice || p.regularPrice,
                        regularPrice: p.regularPrice,
                        imageUrl: primaryImage,
                        quantity: 1,
                      });
                    }}
                    className="w-full py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
