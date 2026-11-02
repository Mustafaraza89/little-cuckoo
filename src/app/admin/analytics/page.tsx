'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Percent, 
  Sparkles,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Business Intelligence
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Analytics & Insights</h1>
          <p className="text-xs text-cocoa-500">
            Real-time sales velocity, order metrics, customer cohorts, and category distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-white border border-cocoa-500/10 text-xs text-cocoa-600 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cocoa-400" />
            <span>Last 30 Days</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-cocoa-400">
            <span>Gross Revenue</span>
            <span className="text-emerald-600 font-bold flex items-center">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-serif text-charcoal-700 font-bold">₹1,84,520</p>
          <p className="text-[11px] text-cocoa-400">vs. ₹1,55,800 last month</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-cocoa-400">
            <span>Total Orders</span>
            <span className="text-emerald-600 font-bold flex items-center">
              +12.1% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-serif text-charcoal-700 font-bold">218</p>
          <p className="text-[11px] text-cocoa-400">Average 7.2 orders/day</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-cocoa-400">
            <span>Average Order Value</span>
            <span className="text-emerald-600 font-bold flex items-center">
              +5.6% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-serif text-charcoal-700 font-bold">₹846</p>
          <p className="text-[11px] text-cocoa-400">Driven by gift bundles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-cocoa-400">
            <span>Customer Return Rate</span>
            <span className="text-emerald-600 font-bold">0.6%</span>
          </div>
          <p className="text-2xl font-serif text-charcoal-700 font-bold">Industry Best</p>
          <p className="text-[11px] text-cocoa-400">0 skin irritations reported</p>
        </div>
      </div>

      {/* Category Performance & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Share */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
          <h3 className="font-serif text-lg text-charcoal-700 font-bold">Sales by Category</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Newborn Essentials</span>
                <span>44% (₹81,188)</span>
              </div>
              <div className="h-2 rounded-full bg-vanilla-200 overflow-hidden">
                <div className="h-full bg-strawberry-400 rounded-full" style={{ width: '44%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Rompers & Bodysuits</span>
                <span>28% (₹51,665)</span>
              </div>
              <div className="h-2 rounded-full bg-vanilla-200 overflow-hidden">
                <div className="h-full bg-babyblue-400 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Gift Hampers & Bundles</span>
                <span>16% (₹29,523)</span>
              </div>
              <div className="h-2 rounded-full bg-vanilla-200 overflow-hidden">
                <div className="h-full bg-butter-400 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Sleepwear & Swaddles</span>
                <span>12% (₹22,142)</span>
              </div>
              <div className="h-2 rounded-full bg-vanilla-200 overflow-hidden">
                <div className="h-full bg-mint-400 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
          <h3 className="font-serif text-lg text-charcoal-700 font-bold">Top Performing Styles</h3>
          <div className="space-y-3">
            {[
              {
                title: 'CloudSoft Organic Cotton Ribbed Romper',
                units: 94,
                revenue: 65706,
                growth: '+22%',
              },
              {
                title: 'Newborn Welcome To The World 5-Piece Organic Set',
                units: 42,
                revenue: 62958,
                growth: '+31%',
              },
              {
                title: 'Buttercup Yellow Zip Sleepsuit',
                units: 56,
                revenue: 44744,
                growth: '+14%',
              },
              {
                title: 'Sweet Pea Muslin Swaddle Duo Pack',
                units: 38,
                revenue: 22762,
                growth: '+9%',
              },
            ].map((prod, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-vanilla-50/70 border border-cocoa-500/10 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-charcoal-700">{prod.title}</p>
                  <p className="text-[11px] text-cocoa-400">{prod.units} units shipped</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-charcoal-700">{formatPrice(prod.revenue)}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">{prod.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
