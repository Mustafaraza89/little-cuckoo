import React from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Baby Clothing Size & Fitting Guide | Little Cuckoo',
  description: 'Find the ideal fit for your baby from newborn (0-3M) up to 2-3 years in Little Cuckoo organic cotton apparel.',
};

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Find The Perfect Fit
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Baby Size Guide</h1>
        <p className="text-xs text-cocoa-500 max-w-lg mx-auto">
          Our garments are crafted from natural combed organic cotton with flexible ribbed stretch for maximum room to kick and crawl.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 shadow-soft space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-cocoa-500/10 rounded-2xl overflow-hidden">
            <thead className="bg-vanilla-200 font-bold text-charcoal-700">
              <tr>
                <th className="py-3 px-4">Size Label</th>
                <th className="py-3 px-4">Approx Age</th>
                <th className="py-3 px-4">Weight (kg)</th>
                <th className="py-3 px-4">Baby Length (cm)</th>
                <th className="py-3 px-4">Chest (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10">
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">Newborn (NB)</td><td className="py-3 px-4">0 to 1 Month</td><td className="py-3 px-4">Up to 3.5 kg</td><td className="py-3 px-4">Up to 52 cm</td><td className="py-3 px-4">36 cm</td></tr>
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">0-3 Months</td><td className="py-3 px-4">1 to 3 Months</td><td className="py-3 px-4">3.5 – 5.5 kg</td><td className="py-3 px-4">52 – 62 cm</td><td className="py-3 px-4">40 cm</td></tr>
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">3-6 Months</td><td className="py-3 px-4">3 to 6 Months</td><td className="py-3 px-4">5.5 – 7.5 kg</td><td className="py-3 px-4">62 – 68 cm</td><td className="py-3 px-4">44 cm</td></tr>
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">6-12 Months</td><td className="py-3 px-4">6 to 12 Months</td><td className="py-3 px-4">7.5 – 10.0 kg</td><td className="py-3 px-4">68 – 76 cm</td><td className="py-3 px-4">47 cm</td></tr>
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">12-18 Months</td><td className="py-3 px-4">12 to 18 Months</td><td className="py-3 px-4">10.0 – 12.0 kg</td><td className="py-3 px-4">76 – 84 cm</td><td className="py-3 px-4">50 cm</td></tr>
              <tr className="hover:bg-vanilla-50"><td className="py-3 px-4 font-bold text-strawberry-600">18-24 Months</td><td className="py-3 px-4">18 to 24 Months</td><td className="py-3 px-4">12.0 – 14.0 kg</td><td className="py-3 px-4">84 – 92 cm</td><td className="py-3 px-4">53 cm</td></tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-vanilla-100 text-xs text-cocoa-500 space-y-2">
          <h4 className="font-bold text-charcoal-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-strawberry-400" />
            <span>Sizing Tips from our Pediatric Tailors</span>
          </h4>
          <p>
            • If your baby is between two sizes, always opt for the larger size so they enjoy months of comfortable wear.
          </p>
          <p>
            • All our rompers include 2-way stretch and generous diaper gussets designed to accommodate both cloth diapers and disposable diapers comfortably.
          </p>
        </div>
      </div>
    </div>
  );
}
