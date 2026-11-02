'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send, ShieldCheck } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    // Simulate / persist newsletter subscription
    setTimeout(() => {
      setStatus('success');
      setMessage('Welcome to the Little Cuckoo family! Use code WELCOME10 for 10% off.');
      setEmail('');
    }, 600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-4xl sm:rounded-5xl overflow-hidden bg-gradient-to-br from-vanilla-200 via-vanilla-100 to-strawberry-100/60 p-8 sm:p-14 lg:p-16 border border-cocoa-500/10 shadow-soft text-center">
        {/* Decorative Background Elements */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-strawberry-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-babyblue-200/30 blur-2xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-strawberry-200/60 shadow-xs text-xs font-semibold text-strawberry-600">
            <Sparkles className="w-3.5 h-3.5 text-strawberry-400" />
            <span>Join 15,000+ Mindful Parents</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-700 leading-tight">
            Little Updates, Lovely Surprises.
          </h2>

          <p className="text-xs sm:text-sm text-cocoa-500 leading-relaxed max-w-lg mx-auto">
            Subscribe for private spring drops, pediatrician-reviewed newborn dressing guides, and an instant <strong>10% welcome bonus</strong> on your first order.
          </p>

          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email for 10% off..."
                    className="w-full pl-10 pr-4 py-3 bg-white text-xs text-charcoal-700 placeholder:text-cocoa-300 rounded-full border border-cocoa-500/15 focus:outline-none focus:border-strawberry-400 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="py-3 px-7 rounded-full bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-xs shadow-pill transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{status === 'loading' ? 'Joining...' : 'Get 10% Off'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {status === 'error' && (
                <p className="text-[11px] text-rose-600 font-semibold mt-2">{message}</p>
              )}
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-cocoa-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-500" />
              <span>Zero Spam Guarantee</span>
            </span>
            <span>•</span>
            <span>Unsubscribe Anytime with 1-Click</span>
          </div>
        </div>
      </div>
    </section>
  );
}
