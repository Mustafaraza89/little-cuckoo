'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="py-3 px-6 rounded-full bg-white hover:bg-vanilla-200 border border-cocoa-500/20 text-charcoal-700 font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs print:hidden"
    >
      <Printer className="w-4 h-4 text-strawberry-500" />
      <span>Print Official Tax Invoice</span>
    </button>
  );
}
