'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/ui/SafeImage';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
  'West Bengal', 'Delhi', 'Chandigarh'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, taxAmount, total, couponCode, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: 'Rajkot',
    state: 'Gujarat',
    postalCode: '360002',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 5% extra discount for prepaid Razorpay UPI
  const prepaidDiscount = paymentMethod === 'RAZORPAY' ? Math.round((subtotal - discount) * (BRAND.prepaidDiscountPercent / 100)) : 0;
  const finalPayable = Math.max(0, total - prepaidDiscount);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-2xl text-charcoal-700">Your bag is empty</h1>
        <p className="text-xs text-cocoa-500">Add some organic baby essentials to proceed with checkout.</p>
        <Link
          href="/shop"
          className="inline-block py-2.5 px-6 rounded-full bg-strawberry-400 text-white font-bold text-xs shadow-pill"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, sku: i.sku })),
          shippingAddress: formData,
          paymentMethod,
          couponCode,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success
      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa-500 hover:text-strawberry-600">
          <ChevronLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
              <h2 className="font-serif text-xl text-charcoal-700">1. Customer Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Priya Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Mobile Number (for updates) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Email Address (for Tax Invoice) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
              <h2 className="font-serif text-xl text-charcoal-700">2. Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Street Address, Flat / House No. *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="House / Apartment number, building, street"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Apartment, Suite, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="Near landmark or gate"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City / Town"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400 bg-white"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="6 digits"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
              <h2 className="font-serif text-xl text-charcoal-700">3. Select Payment Method</h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-strawberry-400 bg-strawberry-50/50 shadow-xs'
                      : 'border-cocoa-500/15 hover:border-cocoa-500/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 text-strawberry-500 focus:ring-strawberry-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-strawberry-500" />
                        <span className="font-bold text-xs sm:text-sm text-charcoal-700">
                          Prepaid UPI / Cards / NetBanking (Razorpay)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        ⚡ Extra 5% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-cocoa-500 mt-1">
                      Pay instantly via Google Pay, PhonePe, Paytm, Debit/Credit Card, or NetBanking. Instant dispatch priority.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-strawberry-400 bg-strawberry-50/50 shadow-xs'
                      : 'border-cocoa-500/15 hover:border-cocoa-500/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-strawberry-500 focus:ring-strawberry-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-cocoa-500" />
                      <span className="font-bold text-xs sm:text-sm text-charcoal-700">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-cocoa-500 mt-1">
                      Pay cash upon delivery. Verified via phone SMS before dispatch.
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6">
          <h2 className="font-serif text-xl text-charcoal-700">Order Summary ({items.length})</h2>

          {/* Items mini-list */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-vanilla-200 shrink-0">
                  <SafeImage src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoal-700 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-cocoa-500">
                    {item.size} • {item.colorName} • Qty: {item.quantity}
                  </p>
                  <p className="font-bold text-charcoal-700 mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2 pt-4 border-t border-cocoa-500/10 text-xs text-cocoa-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal-700">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon ({couponCode})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {prepaidDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Prepaid 5% Bonus Discount</span>
                <span>-{formatPrice(prepaidDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pan-India Shipping</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-cocoa-300">
              <span>Estimated 5% GST (Included)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal-700 pt-3 border-t border-cocoa-500/10">
              <span>Final Payable</span>
              <span className="text-strawberry-500 text-lg">{formatPrice(finalPayable)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full py-4 rounded-full bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-sm shadow-pill transition-all flex items-center justify-center gap-2 transform active:scale-98"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing Order...' : `Place Order • ${formatPrice(finalPayable)}`}</span>
          </button>

          <p className="text-[11px] text-center text-cocoa-300">
            🔒 256-bit SSL encrypted. Compliant with Indian Consumer Protection (E-Commerce) Rules.
          </p>
        </div>
      </div>
    </div>
  );
}
