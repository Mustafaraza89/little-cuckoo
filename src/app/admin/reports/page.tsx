'use client';

import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, Calendar, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Tax & Compliance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Financial & GST Reports</h1>
          <p className="text-xs text-cocoa-500">
            Export monthly sales summaries, GST tax liability breakdowns (HSN 6111), and accounting ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-cocoa-500/20 text-xs font-bold text-cocoa-600 hover:bg-vanilla-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => alert('Exporting GSTR-1 CSV ledger for ' + selectedMonth)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV (GSTR-1)</span>
          </button>
        </div>
      </div>

      {/* Legal Entity Card */}
      <div className="p-5 rounded-3xl bg-vanilla-200/80 border border-cocoa-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-bold text-charcoal-700 text-sm">{BRAND.legalName} (Little Cuckoo)</p>
          <p className="text-cocoa-500">Proprietor: {BRAND.proprietor}</p>
          <p className="text-cocoa-500">
            {BRAND.address.line1}, {BRAND.address.road}, {BRAND.address.city}, {BRAND.address.state} - {BRAND.address.pincode}
          </p>
        </div>
        <div className="space-y-1 text-right sm:border-l sm:border-cocoa-500/10 sm:pl-6">
          <p className="font-mono font-bold text-charcoal-700">GSTIN: {BRAND.gstin}</p>
          <p className="font-mono text-cocoa-500">UDYAM: {BRAND.udyam}</p>
          <p className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active GST Registered Entity</span>
          </p>
        </div>
      </div>

      {/* Tax Breakdown Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-cocoa-500/10 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-charcoal-700">
            GST Ledger Summary — {selectedMonth}
          </h3>
          <span className="text-xs font-mono bg-vanilla-100 px-2.5 py-1 rounded-lg text-cocoa-600">
            HSN Chapter 6111 (Baby Clothing & Apparel — 5% Rate)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100 text-charcoal-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="p-4">Tax Head</th>
                <th className="p-4">Applicable Rate</th>
                <th className="p-4">Taxable Value</th>
                <th className="p-4">Tax Amount Collected</th>
                <th className="p-4 text-right">Net Remittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10 text-cocoa-600">
              <tr>
                <td className="p-4 font-bold text-charcoal-700">CGST (Intrastate - Gujarat)</td>
                <td className="p-4">2.5%</td>
                <td className="p-4">₹48,200.00</td>
                <td className="p-4 font-semibold text-charcoal-700">₹1,205.00</td>
                <td className="p-4 text-right font-mono font-bold text-charcoal-700">₹1,205.00</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-charcoal-700">SGST (Intrastate - Gujarat)</td>
                <td className="p-4">2.5%</td>
                <td className="p-4">₹48,200.00</td>
                <td className="p-4 font-semibold text-charcoal-700">₹1,205.00</td>
                <td className="p-4 text-right font-mono font-bold text-charcoal-700">₹1,205.00</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-charcoal-700">IGST (Interstate - Rest of India)</td>
                <td className="p-4">5.0%</td>
                <td className="p-4">₹1,27,500.00</td>
                <td className="p-4 font-semibold text-charcoal-700">₹6,375.00</td>
                <td className="p-4 text-right font-mono font-bold text-charcoal-700">₹6,375.00</td>
              </tr>
              <tr className="bg-vanilla-100/60 font-bold text-charcoal-700">
                <td className="p-4">Total GST Liability</td>
                <td className="p-4">5% Blend</td>
                <td className="p-4">₹1,75,700.00</td>
                <td className="p-4">₹8,785.00</td>
                <td className="p-4 text-right font-mono text-strawberry-600 text-sm">₹8,785.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
