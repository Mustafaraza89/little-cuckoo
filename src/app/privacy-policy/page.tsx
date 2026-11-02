import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy | Little Cuckoo',
  description: 'Privacy Policy and data protection terms for Little Cuckoo (ANANT GARMENTS, Rajkot, Gujarat).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-strawberry-100/70 text-strawberry-700 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-strawberry-500" />
          <span>Data Privacy & Security</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Privacy Policy</h1>
        <p className="text-xs text-cocoa-500">Effective Date: November 1, 2026 | Last Updated: November 2026</p>
      </div>

      {/* Main Content Box */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-8 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">1. Introduction & Corporate Entity</h2>
          <p>
            Welcome to <strong>Little Cuckoo</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), operated by the legal manufacturing entity <strong>{BRAND.legalName}</strong> (Proprietor: {BRAND.proprietor}, GSTIN: <code className="font-mono text-charcoal-700">{BRAND.gstin}</code>, UDYAM: <code className="font-mono text-charcoal-700">{BRAND.udyam}</code>), headquartered at {BRAND.address.line1}, {BRAND.address.road}, {BRAND.address.city}, {BRAND.address.state} - {BRAND.address.pincode}, India.
          </p>
          <p>
            We are committed to safeguarding the privacy of parents, guardians, and visitors shopping for organic baby clothing on our platform. This policy explains what information we collect, how it is safeguarded, and how you can exercise your privacy rights under Indian Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023.
          </p>
        </section>

        {/* Info Collected */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">2. Information We Collect</h2>
          <div className="space-y-2 pl-2">
            <p><strong>A. Personal Contact Information:</strong> Name, delivery address, state, postal code, phone number, and email address supplied during checkout or account creation.</p>
            <p><strong>B. Order & Transaction Data:</strong> Apparel items purchased, sizing preferences (0–3M, 3–6M, etc.), order dates, shipping notes, and invoice details.</p>
            <p><strong>C. Payment Information:</strong> Payment transactions are handled directly through RBI-authorized payment aggregators (e.g., Razorpay, Cashfree). <strong>Little Cuckoo never stores, views, or records your credit card numbers, debit card CVVs, net banking credentials, or UPI PINs.</strong></p>
            <p><strong>D. Technical & Session Data:</strong> IP address, device operating system, browser type, and items placed in the shopping cart.</p>
          </div>
        </section>

        {/* How We Use Info */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">3. Purpose of Processing & Usage</h2>
          <p>We process your data strictly for legitimate operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tailoring and dispatching baby apparel packages from our Rajkot workshop.</li>
            <li>Sending SMS and WhatsApp shipping updates with Air Waybill (AWB) tracking numbers.</li>
            <li>Providing prompt customer care and processing size exchanges.</li>
            <li>Fulfilling legal tax obligations under the Indian Goods and Services Tax Act.</li>
            <li>Sending occasional opt-in email updates for new organic seasonal drops (which you can unsubscribe from at any time).</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">4. Cookies & Local Storage</h2>
          <p>
            We use essential session cookies to remember the contents of your shopping cart, maintain your logged-in session, and deliver a smooth checkout experience. We do not sell your browsing history to third-party ad networks or data brokers.
          </p>
        </section>

        {/* Third-Party Service Providers */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">5. Third-Party Service Providers</h2>
          <p>We share necessary information only with vetted service providers bound by strict confidentiality:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Logistics Partners:</strong> Delhivery, Blue Dart, and India Post for parcel delivery.</li>
            <li><strong>Payment Gateways:</strong> PCI-DSS compliant payment aggregators for processing Indian Rupees (INR) transactions.</li>
            <li><strong>Transactional Communications:</strong> SMS and email delivery gateways for order receipts.</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-charcoal-700">6. Data Security & Storage</h2>
          <p>
            All network communication is encrypted with industry-standard 256-bit SSL/TLS encryption. Access to customer order records is restricted to authenticated staff with verified business needs.
          </p>
        </section>

        {/* Grievance Officer */}
        <section className="p-5 rounded-2xl bg-vanilla-100 border border-cocoa-500/10 space-y-3">
          <h2 className="font-serif text-base font-bold text-charcoal-700">7. Grievance Officer & Contact</h2>
          <p>
            If you have questions, wish to delete your account, or have concerns regarding data handling, please contact our designated Grievance Officer:
          </p>
          <div className="text-xs space-y-1 font-medium text-charcoal-700">
            <p><strong>Name:</strong> Vadaliya Bhimjibhai Muljibhai</p>
            <p><strong>Entity:</strong> {BRAND.legalName} (Little Cuckoo)</p>
            <p><strong>Email:</strong> <a href={`mailto:${BRAND.email}`} className="text-strawberry-600 underline">{BRAND.email}</a></p>
            <p><strong>Phone:</strong> {BRAND.phone}</p>
            <p><strong>Address:</strong> {BRAND.address.line1}, {BRAND.address.road}, {BRAND.address.city}, {BRAND.address.state} - {BRAND.address.pincode}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
