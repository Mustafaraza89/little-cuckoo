'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password');
      }

      // Check role
      if (['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER'].includes(data.user.role)) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Welcome Back
        </span>
        <h1 className="font-serif text-3xl text-charcoal-700">Account Login</h1>
        <p className="text-xs text-cocoa-500">
          Sign in to access your orders, saved addresses, and wishlist.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-xs font-bold text-charcoal-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-cocoa-500/10 text-center text-xs text-cocoa-500">
          <span>New to Little Cuckoo? </span>
          <Link href="/auth/register" className="font-bold text-strawberry-600 hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="p-3 rounded-xl bg-vanilla-100 text-[11px] text-cocoa-500 text-center">
          <p className="font-bold text-charcoal-700">Demo Accounts Available:</p>
          <p>Admin: <code>admin@littlecuckoo.com</code> / <code>Admin@LittleCuckoo2026</code></p>
          <p>Parent: <code>priya.patel@example.com</code> / <code>Parent@Cuckoo2026</code></p>
        </div>
      </div>
    </div>
  );
}
