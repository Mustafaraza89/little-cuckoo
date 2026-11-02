'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Sizing Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          We are Here to Help
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-700">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-500 leading-relaxed">
          Have questions about baby sizing, hospital bag essentials, or your order? Connect with our dedicated support team in Rajkot, Gujarat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information & Factory Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-vanilla-100 rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 space-y-6 shadow-soft">
            <h2 className="font-serif text-xl text-charcoal-700">
              Manufacturing & Corporate HQ
            </h2>

            <div className="space-y-4 text-xs text-charcoal-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-strawberry-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-charcoal-700">{BRAND.legalName}</p>
                  <p className="text-cocoa-500">{BRAND.address.line1}, {BRAND.address.road}</p>
                  <p className="text-cocoa-500">{BRAND.address.city}, {BRAND.address.state} — {BRAND.address.pincode}</p>
                  <span className="inline-block mt-1 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-cocoa-500/10 text-cocoa-600">
                    GSTIN: {BRAND.gstin}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-strawberry-500 shrink-0" />
                <div>
                  <p className="font-bold">Customer Helpline & WhatsApp</p>
                  <a href={`tel:${BRAND.phone}`} className="text-cocoa-500 hover:text-strawberry-600 font-mono">
                    {BRAND.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-strawberry-500 shrink-0" />
                <div>
                  <p className="font-bold">Official Email Support</p>
                  <a href={`mailto:${BRAND.email}`} className="text-cocoa-500 hover:text-strawberry-600">
                    {BRAND.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-strawberry-500 shrink-0" />
                <div>
                  <p className="font-bold">Operating Hours</p>
                  <p className="text-cocoa-500">Monday to Saturday: 9:30 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-strawberry-50/70 rounded-3xl p-6 border border-strawberry-200/50 flex items-start gap-3 text-xs text-cocoa-700">
            <Sparkles className="w-5 h-5 text-strawberry-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-strawberry-800">Direct From Manufacturer</p>
              <p className="text-cocoa-500 mt-0.5">
                All Little Cuckoo baby apparel is stitched under strict hygiene standards at our own workshop in Rajkot. No middlemen, purest organic cotton.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-cocoa-500/10 shadow-soft">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal-700">Thank you for reaching out!</h3>
              <p className="text-xs text-cocoa-500 max-w-sm mx-auto">
                Our care team at Rajkot has received your message and will respond within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="py-2.5 px-6 rounded-full bg-vanilla-200 hover:bg-strawberry-400 hover:text-white text-charcoal-700 text-xs font-bold transition-all"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <h3 className="font-serif text-xl text-charcoal-700 mb-2">Send Us a Direct Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Priya Patel"
                    className="w-full px-3.5 py-2.5 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full px-3.5 py-2.5 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  >
                    <option value="Order & Sizing Inquiry">Order & Sizing Inquiry</option>
                    <option value="Shipping & Delivery Status">Shipping & Delivery Status</option>
                    <option value="Bulk & Gift Hamper Customization">Bulk & Gift Hamper Customization</option>
                    <option value="Feedback & Craftsmanship">Feedback & Craftsmanship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-cocoa-700 mb-1">How can we assist you? *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about the baby's age or your query..."
                  className="w-full px-3.5 py-2.5 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-8 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
