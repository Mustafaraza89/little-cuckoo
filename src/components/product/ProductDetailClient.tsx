'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/ui/SafeImage';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Ruler, 
  Check, 
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, calculateDiscountPercent } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'fabric' | 'care' | 'shipping'>('fabric');
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const activeVariant = product.variants.find((v: any) => v.id === selectedVariantId) || product.variants[0];
  const images = product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85', altText: product.title }];
  const currentImage = images[activeImageIndex] || images[0];

  const inWishlist = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.regularPrice, product.salePrice);
  const displayPrice = product.salePrice || product.regularPrice;

  // Sticky bottom action bar trigger on mobile scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
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
      imageUrl: currentImage.url,
      quantity,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-strawberry-400 shadow-pill scale-102'
                      : 'border-cocoa-500/10 hover:border-strawberry-300'
                  }`}
                >
                  <SafeImage
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-vanilla-200 border border-cocoa-500/10 shadow-soft">
            <SafeImage
              src={currentImage.url}
              alt={currentImage.altText || product.title}
              fill
              priority
              className="object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-strawberry-400 text-white shadow-xs">
                Save {discountPercent}%
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                inWishlist
                  ? 'bg-strawberry-400 text-white shadow-pill'
                  : 'bg-white/80 backdrop-blur-xs text-charcoal-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Buy Box & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-cocoa-500 mb-1.5">
              <span className="font-semibold text-strawberry-600 uppercase tracking-wide">
                {product.category?.name || 'Organic Baby'}
              </span>
              <span className="text-cocoa-300 font-mono">SKU: {activeVariant?.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700 leading-snug">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-charcoal-700">{product.rating.toFixed(1)}</span>
              <span className="text-cocoa-300">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-charcoal-700">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && product.salePrice < product.regularPrice && (
                <span className="text-sm text-cocoa-300 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-strawberry-500 bg-strawberry-50 px-2 py-0.5 rounded-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Inclusive of 5% GST | Free Pan-India Delivery on orders &gt; ₹999
            </p>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-2">
              Color: <span className="font-normal text-cocoa-500">{activeVariant?.colorName}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    selectedVariantId === v.id
                      ? 'border-strawberry-400 bg-strawberry-50 shadow-xs'
                      : 'border-cocoa-500/15 bg-white hover:border-strawberry-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-cocoa-500/20"
                    style={{ backgroundColor: v.colorHex }}
                  />
                  <span>{v.colorName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Size Guide */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-charcoal-700">
                Size: <span className="font-normal text-cocoa-500">{activeVariant?.size}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-semibold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedVariantId === v.id
                      ? 'border-strawberry-400 bg-strawberry-400 text-white shadow-pill'
                      : 'border-cocoa-500/15 bg-white text-charcoal-700 hover:bg-vanilla-100'
                  }`}
                >
                  <div>{v.size}</div>
                  <div className="text-[10px] font-normal opacity-80">
                    {v.stock > 0 ? `${v.stock} left` : 'Out of stock'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-cocoa-500/20 rounded-2xl bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-charcoal-700 font-bold px-1.5 hover:text-strawberry-500"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-charcoal-700">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-charcoal-700 font-bold px-1.5 hover:text-strawberry-500"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-pill transition-all transform active:scale-98 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-strawberry-400 hover:bg-strawberry-500 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-2xl bg-charcoal-700 hover:bg-charcoal-900 text-white font-bold text-xs sm:text-sm transition-colors shadow-soft"
            >
              Instant Buy Now &rarr;
            </button>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="p-4 rounded-2xl bg-vanilla-200/60 border border-cocoa-500/10 space-y-2 text-xs text-cocoa-500">
            <p className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-strawberry-400 shrink-0" />
              <span>Ships within 24 hours from Rajkot factory</span>
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-babyblue-500 shrink-0" />
              <span>7-Day Hassle-free Exchange on size/fit issues</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Certified Organic Cotton & Nickel-Free Snaps</span>
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Specification Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 shadow-soft">
        <div className="flex border-b border-cocoa-500/10 gap-6 text-xs sm:text-sm font-semibold pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('fabric')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'fabric'
                ? 'border-strawberry-400 text-strawberry-600 font-bold'
                : 'border-transparent text-cocoa-500 hover:text-charcoal-700'
            }`}
          >
            Fabric & Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'care'
                ? 'border-strawberry-400 text-strawberry-600 font-bold'
                : 'border-transparent text-cocoa-500 hover:text-charcoal-700'
            }`}
          >
            Care Instructions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'shipping'
                ? 'border-strawberry-400 text-strawberry-600 font-bold'
                : 'border-transparent text-cocoa-500 hover:text-charcoal-700'
            }`}
          >
            Shipping & Return Policy
          </button>
        </div>

        <div className="pt-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
          {activeTab === 'fabric' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <div className="bg-vanilla-100 p-4 rounded-2xl border border-cocoa-500/10">
                <h4 className="font-bold text-charcoal-700 mb-1">Fabric Specifications</h4>
                <p>{product.fabricDetails || '100% GOTS Certified Organic Combed Cotton.'}</p>
                <p className="mt-1">HSN Code: {product.hsnCode} (NIC 14101 Baby Apparel)</p>
              </div>
            </div>
          )}
          {activeTab === 'care' && (
            <div className="space-y-2">
              <p>{product.careInstructions || 'Machine wash delicate at 30°C with like colors. Do not bleach. Air dry in shade.'}</p>
              <p className="text-xs text-cocoa-300">Tip: Wash inside-out before first wear to maximize cloud-like softness.</p>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-2">
              <p>Free pan-India shipping on orders above ₹999. Orders below ₹999 carry a flat ₹99 courier charge.</p>
              <p>Standard delivery takes 3 to 5 business days via Delhivery / Bluedart. 7-day easy exchange available from customer dashboard.</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal-700">Customer Reviews</h3>
            <p className="text-xs text-cocoa-500">Based on verified purchases</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-charcoal-700">{product.rating.toFixed(1)}</span>
            <div className="flex text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-cocoa-500/10">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev: any) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-700">{rev.customerName}</span>
                  <span className="text-emerald-600 font-semibold text-[11px]">✓ Verified Buyer</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <h5 className="font-bold text-xs text-charcoal-700">{rev.title}</h5>
                <p className="text-xs text-cocoa-500">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-cocoa-500 py-4">No reviews yet. Be the first to share your experience!</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="font-serif text-2xl text-charcoal-700">You Might Also Adore</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 border-t border-cocoa-500/10 shadow-lift sm:hidden z-40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-charcoal-700 truncate">{product.title}</p>
            <p className="text-xs font-bold text-strawberry-500">{formatPrice(displayPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2.5 px-5 rounded-full bg-strawberry-400 text-white font-bold text-xs shrink-0 shadow-pill flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs" onClick={() => setShowSizeGuide(false)} />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-50 border border-cocoa-500/10 space-y-4">
              <div className="flex items-center justify-between border-b border-cocoa-500/10 pb-3">
                <h3 className="font-serif text-lg text-charcoal-700">Baby Size & Fit Guide</h3>
                <button type="button" onClick={() => setShowSizeGuide(false)} className="p-1 rounded-full hover:bg-vanilla-200">
                  ✕
                </button>
              </div>
              <div className="text-xs text-cocoa-500 space-y-3">
                <p>Babies grow quickly! If in doubt, we recommend sizing up for longevity.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-cocoa-500/10 rounded-xl overflow-hidden">
                    <thead className="bg-vanilla-200 font-bold text-charcoal-700">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2">Weight (kg)</th>
                        <th className="p-2">Height (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cocoa-500/10">
                      <tr><td className="p-2 font-bold">Newborn</td><td className="p-2">Up to 3.5 kg</td><td className="p-2">Up to 52 cm</td></tr>
                      <tr><td className="p-2 font-bold">0-3 Months</td><td className="p-2">3.5 - 5.5 kg</td><td className="p-2">52 - 62 cm</td></tr>
                      <tr><td className="p-2 font-bold">3-6 Months</td><td className="p-2">5.5 - 7.5 kg</td><td className="p-2">62 - 68 cm</td></tr>
                      <tr><td className="p-2 font-bold">6-12 Months</td><td className="p-2">7.5 - 10 kg</td><td className="p-2">68 - 76 cm</td></tr>
                      <tr><td className="p-2 font-bold">12-18 Months</td><td className="p-2">10 - 12 kg</td><td className="p-2">76 - 84 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
