import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">Pan-India Delivery</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Shipping & Delivery Policy</h1>
        <p className="text-xs text-cocoa-500">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">1. Free Shipping Threshold</h3>
          <p>
            We offer <strong>FREE Pan-India standard shipping</strong> on all orders above <strong>₹{BRAND.freeShippingThreshold}</strong>. Orders below ₹{BRAND.freeShippingThreshold} incur a flat delivery charge of ₹{BRAND.standardShippingFee} anywhere in India.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">2. Processing & Dispatch Timeline</h3>
          <p>
            All baby apparel orders are quality-checked, sanitized, and dispatched within <strong>24 to 48 hours</strong> directly from our primary manufacturing unit in <strong>Rajkot, Gujarat</strong> (M/s {BRAND.legalName}).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">3. Estimated Transit Times</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gujarat & Western India:</strong> 2 to 3 business days</li>
            <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad):</strong> 3 to 4 business days</li>
            <li><strong>Rest of India:</strong> 4 to 6 business days</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">4. Courier Partners & Tracking</h3>
          <p>
            We partner with reliable express carriers including <strong>Delhivery, Bluedart, and India Post Speed Post</strong>. Once your order is dispatched, you will receive an SMS and email with your Air Waybill (AWB) number to track on our <a href="/track-order" className="text-strawberry-600 font-bold underline">Track Order</a> page.
          </p>
        </section>
      </div>
    </div>
  );
}
