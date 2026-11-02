import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">Hassle-Free Care</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Returns & Exchange Policy</h1>
        <p className="text-xs text-cocoa-500">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">1. 7-Day Easy Size Exchange</h3>
          <p>
            We understand baby sizing can be unpredictable! If an item doesn't fit your little one perfectly, you may request an exchange within <strong>7 days</strong> of delivery directly through your account or by contacting customer care at <strong>{BRAND.phone}</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">2. Conditions for Exchange / Return</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Garments must be unwashed, unworn, and with original Little Cuckoo product tags intact.</li>
            <li>For hygiene and newborn safety, baby pacifiers, teething toys, or items that show signs of wash or stain cannot be returned.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">3. Reverse Pickup</h3>
          <p>
            We arrange convenient doorstep reverse pickup via our courier partners for 95% of pin codes across India.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700">4. Refund Process</h3>
          <p>
            Once returned garments arrive at our Rajkot inspection facility and pass hygiene check, refunds are initiated within <strong>24 to 48 hours</strong> to the original payment method (or bank transfer for COD orders).
          </p>
        </section>
      </div>
    </div>
  );
}
