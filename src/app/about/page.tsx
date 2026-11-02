import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Leaf, Sparkles, MapPin, Award } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Our Story & Rajkot Craftsmanship | Little Cuckoo',
  description: 'Learn about Little Cuckoo and our in-house manufacturing unit Anant Garments in Rajkot, Gujarat.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Handcrafted in Gujarat, India
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-700 leading-tight">
          A Tender Promise <br />
          <span className="text-strawberry-400 italic">For Little Wonders.</span>
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-500 leading-relaxed">
          Little Cuckoo was born from a mother's uncompromising instinct: that baby clothes should never be stiff, chemical-laden, or synthetic. They should feel like the purest, warmest hug in the world.
        </p>
      </div>

      {/* Origin Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-card border-4 border-white bg-vanilla-200">
          <Image
            src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1000&q=85"
            alt="Little Cuckoo Fabric Inspection"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-cocoa-500 leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-700 leading-snug">
            Our Manufacturing Roots at Anant Garments
          </h2>
          <p>
            Unlike modern digital fashion brands that white-label cheap garments from anonymous overseas aggregators, Little Cuckoo is powered by our own registered manufacturing enterprise, <strong>ANANT GARMENTS</strong>, located in the historic textile hub of <strong>Rajkot, Gujarat</strong>.
          </p>
          <p>
            Every single roll of combed yarn is knitted, dyed with non-toxic botanical colors, and meticulously stitched under the direct oversight of our founder, <strong>Vadaliya Bhimjibhai Muljibhai</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-vanilla-200/80 border border-cocoa-500/10 text-xs text-charcoal-700 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-strawberry-600">
              <MapPin className="w-4 h-4" />
              <span>Official Registered Manufacturing Unit:</span>
            </p>
            <p>First Floor, Shakti Krupa, Nr. Lathiya Garage, Gondal Road, Vikas Gruh, Rajkot, Gujarat - 360002</p>
            <p className="text-cocoa-500 text-[11px]">UDYAM Registration: <strong>{BRAND.udyam}</strong> | GSTIN: <strong>{BRAND.gstin}</strong></p>
          </div>
        </div>
      </div>

      {/* The 4 Little Cuckoo Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">Our Non-Negotiables</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-700 mt-1">Why Parents Trust Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-strawberry-100 text-strawberry-500 flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base text-charcoal-700">100% GOTS Organic</h4>
            <p className="text-xs text-cocoa-500">
              Only long-staple combed cotton free of chemical pesticides and synthetic fertilizers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-babyblue-100 text-babyblue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base text-charcoal-700">Non-Toxic Azo-Free</h4>
            <p className="text-xs text-cocoa-500">
              Every pastel hue is dyed with certified safe pigments that prevent skin irritation and eczema.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-butter-200 text-charcoal-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base text-charcoal-700">Nickel-Free Snaps</h4>
            <p className="text-xs text-cocoa-500">
              Pry-resistant Japanese YKK snaps that never rust or cause allergic contact dermatitis.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-mint-200 text-mint-800 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base text-charcoal-700">Flat-Lock Seams</h4>
            <p className="text-xs text-cocoa-500">
              Stitched smooth to sit flat against delicate baby skin with zero scratchy tags.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
