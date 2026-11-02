'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

export default function AccountAddressesPage() {
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
    return <div className="p-20 text-center text-xs text-cocoa-400">Loading saved addresses...</div>;
  }

  const addresses = user?.addresses || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa-500 hover:text-strawberry-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Shipping Destinations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Saved Addresses</h1>
        </div>

        <button
          onClick={() => alert('New address will be automatically saved during your next checkout.')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-cocoa-500/10 text-center space-y-3 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-vanilla-200 flex items-center justify-center mx-auto text-cocoa-400">
            <MapPin className="w-6 h-6" />
          </div>
          <p className="font-serif text-lg text-charcoal-700">No saved addresses yet</p>
          <p className="text-xs text-cocoa-500">
            When you enter your delivery address at checkout, you can save it for 1-click ordering.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div
              key={addr.id}
              className="bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-2 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Default
                </span>
              )}
              <p className="font-bold text-charcoal-700 text-xs">{addr.name}</p>
              <p className="text-xs text-cocoa-500 leading-relaxed">
                {addr.address1} {addr.address2 && `, ${addr.address2}`}
                <br />
                {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p className="text-[11px] text-cocoa-400 pt-1">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
