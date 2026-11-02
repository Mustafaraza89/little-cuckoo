'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/auth/login');
        }
      } catch (e) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-cocoa-500 animate-pulse">
        Loading your parent profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cocoa-500/10">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Parent Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">
            Hello, {user.name}
          </h1>
          <p className="text-xs text-cocoa-500 mt-0.5">{user.email} • {user.phone || 'Phone not set'}</p>
        </div>

        <div className="flex items-center gap-3">
          {['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER'].includes(user.role) && (
            <Link
              href="/admin"
              className="py-2.5 px-5 rounded-full bg-charcoal-700 hover:bg-charcoal-900 text-white font-bold text-xs transition-colors shadow-soft"
            >
              Access Admin Panel &rarr;
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="py-2.5 px-4 rounded-full border border-cocoa-500/20 hover:bg-red-50 hover:text-red-600 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Orders & Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders History */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-xl text-charcoal-700 flex items-center gap-2">
            <Package className="w-5 h-5 text-strawberry-400" />
            <span>Your Order History ({user.orders?.length || 0})</span>
          </h2>

          {!user.orders || user.orders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-cocoa-500/10 text-center space-y-3">
              <p className="text-xs text-cocoa-500">You haven't placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-block py-2.5 px-6 rounded-full bg-strawberry-400 text-white font-bold text-xs shadow-pill"
              >
                Browse Baby Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {user.orders.map((order: any) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-cocoa-500/10">
                    <div>
                      <span className="text-cocoa-500">Order Ref:</span>{' '}
                      <span className="font-mono font-bold text-charcoal-700">{order.orderNumber}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-strawberry-100 text-strawberry-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-cocoa-500 space-y-1">
                    <p>Date: {formatDate(order.createdAt)} • Payment: {order.paymentStatus} ({order.paymentMethod})</p>
                    <p>Total: <strong className="text-charcoal-700">{formatPrice(order.totalAmount)}</strong></p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-cocoa-500">
                      Courier: <strong>{order.courierName || 'Delhivery'}</strong>
                    </span>
                    <Link
                      href={`/order-success/${order.orderNumber}`}
                      className="text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1"
                    >
                      <span>View Invoice & Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Saved Address & Support */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
            <h3 className="font-serif text-lg text-charcoal-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-strawberry-400" />
              <span>Saved Delivery Address</span>
            </h3>

            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr: any) => (
                <div key={addr.id} className="text-xs text-cocoa-500 space-y-1 p-3.5 bg-vanilla-50 rounded-2xl border border-cocoa-500/10">
                  <p className="font-bold text-charcoal-700">{addr.fullName}</p>
                  <p>{addr.street}</p>
                  <p>{addr.apartment || ''}</p>
                  <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p>Phone: {addr.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-cocoa-500">No saved addresses. Your address will be saved upon your next checkout.</p>
            )}
          </div>

          {/* Direct WhatsApp / Phone Care */}
          <div className="bg-vanilla-200/70 p-6 rounded-3xl border border-cocoa-500/10 space-y-2 text-xs">
            <h4 className="font-serif text-base text-charcoal-700">Need Exchange or Sizing Help?</h4>
            <p className="text-cocoa-500 leading-relaxed">
              Our parent care team in Rajkot is available Monday through Saturday.
            </p>
            <p className="font-semibold text-charcoal-700">Phone: +91 9824951223</p>
            <p className="text-cocoa-500">Email: Anantnewborn@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
