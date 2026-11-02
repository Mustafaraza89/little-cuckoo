'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AccountOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="p-20 text-center text-xs text-cocoa-400">Loading your orders...</div>;
  }

  const orders = user?.orders || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa-500 hover:text-strawberry-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account</span>
      </Link>

      <div className="space-y-1">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Order History
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Your Baby Clothing Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-cocoa-500/10 text-center space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-vanilla-200 flex items-center justify-center mx-auto text-cocoa-400">
            <Package className="w-6 h-6" />
          </div>
          <p className="font-serif text-lg text-charcoal-700">No orders placed yet</p>
          <p className="text-xs text-cocoa-500">
            When you purchase organic baby garments, tracking and receipts will appear here.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-colors"
            >
              Start Shopping &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord: any) => (
            <div
              key={ord.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-cocoa-500/10 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-charcoal-700 text-xs">
                    #{ord.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-strawberry-100 text-strawberry-700 font-bold text-[10px]">
                    {ord.status}
                  </span>
                </div>
                <p className="text-[11px] text-cocoa-400">Placed on {formatDate(ord.createdAt)}</p>
                <p className="text-xs font-bold text-charcoal-700">{formatPrice(ord.totalAmount)}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/track-order?order=${ord.orderNumber}`}
                  className="px-4 py-2 rounded-full border border-cocoa-500/20 text-xs font-bold text-charcoal-700 hover:bg-vanilla-200 transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-strawberry-500" />
                  <span>Live Tracking</span>
                </Link>
                <Link
                  href={`/order-success/${ord.orderNumber}`}
                  className="px-4 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  View Receipt
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
