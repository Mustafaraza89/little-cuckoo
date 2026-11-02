'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface FAQItem {
  q: string;
  a: string;
  category: 'FABRIC' | 'SIZING' | 'SHIPPING' | 'RETURNS' | 'CARE';
}

const FAQS: FAQItem[] = [
  {
    category: 'FABRIC',
    q: 'Is Little Cuckoo clothing made from real 100% organic cotton?',
    a: 'Yes, absolutely. All our fabrics are knitted from 100% GOTS (Global Organic Textile Standard) certified combed organic cotton yarn. We do not blend synthetic polyesters or nylon into our newborn fabrics.',
  },
  {
    category: 'FABRIC',
    q: 'Are your dyes safe for babies with sensitive skin and eczema?',
    a: 'Yes. We exclusively use certified azo-free, heavy-metal-free, and phthalate-free dyes. Our garments are hypoallergenic and designed specifically to avoid heat rashes and skin flare-ups in humid Indian climates.',
  },
  {
    category: 'FABRIC',
    q: 'Are your snaps and zippers nickel-free?',
    a: 'Yes. All snap fasteners on our rompers and kimonos are 100% nickel-free and lead-free YKK certified buttons. Our two-way zip sleepsuits feature a protective fabric zipper guard to prevent pinching delicate baby skin.',
  },
  {
    category: 'SIZING',
    q: 'How do I choose the right size for a newborn?',
    a: 'We recommend sizing by baby’s height and weight rather than age alone. For newborns arriving around 2.5 kg to 3.5 kg, our 0–3M (NB) size offers a cozy, non-constricting fit. Check our detailed interactive Size Guide for centimeter and kilogram charts.',
  },
  {
    category: 'SIZING',
    q: 'Do your garments allow room for cloth diapers?',
    a: 'Yes! All our rompers, footies, and bottoms are cut with extra ease around the diaper gusset, making them fully compatible with both modern cloth diapers and disposable diapers.',
  },
  {
    category: 'SHIPPING',
    q: 'What are the delivery charges and timelines?',
    a: `We provide FREE express shipping on all orders above ₹${BRAND.freeShippingThreshold}. Orders below ₹${BRAND.freeShippingThreshold} carry a flat ₹${BRAND.standardShippingFee} shipping charge. Most orders are dispatched from our Rajkot workshop within 24 hours and delivered in 2 to 5 business days.`,
  },
  {
    category: 'SHIPPING',
    q: 'How can I track my parcel?',
    a: 'As soon as your parcel is handed to Delhivery, Blue Dart, or India Post, you will receive an SMS and email with your AWB tracking link. You can also enter your order number on our Track Order page anytime.',
  },
  {
    category: 'RETURNS',
    q: 'How does the 7-day exchange and return policy work?',
    a: 'If a size doesn’t fit, simply WhatsApp us at +91 9824951223 or email Anantnewborn@gmail.com within 7 days of delivery. We arrange a reverse pickup from your doorstep and promptly dispatch the replacement size.',
  },
  {
    category: 'CARE',
    q: 'How should I wash Little Cuckoo organic cotton garments?',
    a: 'Machine wash on gentle cycle with cold or lukewarm water using a mild, baby-safe liquid detergent. Avoid harsh chlorine bleaches. Line dry in the shade to maintain the natural softness of the combed cotton fibers.',
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesTab = activeTab === 'ALL' || faq.category === activeTab;
    const matchesSearch =
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Help & Parent Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-cocoa-500">
          Everything you need to know about our organic combed cotton, sizing, dispatch, and gentle care.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-cocoa-400 absolute left-4 top-5 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. organic, sizing, wash, return)..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-cocoa-500/20 bg-white text-xs text-charcoal-700 shadow-soft focus:outline-none focus:border-strawberry-400 focus:ring-1 focus:ring-strawberry-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'ALL', label: 'All Questions' },
          { id: 'FABRIC', label: 'Organic Fabrics' },
          { id: 'SIZING', label: 'Sizing & Fit' },
          { id: 'SHIPPING', label: 'Shipping & Delivery' },
          { id: 'RETURNS', label: 'Returns & Exchanges' },
          { id: 'CARE', label: 'Wash Care' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-strawberry-400 text-white shadow-xs'
                : 'bg-white border border-cocoa-500/10 text-cocoa-600 hover:bg-vanilla-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base text-charcoal-700 font-semibold hover:text-strawberry-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cocoa-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-strawberry-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-cocoa-500 leading-relaxed border-t border-cocoa-500/5 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-cocoa-500/10 text-xs text-cocoa-400">
            No matching questions found for &ldquo;{search}&rdquo;. You can contact our support team directly.
          </div>
        )}
      </div>

      {/* Direct Contact Callout */}
      <div className="p-6 rounded-3xl bg-vanilla-200/80 border border-cocoa-500/10 text-center space-y-2">
        <p className="font-serif text-sm font-bold text-charcoal-700">Still have a question?</p>
        <p className="text-xs text-cocoa-500">
          Our Rajkot customer support team is happy to assist you with baby sizing or order questions.
        </p>
        <div className="pt-1">
          <a
            href="/contact"
            className="inline-block px-5 py-2 rounded-full bg-charcoal-700 text-white font-bold text-xs hover:bg-charcoal-800 transition-colors"
          >
            Contact Customer Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
