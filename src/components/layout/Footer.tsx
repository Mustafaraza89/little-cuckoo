import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Instagram,
  Facebook
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-cocoa-500 text-vanilla-100 pt-16 pb-10 border-t-4 border-strawberry-400">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-cocoa-300/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-strawberry-400/20 text-strawberry-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">100% Organic GOTS</h4>
              <p className="text-xs text-cocoa-300">Hypoallergenic & baby-safe</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-babyblue-500/20 text-babyblue-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Azo-Free & Non-Toxic</h4>
              <p className="text-xs text-cocoa-300">Zero skin irritation or rashes</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-butter-300/20 text-butter-300 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Pan-India Delivery</h4>
              <p className="text-xs text-cocoa-300">Free shipping on orders &gt; ₹999</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-mint-300/20 text-mint-300 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">7-Day Easy Exchange</h4>
              <p className="text-xs text-cocoa-300">Hassle-free size replacement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-48 h-12">
              <Image
                src="/logo/little_cuckoo_light.svg"
                alt="Little Cuckoo — Made for Little Wonders"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs leading-relaxed text-cocoa-300 max-w-sm">
              Crafted with heartfelt motherly tenderness. We manufacture wholesome, silky-soft organic cotton apparel designed to protect your baby's delicate skin from day one.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-cocoa-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-strawberry-400 shrink-0" />
                <span>{BRAND.address.line1}, {BRAND.address.road}, {BRAND.address.city}, {BRAND.address.state} - {BRAND.address.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-strawberry-400 shrink-0" />
                <span>Customer Care: {BRAND.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-strawberry-400 shrink-0" />
                <span>{BRAND.email}</span>
              </p>
            </div>

            <div className="pt-2 text-[11px] text-cocoa-300/80 bg-cocoa-700/40 p-3 rounded-xl border border-cocoa-300/10">
              <p className="font-semibold text-vanilla-200">Legal & Tax Compliance:</p>
              <p>M/s {BRAND.legalName} (Prop. {BRAND.proprietor})</p>
              <p>GSTIN: <span className="font-mono text-white">{BRAND.gstin}</span> | UDYAM: <span className="font-mono text-white">{BRAND.udyam}</span></p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base text-white mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-cocoa-300">
              <li><Link href="/shop?category=newborn-essentials" className="hover:text-strawberry-300 transition-colors">Newborn Essentials (0-3M)</Link></li>
              <li><Link href="/shop?category=rompers-and-bodysuits" className="hover:text-strawberry-300 transition-colors">Organic Rompers & Bodysuits</Link></li>
              <li><Link href="/shop?category=sleepwear-and-swaddles" className="hover:text-strawberry-300 transition-colors">Bamboo & Cotton Sleepwear</Link></li>
              <li><Link href="/shop?category=dresses-and-sets" className="hover:text-strawberry-300 transition-colors">Frocks & Heirloom Dresses</Link></li>
              <li><Link href="/shop?category=gift-hampers-and-bundles" className="hover:text-strawberry-300 transition-colors">Baby Shower Gift Hampers</Link></li>
              <li><Link href="/shop" className="hover:text-strawberry-300 transition-colors">View All Collections</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-base text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-cocoa-300">
              <li><Link href="/track-order" className="hover:text-strawberry-300 transition-colors">Track Your Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-strawberry-300 transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-strawberry-300 transition-colors">Returns & Exchanges Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-strawberry-300 transition-colors">Refund Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-strawberry-300 transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/size-guide" className="hover:text-strawberry-300 transition-colors">Baby Size Guide</Link></li>
              <li><Link href="/faqs" className="hover:text-strawberry-300 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-strawberry-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-strawberry-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-strawberry-300 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-serif text-base text-white mb-4">Join Our Little Family</h4>
            <p className="text-xs text-cocoa-300 mb-3 leading-relaxed">
              Subscribe to get ₹150 off your first purchase, gentle parenting tips, and new pastel drop alerts.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Welcome to Little Cuckoo! Code WELCOME10 copied.'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter parent email address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-cocoa-700/60 border border-cocoa-300/30 text-white text-xs placeholder:text-cocoa-300 focus:outline-none focus:border-strawberry-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-strawberry-400 hover:bg-strawberry-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-pill"
              >
                Get ₹150 Off First Order
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-cocoa-300/20 text-center sm:flex sm:justify-between sm:items-center text-xs text-cocoa-300">
        <p>© {new Date().getFullYear()} {BRAND.name}. All Rights Reserved. Handcrafted in Rajkot, India.</p>
        <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-strawberry-400 fill-strawberry-400" />
          <span>for little wonders</span>
        </p>
      </div>
    </footer>
  );
}
