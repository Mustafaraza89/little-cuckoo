'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

export default function CartPage() {
  const {
    items,
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

  const [inputCoupon, setInputCoupon] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');

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

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-vanilla-200 text-strawberry-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Your shopping bag is empty</h1>
        <p className="text-xs text-cocoa-500 max-w-sm mx-auto">
          Explore our certified organic cotton baby rompers, swaddles, and heirloom dresses.
        </p>
        <Link
          href="/shop"
          className="inline-block py-3 px-8 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa-500 hover:text-strawberry-600 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Shopping Bag ({items.length})</h1>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-strawberry-50 p-4 rounded-3xl border border-strawberry-100 max-w-3xl space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-charcoal-700">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-strawberry-400" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-strawberry-600 font-bold">🎉 You unlocked FREE Pan-India Shipping!</span>
            ) : (
              <span>Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more to get <strong>FREE Pan-India Shipping</strong></span>
            )}
          </span>
          <span className="font-bold text-strawberry-500">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2 bg-vanilla-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-strawberry-300 to-strawberry-500 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 shadow-soft">
          <div className="divide-y divide-cocoa-500/10">
            {items.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-vanilla-200 shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-serif text-sm font-semibold text-charcoal-700 hover:text-strawberry-500">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-cocoa-500">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.colorName}</strong></span>
                    </div>
                    <p className="font-bold text-xs text-charcoal-700 mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-cocoa-500/20 rounded-xl bg-vanilla-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-charcoal-700 hover:bg-vanilla-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-charcoal-700">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-charcoal-700 hover:bg-vanilla-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="font-bold text-sm text-charcoal-700">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-cocoa-300 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6">
          <h2 className="font-serif text-xl text-charcoal-700">Order Summary</h2>

          {/* Coupon Input */}
          <div>
            {couponCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-mint-100 border border-mint-500/30 text-xs">
                <span className="font-semibold text-mint-800">Coupon: {couponCode}</span>
                <button type="button" onClick={removeCoupon} className="text-red-600 font-bold hover:underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon Code"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-cocoa-500/20 uppercase tracking-wider focus:outline-none focus:border-strawberry-400"
                />
                <button type="submit" className="px-3.5 py-2 rounded-xl bg-vanilla-300 text-charcoal-700 text-xs font-bold hover:bg-vanilla-400">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
          </div>

          {/* Pricing Details */}
          <div className="space-y-2 text-xs text-cocoa-500 pt-2 border-t border-cocoa-500/10">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal-700">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pan-India Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-cocoa-300">
              <span>Inclusive 5% GST</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal-700 pt-3 border-t border-cocoa-500/10">
              <span>Total Amount</span>
              <span className="text-strawberry-500 text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-sm shadow-pill transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
