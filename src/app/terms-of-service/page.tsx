import React from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Shield, Scale } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Terms of Service | Little Cuckoo',
  description: 'Terms and conditions governing the purchase of organic baby apparel from Little Cuckoo (ANANT GARMENTS).',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-strawberry-100/70 text-strawberry-700 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-strawberry-500" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Terms of Service</h1>
        <p className="text-xs text-cocoa-500">Effective Date: November 1, 2026 | Last Updated: November 2026</p>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-8 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">1. Acceptance of Terms</h2>
          <p>
            These Terms of Service constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;you&quot;) and <strong>{BRAND.legalName}</strong> (&quot;Little Cuckoo&quot;, &quot;we&quot;, &quot;us&quot;), operating the eCommerce platform for organic baby apparel under GSTIN <code className="font-mono text-charcoal-700">{BRAND.gstin}</code>. By browsing this website, creating an account, or placing an order, you agree to comply with and be bound by these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">2. Customer Eligibility & Accounts</h2>
          <p>
            You must be at least 18 years of age or possess legal parental/guardian consent to enter into transactions on this site. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">3. Product Specifications & Organic Authenticity</h2>
          <p>
            We take utmost care to accurately display the dimensions, fabric compositions, and colors of our garments. All Little Cuckoo newborn clothing is crafted using 100% GOTS certified combed organic cotton, dyed with certified non-toxic azo-free formulations. Because natural organic cotton fibers undergo minimal chemical processing, subtle natural variations in weave and drape may occur.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">4. Pricing, Taxes & Invoicing</h2>
          <p>
            All prices are listed in Indian Rupees (INR) and include applicable Goods and Services Tax (GST) at 5% under HSN Chapter 6111 (Babies&apos; garments and clothing accessories of cotton). We reserve the right to revise prices or discontinue products at any time without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">5. Order Acceptance & Dispatch</h2>
          <p>
            Placement of an order does not guarantee immediate acceptance. An order is confirmed once payment verification is completed and an order confirmation email/SMS is issued. In the rare event of inventory discrepancy or delivery partner unserviceability, we reserve the right to cancel the order and issue an immediate 100% refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">6. Shipping & Delivery</h2>
          <p>
            Standard shipping is free on orders above ₹{BRAND.freeShippingThreshold}. Delivery timelines (typically 2 to 6 business days) are estimates provided by third-party express couriers. Little Cuckoo is not liable for force majeure delays such as extreme weather or regional transit strikes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">7. Returns, Exchanges & Refunds</h2>
          <p>
            We provide a <strong>7-Day Hassle-Free Exchange & Return Window</strong> for unworn, unwashed baby garments with original tags intact. Baby hygiene and safety are paramount; items that have been washed, soiled, or altered cannot be accepted for return.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">8. Intellectual Property</h2>
          <p>
            All trademarks, logos, brand names, product photographs, styling designs, and written content on this website are the intellectual property of <strong>{BRAND.legalName}</strong>. Unauthorized reproduction or commercial use is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">9. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any dispute or claim arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Rajkot, Gujarat</strong>.
          </p>
        </section>

        <section className="p-5 rounded-2xl bg-vanilla-100 border border-cocoa-500/10 space-y-2">
          <h2 className="font-serif text-base font-bold text-charcoal-700">10. Contact Us</h2>
          <p>
            For questions regarding these Terms of Service:
          </p>
          <p className="font-medium text-charcoal-700">
            {BRAND.legalName} &bull; Email: <a href={`mailto:${BRAND.email}`} className="text-strawberry-600 underline">{BRAND.email}</a> &bull; Phone: {BRAND.phone}
          </p>
        </section>
      </div>
    </div>
  );
}
