'use client';

import React, { useState } from 'react';
import { Ticket, Plus, Tag, Check, Copy, Percent, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  timesUsed: number;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
  validUntil: string;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'WELCOME10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 499,
    usageLimit: 10000,
    timesUsed: 1420,
    status: 'ACTIVE',
    validUntil: '2026-12-31',
  },
  {
    id: 'c-2',
    code: 'ORGANIC20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 1999,
    usageLimit: 500,
    timesUsed: 318,
    status: 'ACTIVE',
    validUntil: '2026-11-30',
  },
  {
    id: 'c-3',
    code: 'BABYFIRST',
    discountType: 'FLAT',
    discountValue: 150,
    minOrderValue: 999,
    usageLimit: 2000,
    timesUsed: 890,
    status: 'ACTIVE',
    validUntil: '2026-12-31',
  },
  {
    id: 'c-4',
    code: 'DIWALI2026',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    minOrderValue: 2499,
    usageLimit: 1000,
    timesUsed: 1000,
    status: 'EXPIRED',
    validUntil: '2026-10-31',
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(499);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      usageLimit: Number(usageLimit),
      timesUsed: 0,
      status: 'ACTIVE',
      validUntil,
    };

    setCoupons([newCoupon, ...coupons]);
    setShowModal(false);
    setCode('');
  };

  const toggleStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Marketing & Incentives
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Coupons & Discounts</h1>
          <p className="text-xs text-cocoa-500">
            Create and track promo vouchers, seasonal sales, and influencer coupon codes.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Voucher</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft">
          <p className="text-xs text-cocoa-400 font-medium">Active Coupons</p>
          <p className="text-2xl font-serif text-charcoal-700 mt-1">
            {coupons.filter((c) => c.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft">
          <p className="text-xs text-cocoa-400 font-medium">Total Redemptions</p>
          <p className="text-2xl font-serif text-charcoal-700 mt-1">
            {coupons.reduce((sum, c) => sum + c.timesUsed, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft">
          <p className="text-xs text-cocoa-400 font-medium">Top Performing Code</p>
          <p className="text-lg font-bold text-strawberry-600 mt-1">
            WELCOME10 (1,420 Uses)
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100 text-charcoal-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Usage / Limit</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10 text-cocoa-600">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-vanilla-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-charcoal-700">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-strawberry-50 border border-strawberry-200/60 text-strawberry-700">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="text-cocoa-400 hover:text-strawberry-600 transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-charcoal-700">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                  </td>
                  <td className="p-4">{formatPrice(c.minOrderValue)}</td>
                  <td className="p-4">
                    <span className="font-semibold text-charcoal-700">{c.timesUsed}</span>
                    <span className="text-cocoa-400"> / {c.usageLimit}</span>
                  </td>
                  <td className="p-4">{c.validUntil}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'EXPIRED'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="text-xs font-bold text-strawberry-600 hover:text-strawberry-700 underline"
                    >
                      {c.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-lift w-full max-w-md p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-700">Add New Promo Voucher</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON15"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cocoa-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-cocoa-500/20 text-cocoa-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
