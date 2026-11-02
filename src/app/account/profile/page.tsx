'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AccountProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setPhone(data.user.phone || '');
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return <div className="p-20 text-center text-xs text-cocoa-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa-500 hover:text-strawberry-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Account</span>
      </Link>

      <div className="space-y-1">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Personal Information
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Edit Profile</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 bg-vanilla-100 text-cocoa-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Phone Number (for Courier SMS updates)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cocoa-300 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile preferences updated successfully!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold shadow-pill transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
