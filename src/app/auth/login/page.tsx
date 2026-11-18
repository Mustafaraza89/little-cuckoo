'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVerified = searchParams.get('verified') === 'true';
  const prefillEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState(isVerified);

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
    if (isVerified) {
      setSuccessBanner(true);
    }
  }, [prefillEmail, isVerified]);

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
        {/* Verification Success Banner */}
        {successBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Account Confirmed & Verified!</p>
              <p className="text-emerald-700">
                Your credentials are now active. Please sign in below with your password.
              </p>
            </div>
          </div>
        )}

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
            className="w-full py-3 rounded-full bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-xs shadow-pill transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cocoa-500/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-white px-3 text-cocoa-400 font-bold">Or</span>
          </div>
        </div>

        <GoogleSignInButton redirectTo="/account" label="Sign in with Google" />

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-8 h-8 border-3 border-strawberry-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
