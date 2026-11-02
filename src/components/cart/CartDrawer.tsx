'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/ui/SafeImage';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ArrowRight,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    taxAmount,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponError('');
      setInputCoupon('');
    } else {
      setCouponError(res.message);
      setCouponSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-50">
        <div className="w-full sm:w-screen sm:max-w-md bg-vanilla-100 shadow-2xl flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
          {/* Header (Fixed shrink-0) */}
          <div className="p-3.5 sm:p-5 bg-white border-b border-cocoa-500/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-strawberry-400" />
              <h2 className="font-serif text-base sm:text-lg text-charcoal-700">Your Shopping Bag</h2>
              <span className="text-xs bg-strawberry-100 text-strawberry-600 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-full text-cocoa-500 hover:text-charcoal-700 hover:bg-vanilla-200 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (Fixed shrink-0) */}
          <div className="bg-strawberry-50 p-2.5 sm:p-3 border-b border-strawberry-100/60 shrink-0">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-cocoa-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-strawberry-400" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-strawberry-600 font-semibold">🎉 You unlocked FREE Pan-India Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-charcoal-700">{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-strawberry-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-vanilla-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-strawberry-300 to-strawberry-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List (Scrollable flex-1 min-h-0) */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-vanilla-200 flex items-center justify-center text-strawberry-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-charcoal-700">Your bag is empty</h3>
                <p className="text-xs text-cocoa-500 max-w-xs">
                  Discover our pure 100% GOTS organic cotton baby rompers, heirloom frocks, and dreamy swaddles.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 py-2.5 px-6 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white text-xs font-semibold shadow-pill transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-vanilla-200 shrink-0">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-charcoal-700 hover:text-strawberry-500 line-clamp-1 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-cocoa-300 hover:text-red-500 p-0.5 transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-cocoa-500">
                        <span className="bg-vanilla-200 px-2 py-0.5 rounded-md font-medium">
                          Size: {item.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-cocoa-500/20"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.colorName}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-cocoa-500/5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-cocoa-500/20 rounded-lg bg-vanilla-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-vanilla-200 text-charcoal-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-charcoal-700">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-vanilla-200 text-charcoal-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-charcoal-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.regularPrice > item.price && (
                          <span className="text-[10px] text-cocoa-300 line-through ml-1.5">
                            {formatPrice(item.regularPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Fixed Bottom Checkout Area (shrink-0 with safe-area padding) */}
          {items.length > 0 && (
            <div className="shrink-0 bg-white border-t border-cocoa-500/10 p-3.5 sm:p-5 space-y-3 shadow-lg pb-[max(1rem,env(safe-area-inset-bottom))]">
              {/* Coupon Form (compact) */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-mint-100/60 border border-mint-500/30 text-xs">
                    <div className="flex items-center gap-1.5 text-mint-800 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon <strong>{couponCode}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-cocoa-500 hover:text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Coupon: WELCOME10 or CUCKOO5"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-cocoa-500/20 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-strawberry-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-vanilla-300 hover:bg-vanilla-400 text-charcoal-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-cocoa-500 pt-1.5 border-t border-cocoa-500/10">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-charcoal-700">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-cocoa-400">
                  <span>Estimated Tax (5% GST Incl.)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-charcoal-700 pt-1.5 border-t border-cocoa-500/10 items-baseline">
                  <span>Total Amount</span>
                  <span className="text-strawberry-600 text-base sm:text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Mobile-First Accessible Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full min-h-[48px] py-3.5 px-5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 active:bg-strawberry-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-pill transition-all transform active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
