'use client';

import React from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-strawberry-400 via-strawberry-500 to-strawberry-400 text-white text-xs py-2 px-4 font-medium tracking-wide shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-butter-300" />
          <span>Free Pan-India Shipping on Orders Above ₹999</span>
        </div>

        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-butter-300 animate-pulse" />
          <span className="font-semibold">5% Extra Instant Discount on Prepaid UPI Orders</span>
          <span className="hidden sm:inline opacity-80">| Code: <strong>CUCKOO5</strong></span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-mint-300" />
          <span>100% GOTS Certified Organic Cotton</span>
        </div>
      </div>
    </div>
  );
}
