import React from 'react';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, Truck, CreditCard, Building2, Save } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.websiteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Store Settings & Compliance</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          Manage brand details, tax compliance, Razorpay payment configurations, and shipping thresholds.
        </p>
      </div>

      {/* 1. Legal & Business Compliance */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-cocoa-500/10 pb-3">
          <Building2 className="w-5 h-5 text-strawberry-400" />
          <h3 className="font-serif text-lg text-charcoal-700">1. Business Entity & Tax Compliance</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Brand Name</label>
            <input type="text" readOnly defaultValue={BRAND.name} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 text-charcoal-700 font-medium" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Legal Proprietorship Name</label>
            <input type="text" readOnly defaultValue={BRAND.legalName} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 text-charcoal-700 font-medium" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">GSTIN Number</label>
            <input type="text" readOnly defaultValue={BRAND.gstin} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-mono font-bold text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">MSME UDYAM Registration</label>
            <input type="text" readOnly defaultValue={BRAND.udyam} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-mono font-bold text-charcoal-700" />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-charcoal-700 mb-1">Principal Place of Business (Rajkot)</label>
            <input type="text" readOnly defaultValue="First Floor, Shakti Krupa, Nr. Lathiya Garage, Gondal Road, Rajkot, Gujarat 360002" className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 text-charcoal-700" />
          </div>
        </div>
      </div>

      {/* 2. Shipping & Thresholds */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-cocoa-500/10 pb-3">
          <Truck className="w-5 h-5 text-babyblue-500" />
          <h3 className="font-serif text-lg text-charcoal-700">2. Pan-India Shipping Rules</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Free Shipping Min Order (₹)</label>
            <input type="number" readOnly defaultValue={BRAND.freeShippingThreshold} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-bold text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Standard Courier Fee (₹)</label>
            <input type="number" readOnly defaultValue={BRAND.standardShippingFee} className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-bold text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Primary Courier Partner</label>
            <input type="text" readOnly defaultValue="Delhivery Express" className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-bold text-charcoal-700" />
          </div>
        </div>
      </div>

      {/* 3. Payment Gateway Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-cocoa-500/10 pb-3">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <h3 className="font-serif text-lg text-charcoal-700">3. Razorpay & Banking Integration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Razorpay Key ID</label>
            <input type="text" defaultValue="rzp_live_cuckoo_demo" className="w-full px-3 py-2 rounded-xl border border-cocoa-500/20 font-mono text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Razorpay Key Secret</label>
            <input type="password" defaultValue="••••••••••••••••••••••••" className="w-full px-3 py-2 rounded-xl border border-cocoa-500/20 font-mono text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Bank Account (SBI)</label>
            <input type="text" readOnly defaultValue="State Bank of India — 20202526387 (IFSC: SBIN0031882)" className="w-full px-3 py-2 rounded-xl bg-vanilla-50 border border-cocoa-500/20 font-mono text-charcoal-700" />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Prepaid UPI Discount</label>
            <input type="text" readOnly defaultValue="5% Instant Discount Active" className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
