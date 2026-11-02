'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import { ProductItem } from '@/types';
import SafeImage from '@/components/ui/SafeImage';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size || '0-3M'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images.find((img) => !img.isPrimary)?.url || primaryImage;

  const discountPercent = calculateDiscountPercent(product.regularPrice, product.salePrice);
  const displayPrice = product.salePrice || product.regularPrice;
  const inWishlist = isInWishlist(product.id);

  // Find variant matching selected size
  const activeVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;

    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      title: product.title,
      slug: product.slug,
      sku: activeVariant.sku,
      size: activeVariant.size,
      colorName: activeVariant.colorName,
      colorHex: activeVariant.colorHex,
      price: displayPrice,
      regularPrice: product.regularPrice,
      imageUrl: primaryImage,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className="group relative bg-white rounded-3xl p-3 border border-cocoa-500/10 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-vanilla-200">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <SafeImage
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badges Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-butter-300 text-charcoal-700 shadow-xs">
                Best Seller
              </span>
            )}
            {product.isNewArrival && !product.isBestSeller && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-babyblue-200 text-babyblue-700 shadow-xs">
                New
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-strawberry-400 text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button Top Right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
              inWishlist
                ? 'bg-strawberry-400 text-white shadow-pill scale-110'
                : 'bg-white/80 backdrop-blur-xs text-charcoal-700 hover:text-strawberry-400 hover:bg-white shadow-xs'
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          {/* Quick Size Pills Overlay on Hover */}
          <div className="absolute inset-x-2 bottom-2 bg-white/90 backdrop-blur-md rounded-xl p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center gap-1 z-10 shadow-xs">
            {product.variants.slice(0, 4).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(v.size);
                }}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                  selectedSize === v.size
                    ? 'bg-strawberry-400 text-white'
                    : 'bg-vanilla-200/70 text-cocoa-700 hover:bg-vanilla-300'
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-3.5 px-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-cocoa-500 mb-1">
            <span className="font-medium text-strawberry-600/90">{product.category?.name || 'Organic Baby'}</span>
            <div className="flex items-center gap-1 text-charcoal-700 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-cocoa-300">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-strawberry-500 transition-colors">
            <h3 className="font-serif text-sm font-semibold text-charcoal-700 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Subtitle / Fabric info */}
          <p className="text-[11px] text-cocoa-300 line-clamp-1 mt-0.5">
            {product.fabricDetails || '100% GOTS Combed Organic Cotton'}
          </p>

          {/* Price & Add to Cart Action */}
          <div className="mt-3 pt-2.5 border-t border-cocoa-500/10 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-charcoal-700">
                  {formatPrice(displayPrice)}
                </span>
                {product.salePrice && product.salePrice < product.regularPrice && (
                  <span className="text-xs text-cocoa-300 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all duration-200 transform active:scale-90 ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-vanilla-200 hover:bg-strawberry-400 hover:text-white text-charcoal-700'
              }`}
              aria-label="Add to Bag"
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
