'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Gift,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SafeImage from '@/components/ui/SafeImage';
import { BRAND } from '@/lib/constants';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

const MEGA_CATEGORIES = [
  {
    title: 'Newborn Essentials (0-6M)',
    items: [
      { label: 'Kimono Tie Onesies', href: '/shop?category=newborn-essentials' },
      { label: 'Two-Way Zip Sleepsuits', href: '/shop?category=sleepwear-and-swaddles' },
      { label: 'Swaddle Wraps & Caps', href: '/shop?category=sleepwear-and-swaddles' },
      { label: 'Organic Cotton Mittens & Booties', href: '/shop?category=accessories-and-bibs' },
      { label: 'Newborn Hospital Starter Hamper', href: '/shop?category=gift-hampers-and-bundles' },
    ],
  },
  {
    title: 'Baby & Toddler Outfits',
    items: [
      { label: 'Pure Cotton Rompers', href: '/shop?category=rompers-and-bodysuits' },
      { label: 'Hand-Smocked Floral Dresses', href: '/shop?category=dresses-and-sets' },
      { label: 'Waffle Knit Co-ord Sets', href: '/shop?category=dresses-and-sets' },
      { label: 'Overalls & Dungarees', href: '/shop?category=rompers-and-bodysuits' },
      { label: 'Everyday Ribbed Bodysuits', href: '/shop?category=rompers-and-bodysuits' },
    ],
  },
  {
    title: 'Shop By Special Edits',
    items: [
      { label: '100% GOTS Organic Cotton', href: '/shop?badge=organic' },
      { label: 'Spring Ice Cream Pastels', href: '/shop?badge=pastels' },
      { label: 'Gender-Neutral Earthy Neutrals', href: '/shop?gender=unisex' },
      { label: 'Baby Shower & Birthday Gift Boxes', href: '/shop?category=gift-hampers-and-bundles' },
      { label: 'Best Sellers of the Season', href: '/shop?sort=bestseller' },
    ],
  },
];

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('categories');
  const [cartAnimate, setCartAnimate] = useState(false);
  const pathname = usePathname();

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  // Animate cart badge on count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft py-2.5 sm:py-3'
            : 'bg-vanilla-100 py-3 sm:py-4 border-b border-cocoa-500/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile / Tablet Left: Hamburger + Quick Search */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 -ml-1 text-charcoal-700 hover:text-strawberry-500 rounded-lg hover:bg-vanilla-200/50 transition-colors focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-1.5 sm:p-2 text-charcoal-700 hover:text-strawberry-500 rounded-lg hover:bg-vanilla-200/50 transition-colors focus:outline-none"
                aria-label="Search catalog"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Brand Logo - Responsive Sizing for 320px to 1920px */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left min-w-0">
              <Link href="/" className="inline-flex items-center group">
                <div className="relative w-28 xs:w-36 sm:w-44 md:w-48 h-7 sm:h-9 transition-transform group-hover:scale-[1.02]">
                  <Image
                    src="/logo/little_cuckoo_horizontal.svg"
                    alt="Little Cuckoo — Made for Little Wonders"
                    fill
                    className="object-contain object-center lg:object-left"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
              {/* Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link
                  href="/shop"
                  className={`text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 py-1.5 ${
                    pathname.startsWith('/shop') ? 'text-strawberry-500' : 'text-charcoal-700 hover:text-strawberry-500'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </Link>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-full -left-12 w-[820px] xl:w-[920px] bg-white rounded-3xl shadow-xl border border-cocoa-500/10 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-12 gap-6">
                      {/* 3 Categories Columns */}
                      <div className="col-span-8 grid grid-cols-3 gap-5">
                        {MEGA_CATEGORIES.map((catGroup, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-xs font-bold text-cocoa-700 uppercase tracking-wider border-b border-cocoa-500/10 pb-1.5">
                              {catGroup.title}
                            </h4>
                            <ul className="space-y-2">
                              {catGroup.items.map((item, i) => (
                                <li key={i}>
                                  <Link
                                    href={item.href}
                                    className="text-xs text-charcoal-600 hover:text-strawberry-500 hover:translate-x-1 transition-all inline-block py-0.5"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Bottom Feature Badges */}
                        <div className="col-span-3 pt-3 mt-2 border-t border-cocoa-500/10 flex items-center justify-between text-[11px] text-cocoa-500">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-mint-500" />
                            <span>100% Certified Organic Cotton</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-strawberry-400" />
                            <span>Complimentary Luxury Gift Box</span>
                          </span>
                        </div>
                      </div>

                      {/* Editorial Featured Card */}
                      <div className="col-span-4 bg-vanilla-100 rounded-2xl p-4 flex flex-col justify-between border border-cocoa-500/5">
                        <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-white">
                          <SafeImage
                            src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=85"
                            alt="Little Cuckoo Spring Edition"
                            fill
                            className="object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-strawberry-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            New In
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-strawberry-500 uppercase tracking-wider">Spring 2026</p>
                          <h5 className="font-serif text-sm font-semibold text-charcoal-700 mt-0.5">
                            Ice Cream Palette Pastels
                          </h5>
                          <p className="text-xs text-cocoa-500 mt-1 line-clamp-2">
                            Ultra-soft newborn pieces tailored with hypoallergenic flatlock seams in Rajkot, Gujarat.
                          </p>
                        </div>
                        <Link
                          href="/shop?badge=new-arrival"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 group"
                        >
                          <span>Explore Fresh Drops</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Navigation Links */}
              <Link
                href="/shop?category=newborn-essentials"
                className={`text-xs xl:text-sm font-semibold transition-colors hover:text-strawberry-500 py-1 ${
                  pathname.includes('newborn-essentials') ? 'text-strawberry-500' : 'text-charcoal-700'
                }`}
              >
                Newborn
              </Link>
              <Link
                href="/shop?category=rompers-and-bodysuits"
                className={`text-xs xl:text-sm font-semibold transition-colors hover:text-strawberry-500 py-1 ${
                  pathname.includes('rompers-and-bodysuits') ? 'text-strawberry-500' : 'text-charcoal-700'
                }`}
              >
                Rompers
              </Link>
              <Link
                href="/shop?category=sleepwear-and-swaddles"
                className={`text-xs xl:text-sm font-semibold transition-colors hover:text-strawberry-500 py-1 ${
                  pathname.includes('sleepwear-and-swaddles') ? 'text-strawberry-500' : 'text-charcoal-700'
                }`}
              >
                Sleepwear
              </Link>
              <Link
                href="/shop?category=gift-hampers-and-bundles"
                className={`text-xs xl:text-sm font-semibold transition-colors hover:text-strawberry-500 py-1 ${
                  pathname.includes('gift-hampers-and-bundles') ? 'text-strawberry-500' : 'text-charcoal-700'
                }`}
              >
                Gift Sets
              </Link>
              <Link
                href="/about"
                className={`text-xs xl:text-sm font-semibold transition-colors hover:text-strawberry-500 py-1 ${
                  pathname === '/about' ? 'text-strawberry-500' : 'text-charcoal-700'
                }`}
              >
                Our Story
              </Link>
            </nav>

            {/* Right Action Icons & Cart */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {/* Desktop Search Pill */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden xl:flex items-center gap-2 text-xs font-medium text-cocoa-500 bg-white border border-cocoa-500/15 hover:border-strawberry-300 rounded-full py-1.5 px-3 transition-colors shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-strawberry-400" />
                <span>Search rompers, dresses...</span>
                <kbd className="text-[10px] bg-vanilla-200 px-1.5 py-0.5 rounded text-cocoa-500 font-mono">⌘K</kbd>
              </button>

              {/* Tablet Search Icon (shown on md/lg, hidden on mobile and xl) */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden md:flex xl:hidden p-2 text-charcoal-700 hover:text-strawberry-500 rounded-full hover:bg-vanilla-200/60 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-1.5 sm:p-2 text-charcoal-700 hover:text-strawberry-500 relative rounded-full hover:bg-vanilla-200/60 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-strawberry-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account Icon (hidden on 320px-480px, in mobile menu) */}
              <Link
                href="/account"
                className="hidden sm:inline-flex p-2 text-charcoal-700 hover:text-strawberry-500 rounded-full hover:bg-vanilla-200/60 transition-colors"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Bag Pill */}
              <button
                type="button"
                onClick={onOpenCart}
                className={`flex items-center gap-1.5 sm:gap-2 bg-strawberry-400 hover:bg-strawberry-500 text-white rounded-full py-1.5 px-2.5 sm:px-3.5 shadow-pill transition-all transform active:scale-95 ${
                  cartAnimate ? 'scale-105 bg-strawberry-500' : ''
                }`}
                aria-label="View Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs font-bold leading-none">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (Touch friendly, body scroll lock, nested accordions) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[84%] max-w-sm bg-vanilla-100 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-cocoa-500/10 flex items-center justify-between bg-white">
              <div className="relative w-36 h-8">
                <Image
                  src="/logo/little_cuckoo_horizontal.svg"
                  alt="Little Cuckoo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-charcoal-700 hover:bg-vanilla-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick In-Drawer Search Input */}
            <div className="p-3 bg-vanilla-100 border-b border-cocoa-500/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSearch) onOpenSearch();
                }}
                className="w-full flex items-center gap-2 bg-white border border-cocoa-500/15 text-cocoa-500 text-xs py-2 px-3 rounded-full text-left"
              >
                <Search className="w-4 h-4 text-strawberry-400 shrink-0" />
                <span>Search baby apparel, sets, swaddles...</span>
              </button>
            </div>

            {/* Scrollable Nav Content */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {/* Category Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('categories')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-cocoa-700 uppercase tracking-wider"
                >
                  <span>Apparel Categories</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileExpandedSection === 'categories' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileExpandedSection === 'categories' && (
                  <div className="mt-1 space-y-1 pl-1">
                    <Link
                      href="/shop"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Explore All Products</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=newborn-essentials"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Newborn Essentials (0-6M)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=rompers-and-bodysuits"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Rompers & Bodysuits</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=sleepwear-and-swaddles"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Sleepwear & Swaddles</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=dresses-and-sets"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Dresses & Co-ord Sets</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=gift-hampers-and-bundles"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Gift Hampers & Bundles</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                    <Link
                      href="/shop?category=accessories-and-bibs"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                    >
                      <span>Accessories, Bibs & Caps</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Account & Wishlist Quick Access for Mobile */}
              <div className="pt-2 border-t border-cocoa-500/10 space-y-1">
                <p className="text-xs font-bold text-cocoa-700 uppercase tracking-wider px-3 mb-2">My Little Cuckoo</p>
                <Link
                  href="/account"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-strawberry-400" />
                    <span>My Account & Orders</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal-700 hover:bg-white hover:text-strawberry-500 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-strawberry-400" />
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 ? (
                    <span className="bg-strawberry-100 text-strawberry-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
                  )}
                </Link>
              </div>

              {/* Customer Care Links */}
              <div className="pt-2 border-t border-cocoa-500/10 space-y-1">
                <p className="text-xs font-bold text-cocoa-700 uppercase tracking-wider px-3 mb-2">Customer Care</p>
                <Link
                  href="/track-order"
                  className="block px-3 py-1.5 text-xs text-charcoal-700 hover:text-strawberry-500"
                >
                  Track Live Shipment
                </Link>
                <Link
                  href="/size-guide"
                  className="block px-3 py-1.5 text-xs text-charcoal-700 hover:text-strawberry-500"
                >
                  Baby Size & Fitting Guide
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-1.5 text-xs text-charcoal-700 hover:text-strawberry-500"
                >
                  Our Story & Heritage (Rajkot)
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-1.5 text-xs text-charcoal-700 hover:text-strawberry-500"
                >
                  Contact & Support
                </Link>
              </div>
            </div>

            {/* Drawer Footer Info */}
            <div className="p-4 bg-white border-t border-cocoa-500/10 space-y-2">
              <a
                href={`tel:${BRAND.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-xs font-semibold text-cocoa-700 hover:text-strawberry-500"
              >
                <PhoneCall className="w-3.5 h-3.5 text-strawberry-400 shrink-0" />
                <span>Call Care: {BRAND.phone}</span>
              </a>
              <p className="text-[11px] text-cocoa-400">
                Manufactured by {BRAND.legalName}, Rajkot 360002.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
