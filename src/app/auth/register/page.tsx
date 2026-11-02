'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Join Little Cuckoo
        </span>
        <h1 className="font-serif text-3xl text-charcoal-700">Create Parent Account</h1>
        <p className="text-xs text-cocoa-500">
          Save addresses, track your baby apparel orders, and enjoy member-only pastel drops.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-5">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Your Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parent Full Name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-xs shadow-pill transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-cocoa-500/10 text-center text-xs text-cocoa-500">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="font-bold text-strawberry-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
