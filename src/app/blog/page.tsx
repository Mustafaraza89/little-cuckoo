import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { Sparkles, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const metadata = {
  title: 'The Little Cuckoo Journal | Baby Care & Organic Lifestyle',
  description: 'Helpful pediatric guides, organic fabric care, hospital bag checklists, and gentle parenting stories.',
};

export const BLOG_POSTS = [
  {
    slug: 'why-gots-organic-cotton-matters-for-newborns',
    title: 'Why 100% GOTS Certified Organic Cotton is Essential for Newborn Skin',
    excerpt: 'A newborn’s skin is up to 30% thinner than an adult’s. Learn how organic combed cotton and zero toxic azo dyes prevent rashes and preserve delicate dermal barriers.',
    date: 'October 24, 2026',
    readTime: '4 min read',
    author: 'Little Cuckoo Pediatric Team',
    category: 'Fabric Science',
    image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
  },
  {
    slug: 'the-essential-indian-hospital-bag-checklist',
    title: 'The Ultimate Hospital Bag Packing Checklist for Indian Mothers',
    excerpt: 'From kimono wrap onesies with umbilical cord protection to super-soft muslin swaddles, here is what you truly need for baby’s very first 48 hours.',
    date: 'October 15, 2026',
    readTime: '6 min read',
    author: 'Dr. Radhika Desai, Pediatrician',
    category: 'Newborn Essentials',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=85',
  },
  {
    slug: 'how-to-wash-and-care-for-organic-baby-clothes',
    title: 'How to Wash & Soften Organic Baby Clothes Without Harsh Chemicals',
    excerpt: 'A simple guide to maintaining buttery softness, protecting delicate non-toxic botanical colors, and keeping baby clothes germ-free naturally.',
    date: 'September 28, 2026',
    readTime: '5 min read',
    author: 'Anant Garments Quality Workshop',
    category: 'Wash Care',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=85',
  },
  {
    slug: 'baby-sleep-rituals-swaddling-temperatures',
    title: 'Safe Sleep Guidelines: Room Temperatures and Swaddling Basics',
    excerpt: 'How to layer baby for peaceful overnight slumber in Indian homes, keeping them warm without the risk of overheating.',
    date: 'September 10, 2026',
    readTime: '5 min read',
    author: 'Little Cuckoo Care Team',
    category: 'Baby Sleep',
    image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=85',
  },
];

export default function BlogListingPage() {
  const [featured, ...recent] = BLOG_POSTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          The Little Cuckoo Journal
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-700">Words of Care & Comfort</h1>
        <p className="text-xs sm:text-sm text-cocoa-500">
          Pediatrician-reviewed newborn dressing advice, fabric science, and mindful parenting moments from our Rajkot workshop.
        </p>
      </div>

      {/* Featured Lead Story */}
      <div className="rounded-4xl sm:rounded-5xl bg-white border border-cocoa-500/10 shadow-soft overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 relative aspect-16/10 sm:aspect-16/9 bg-vanilla-200">
          <SafeImage
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-strawberry-600">
            {featured.category}
          </span>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3 text-[11px] text-cocoa-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{featured.date}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{featured.readTime}</span>
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-700 leading-snug">
            <Link href={`/blog/${featured.slug}`} className="hover:text-strawberry-600 transition-colors">
              {featured.title}
            </Link>
          </h2>

          <p className="text-xs sm:text-sm text-cocoa-500 leading-relaxed">
            {featured.excerpt}
          </p>

          <div className="pt-2">
            <Link
              href={`/blog/${featured.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 group"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Articles Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl sm:text-2xl text-charcoal-700 font-bold">Recent Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {recent.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-3xl bg-white border border-cocoa-500/10 shadow-soft overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-vanilla-200 overflow-hidden">
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-charcoal-700">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] text-cocoa-400">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-charcoal-700 group-hover:text-strawberry-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-xs text-cocoa-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-cocoa-500/5 mt-2 flex items-center justify-between text-xs font-bold text-strawberry-600">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
