import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SafeImage from '@/components/ui/SafeImage';
import { BLOG_POSTS } from '../page';
import { ArrowLeft, Calendar, Clock, User, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found | Little Cuckoo' };
  return {
    title: `${post.title} | Little Cuckoo Journal`,
    description: post.excerpt,
  };
}

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa-500 hover:text-strawberry-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-strawberry-100 text-strawberry-700 text-xs font-bold">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-700 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-cocoa-400 pt-1">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <strong className="text-charcoal-700">{post.author}</strong>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-16/9 rounded-3xl sm:rounded-4xl overflow-hidden bg-vanilla-200 shadow-card">
        <SafeImage src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Article Body */}
      <div className="bg-white p-6 sm:p-12 rounded-3xl sm:rounded-4xl border border-cocoa-500/10 shadow-soft text-charcoal-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <p className="text-base sm:text-lg font-serif italic text-cocoa-600 border-l-4 border-strawberry-300 pl-4">
          &ldquo;{post.excerpt}&rdquo;
        </p>

        <h2 className="font-serif text-xl sm:text-2xl text-charcoal-700 font-bold pt-4">
          The Biology of Delicate Infant Skin
        </h2>
        <p>
          Unlike adult skin, newborn skin is still forming its protective stratum corneum barrier during the first year of life. It absorbs chemicals from clothing fibers almost three times faster than adult skin and loses moisture much more rapidly in air-conditioned or heated rooms.
        </p>

        <p>
          When baby garments are treated with synthetic chlorine bleaches, formaldehydes for wrinkle-resistance, or petroleum-based heavy dyes, these trace residues remain lodged within the yarn. The friction of the baby wriggling creates microscopic abrasions, leading to contact dermatitis, unexplained rashes, and fussiness.
        </p>

        <div className="p-6 rounded-3xl bg-vanilla-100 border border-cocoa-500/10 space-y-3">
          <h3 className="font-serif text-base font-bold text-charcoal-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-strawberry-500" />
            <span>What Sets Certified GOTS Combed Cotton Apart?</span>
          </h3>
          <ul className="text-xs sm:text-sm text-cocoa-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pure Long-Staple Fibers:</strong> Combed cotton removes all short, prickly fibers, leaving only long, silky threads that never pill or cause friction.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Non-Toxic Azo-Free Dyes:</strong> Colors are bound using water-based botanical compounds completely free of aromatic amines and heavy metals.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Natural Breathability:</strong> Regulates body temperature effortlessly, preventing sweat buildup and prickly heat (miliaria).</span>
            </li>
          </ul>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl text-charcoal-700 font-bold pt-4">
          Crafted with Conscious Love in Rajkot
        </h2>
        <p>
          At Little Cuckoo, every piece of fabric is inspected by hand before cutting. We refuse shortcuts: we use flatlock seams that sit flush against the skin, printed inner neck tags instead of scratchy woven labels, and nickel-free YKK snap fasteners tested for lead safety.
        </p>
      </div>

      {/* Related Articles */}
      <div className="pt-8 space-y-4">
        <h3 className="font-serif text-xl text-charcoal-700 font-bold">More from the Journal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPosts.map((other) => (
            <Link
              key={other.slug}
              href={`/blog/${other.slug}`}
              className="p-4 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft hover:shadow-card transition-all flex gap-4 items-center"
            >
              <div className="relative w-20 h-20 rounded-2xl bg-vanilla-200 overflow-hidden shrink-0">
                <SafeImage src={other.image} alt={other.title} fill className="object-cover" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-strawberry-600">{other.category}</span>
                <h4 className="font-serif text-xs font-bold text-charcoal-700 truncate">{other.title}</h4>
                <p className="text-[10px] text-cocoa-400">{other.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
