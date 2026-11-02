import React from 'react';
import { Ban, Clock, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Cancellation Policy | Little Cuckoo',
  description: 'Order Cancellation terms and procedures for Little Cuckoo.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Order Management
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Cancellation Policy</h1>
        <p className="text-xs text-cocoa-500">Last updated: November 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">1. Cancellation Window</h3>
          <p>
            You may cancel your baby clothing order anytime <strong>before it is dispatched</strong> from our Rajkot workshop (typically within 12 to 24 hours of placing the order).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">2. How to Cancel</h3>
          <p>
            To cancel, please email <a href={`mailto:${BRAND.email}`} className="text-strawberry-600 font-bold underline">{BRAND.email}</a> or WhatsApp us at <strong>{BRAND.phone}</strong> with your Order Number and request cancellation.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">3. Cancellation After Dispatch</h3>
          <p>
            If your parcel has already been handed over to our courier partner (Delhivery/Blue Dart), cancellation is not possible while in transit. In this case, simply decline delivery at your doorstep or initiate a 7-day return once received.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif text-base text-charcoal-700 font-bold">4. 100% Instant Refund for Cancelled Orders</h3>
          <p>
            For prepaid orders cancelled prior to dispatch, a full 100% refund is initiated back to your original payment method immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
