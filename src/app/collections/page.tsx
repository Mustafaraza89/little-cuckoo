import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'All Collections | Little Cuckoo',
  description: 'Explore the curated organic cotton collections for newborns, boys, girls, rompers, and sleepwear.',
};

const CURATED_TILES = [
  {
    name: 'Newborn Essentials',
    slug: 'newborn-essentials',
    desc: 'Pure organic cotton starter kimonos, wrap tops & mittens for the first 100 days.',
    image: '/images/products/newborn_welcome_gift_set.jpg',
  },
  {
    name: 'Rompers & Bodysuits',
    slug: 'rompers-and-bodysuits',
    desc: 'Buttery-soft ribbed rompers with easy snap crotch closures for quick diaper changes.',
    image: '/images/products/cloudsoft_ribbed_romper.jpg',
  },
  {
    name: 'Sleepwear & Swaddles',
    slug: 'sleepwear-and-swaddles',
    desc: 'Two-way zip sleepsuits and breathable muslin swaddle wraps for sound, cozy naps.',
    image: '/images/products/buttercup_zip_sleepsuit.jpg',
  },
  {
    name: 'Baby Boy Edit',
    slug: 'baby-boy',
    desc: 'Comfortable play sets, pocket dungarees, and earthy pastel shirts.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Baby Girl Edit',
    slug: 'baby-girl',
    desc: 'Delicate ruffle bloomers, twirl-friendly organic cotton dresses and bonnet sets.',
    image: '/images/products/heirloom_baby_dress.jpg',
  },
  {
    name: 'Gift Hampers & Bundles',
    slug: 'gift-hampers-and-bundles',
    desc: 'Thoughtfully packaged welcome sets in keepsake presentation gift boxes.',
    image: '/images/products/muslin_swaddle_duo.jpg',
  },
];

export default async function CollectionsPage() {
  const dbCategories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          The Little Cuckoo Wardrobe
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-700">Shop Collections</h1>
        <p className="text-xs sm:text-sm text-cocoa-500">
          Handcrafted in Rajkot from certified combed organic cotton yarn. Designed for tenderness, breathable comfort, and gentle everyday living.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CURATED_TILES.map((col) => (
          <Link
            key={col.slug}
            href={`/shop?category=${col.slug}`}
            className="group block rounded-4xl bg-white border border-cocoa-500/10 shadow-soft overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-4/3 bg-vanilla-200 overflow-hidden">
              <SafeImage
                src={col.image}
                alt={col.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif text-xl sm:text-2xl font-bold">{col.name}</h3>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <p className="text-xs text-cocoa-500 leading-relaxed line-clamp-2">{col.desc}</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-strawberry-600 group-hover:text-strawberry-700">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
