'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, Package, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.order) {
        throw new Error('Order not found. Please verify your order reference number.');
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Unable to locate order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Real-time Fulfillment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Track Your Order</h1>
        <p className="text-xs text-cocoa-500">
          Enter your Little Cuckoo order reference number (e.g. <code>LC-202611-1001</code>)
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Order Reference Number *</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="LC-202611-1001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs font-mono uppercase text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-xs shadow-pill transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Locating Order...' : 'Track Order Status'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cocoa-500/10 text-xs">
            <div>
              <span className="text-cocoa-500">Order Reference</span>
              <p className="font-mono font-bold text-sm text-charcoal-700">{order.orderNumber}</p>
            </div>
            <div>
              <span className="text-cocoa-500">Courier Partner</span>
              <p className="font-semibold text-charcoal-700">{order.courierName || 'Delhivery'}</p>
            </div>
            <div>
              <span className="text-cocoa-500">Air Waybill / Tracking #</span>
              <p className="font-mono font-semibold text-strawberry-600">{order.trackingNumber || 'Processing'}</p>
            </div>
            <div>
              <span className="text-cocoa-500">Current Status</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-xs bg-strawberry-100 text-strawberry-700">
                {order.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-base text-charcoal-700">Order Milestones</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-charcoal-700">Order Confirmed</p>
                  <p className="text-cocoa-500 text-[11px]">{formatDate(order.createdAt)} • Payment: {order.paymentStatus} ({order.paymentMethod})</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : 'text-cocoa-300'}`} />
                <div>
                  <p className="font-bold text-charcoal-700">Handcrafted & Quality Inspected</p>
                  <p className="text-cocoa-500 text-[11px]">Factory Unit: Shakti Krupa, Gondal Road, Rajkot</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : 'text-cocoa-300'}`} />
                <div>
                  <p className="font-bold text-charcoal-700">Dispatched with Courier Partner</p>
                  <p className="text-cocoa-500 text-[11px]">{order.courierName} Tracking: {order.trackingNumber || 'Pending AWB assignment'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="pt-4 border-t border-cocoa-500/10 space-y-2">
            <h4 className="font-bold text-xs text-charcoal-700">Included Apparel</h4>
            <div className="space-y-1.5 text-xs">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-cocoa-500">
                  <span>{item.productTitle} ({item.variantTitle}) × {item.quantity}</span>
                  <span className="font-semibold text-charcoal-700">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
