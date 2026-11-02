import React from 'react';
import Link from 'next/link';
import { RotateCcw, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Refund Policy | Little Cuckoo',
  description: '7-Day Refund and Reimbursement Policy for Little Cuckoo organic baby clothing.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Customer Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Refund Policy</h1>
        <p className="text-xs text-cocoa-500">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">1. 7-Day Refund Guarantee</h3>
          <p>
            At Little Cuckoo, your baby&apos;s comfort is our highest priority. If an item does not meet your expectations, you may initiate a return or exchange within <strong>7 days of delivery</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">2. Eligible Condition for Refunds</h3>
          <p>To be eligible for a full refund:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Garments must be unworn, unwashed, and in pristine new condition.</li>
            <li>Original tags and organic fabric labels must remain attached.</li>
            <li>Original protective packaging or keepsake gift boxes must be included.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">3. Refund Processing Timeline</h3>
          <p>
            Once our Rajkot workshop receives and inspects the returned garments:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Prepaid Orders (UPI, Netbanking, Cards):</strong> Refund is credited directly to the original payment source within <strong>3 to 5 business days</strong>.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> Our customer support will contact you to transfer the full refund via IMPS/NEFT bank transfer or UPI within <strong>24 to 48 hours</strong> of verification.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">4. How to Request a Refund</h3>
          <p>
            Email us at <a href={`mailto:${BRAND.email}`} className="text-strawberry-600 font-bold underline">{BRAND.email}</a> or message on WhatsApp at <strong>{BRAND.phone}</strong> with your Order Number and photos of the garments. Our team will arrange a free reverse pickup.
          </p>
        </section>
      </div>
    </div>
  );
}
