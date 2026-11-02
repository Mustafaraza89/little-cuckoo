'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@littlecuckoo.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
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
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER'];
      if (!adminRoles.includes(data.user.role)) {
        throw new Error('Access denied: Ordinary customer accounts cannot access the admin console.');
      }

      // Successful admin login -> redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vanilla-200 via-vanilla-100 to-strawberry-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="relative w-44 h-12">
            <Image
              src="/logo/little_cuckoo_horizontal.svg"
              alt="Little Cuckoo Admin"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-strawberry-100/80 border border-strawberry-200 text-strawberry-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-strawberry-500" />
            <span>Admin Management Console</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-700">
            Internal Staff Sign In
          </h2>
          <p className="text-xs text-cocoa-500">
            Restricted to authorized Little Cuckoo & Anant Garments personnel
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-cocoa-500/10 shadow-lift space-y-6">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cocoa-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@littlecuckoo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400 focus:ring-1 focus:ring-strawberry-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cocoa-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400 focus:ring-1 focus:ring-strawberry-400"
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
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Box */}
          <div className="pt-4 border-t border-cocoa-500/10 text-xs text-cocoa-500 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-charcoal-700">
              <KeyRound className="w-3.5 h-3.5 text-strawberry-500" />
              <span>Default Credentials:</span>
            </div>
            <div className="p-2.5 rounded-xl bg-vanilla-200 font-mono text-[11px] text-cocoa-600 flex justify-between items-center">
              <span>admin@littlecuckoo.com</span>
              <span className="text-cocoa-400">admin123</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa-500 hover:text-strawberry-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
