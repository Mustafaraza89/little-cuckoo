import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import NewsletterSection from '@/components/home/NewsletterSection';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Star, 
  CheckCircle2, 
  Leaf, 
  ShoppingBag,
  Gift,
  Award,
  Layers,
  Check,
  Camera
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

export const revalidate = 0; // Fresh database synchronization

export default async function HomePage() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let reviews: any[] = [];
  let cmsHero: any = null;
  let cmsBrandStory: any = null;
  let cmsLifestyle: any = null;

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, status: 'PUBLISHED' },
        take: 4,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.product.findMany({
        where: { isNewArrival: true, status: 'PUBLISHED' },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.product.findMany({
        where: { isBestSeller: true, status: 'PUBLISHED' },
        take: 4,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
      prisma.review.findMany({
        where: { isApproved: true },
        take: 3,
        orderBy: { rating: 'desc' },
        include: { product: { select: { title: true, slug: true } } },
      }),
      prisma.cMSSection.findUnique({ where: { sectionKey: 'hero' } }),
      prisma.cMSSection.findUnique({ where: { sectionKey: 'brandStory' } }),
      prisma.cMSSection.findUnique({ where: { sectionKey: 'lifestyle' } }),
    ]);

    categories = results[0];
    featuredProducts = results[1];
    newArrivals = results[2];
    bestSellers = results[3];
    reviews = results[4];
    cmsHero = results[5];
    cmsBrandStory = results[6];
    cmsLifestyle = results[7];
  } catch (err) {
    console.warn('[HomePage] Database query resilient fallback:', err);
  }

  // Lead anchor product for hero floating card
  const heroAnchorProduct = featuredProducts[0] || bestSellers[0] || {
    id: 'hero-anchor',
    title: 'CloudSoft Organic Cotton Ribbed Romper',
    slug: 'cloudsoft-organic-cotton-ribbed-romper',
    regularPrice: 899,
    salePrice: 699,
    images: [{ url: '/images/products/cloudsoft_ribbed_romper.jpg' }],
  };

  // Section A Categories: "Shop Their Little World"
  const CATEGORY_TILES = [
    {
      name: 'Newborn Essentials',
      slug: 'newborn-essentials',
      tagline: '0–6M gentle starters',
      imageUrl: '/images/products/newborn_welcome_gift_set.jpg',
      href: '/shop?category=newborn-essentials',
      bgTint: 'bg-strawberry-50/70 border-strawberry-200/50',
    },
    {
      name: 'Baby Boy',
      slug: 'baby-boy',
      tagline: 'Playful linen & dungarees',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=85',
      href: '/shop?category=baby-boy',
      bgTint: 'bg-babyblue-50/70 border-babyblue-200/50',
    },
    {
      name: 'Baby Girl',
      slug: 'baby-girl',
      tagline: 'Floral bloomer frocks',
      imageUrl: '/images/products/heirloom_baby_dress.jpg',
      href: '/shop?category=baby-girl',
      bgTint: 'bg-peach-50/70 border-peach-200/50',
    },
    {
      name: 'Rompers & Bodysuits',
      slug: 'rompers-and-bodysuits',
      tagline: 'Buttery-soft daily rib',
      imageUrl: '/images/products/cloudsoft_ribbed_romper.jpg',
      href: '/shop?category=rompers-and-bodysuits',
      bgTint: 'bg-mint-50/70 border-mint-200/50',
    },
    {
      name: 'Sleepwear & Swaddles',
      slug: 'sleepwear-and-swaddles',
      tagline: '2-way zip sleepsuits',
      imageUrl: '/images/products/buttercup_zip_sleepsuit.jpg',
      href: '/shop?category=sleepwear-and-swaddles',
      bgTint: 'bg-lavender-50/70 border-lavender-200/50',
    },
    {
      name: 'Gift Hampers & Sets',
      slug: 'gift-hampers-and-bundles',
      tagline: 'Keepsake luxury boxes',
      imageUrl: '/images/products/muslin_swaddle_duo.jpg',
      href: '/shop?category=gift-hampers-and-bundles',
      bgTint: 'bg-butter-50/70 border-butter-200/50',
    },
  ];

  // Dynamic Lifestyle Moments Section
  let lifestyleItems = [
    {
      id: 'look-1',
      title: 'Morning Snuggles in Ribbed Knit',
      badge: 'EVERYDAY LITTLE JOYS',
      productSlug: 'cloudsoft-organic-cotton-ribbed-romper',
      productTitle: 'CloudSoft Ribbed Romper',
      price: 699,
      image: '/images/hero/hero_baby_lifestyle.jpg',
      featured: true,
    },
    {
      id: 'look-2',
      title: 'Newborn Welcome Starter Set',
      badge: 'SOFTNESS IN EVERY MOMENT',
      productSlug: 'newborn-welcome-5-piece-organic-set',
      productTitle: '5-Piece Newborn Gift Box',
      price: 1499,
      image: '/images/products/newborn_welcome_gift_set.jpg',
      featured: false,
    },
    {
      id: 'look-3',
      title: 'Buttercup Yellow Zip Sleepsuit',
      badge: 'DREAMY NAPTIMES',
      productSlug: 'sweet-dreams-bamboo-organic-cotton-sleepsuit',
      productTitle: 'Two-Way Zip Sleepsuit',
      price: 799,
      image: '/images/products/buttercup_zip_sleepsuit.jpg',
      featured: false,
    },
    {
      id: 'look-4',
      title: 'Heirloom Hand-Smocked Frock',
      badge: 'MADE WITH LOVE',
      productSlug: 'little-flora-heirloom-embroidered-dress-set',
      productTitle: 'Heirloom Dress & Bloomer',
      price: 1199,
      image: '/images/products/heirloom_baby_dress.jpg',
      featured: false,
    },
    {
      id: 'look-5',
      title: 'Sweet Pea Muslin Swaddles',
      badge: 'PURE ORGANIC GOTS',
      productSlug: 'little-wonders-luxury-baby-shower-keepsake-hamper',
      productTitle: 'Muslin Swaddle Duo',
      price: 599,
      image: '/images/products/muslin_swaddle_duo.jpg',
      featured: false,
    },
  ];

  if (cmsLifestyle?.extraData) {
    try {
      const parsed = JSON.parse(cmsLifestyle.extraData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        lifestyleItems = parsed;
      }
    } catch (_) {}
  }

  const featuredLook = lifestyleItems[0] || lifestyleItems[0];
  const supportingLooks = lifestyleItems.slice(1, 5);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* =========================================================================
          HERO SECTION — EDITORIAL BABY FASHION CAMPAIGN
          ========================================================================= */}
      <section className="relative overflow-hidden pt-4 pb-6 sm:pt-8 sm:pb-12 bg-gradient-to-b from-vanilla-100 via-vanilla-100 to-vanilla-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-4xl sm:rounded-5xl bg-gradient-to-br from-vanilla-100 via-vanilla-200/40 to-strawberry-50/40 border border-cocoa-500/10 p-6 sm:p-10 lg:p-14 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column (Approx 48%) — Brand Storytelling & Editorial CTAs */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Collection Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-strawberry-100/80 border border-strawberry-200 text-strawberry-700 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-strawberry-400" />
                  <span>The Ice Cream Pastel Collection 2026</span>
                </div>

                {/* Primary Editorial Headline */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-700 leading-tight">
                  Little Moments. <br />
                  <span className="text-strawberry-400 italic">Beautifully Dressed.</span>
                </h1>

                {/* Supporting Description */}
                <p className="text-xs sm:text-sm lg:text-base text-cocoa-500 leading-relaxed max-w-xl">
                  Thoughtfully crafted baby essentials, made with gentle fabrics and a whole lot of love. Pure 100% combed organic cotton baby apparel crafted in Rajkot, Gujarat.
                </p>

                {/* Dual Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/shop"
                    className="py-3.5 px-7 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs sm:text-sm shadow-pill transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                  >
                    <span>Explore New Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/shop?category=newborn-essentials"
                    className="py-3.5 px-6 rounded-full bg-white hover:bg-vanilla-200 text-charcoal-700 border border-cocoa-500/20 font-bold text-xs sm:text-sm transition-all shadow-xs"
                  >
                    Shop Newborn Essentials
                  </Link>
                </div>

                {/* Verified Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-cocoa-500 border-t border-cocoa-500/10">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% GOTS Organic</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Non-Toxic Azo-Free Dyes</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Scratchy Tags</span>
                  </span>
                </div>
              </div>

              {/* Right Column (Approx 52%) — High-End Baby Clothing Campaign Photography */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                {/* Main Visual Container */}
                <div className="relative w-full aspect-4/5 sm:aspect-square lg:aspect-4/5 max-w-lg rounded-3xl sm:rounded-4xl overflow-hidden shadow-lift border-4 border-white bg-vanilla-200">
                  <SafeImage
                    src={cmsHero?.imageUrl || '/images/hero/hero_baby_lifestyle.jpg'}
                    alt="Little Cuckoo Premium Organic Baby Fashion"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />

                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/25 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Element 1: Top-Left Organic Cotton Seal */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-cocoa-500/10 shadow-card flex items-center gap-2.5 z-20 animate-in fade-in slide-in-from-left duration-300">
                    <div className="w-8 h-8 rounded-xl bg-mint-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-charcoal-700 leading-none">Organic Cotton</p>
                      <p className="text-[10px] text-cocoa-500 leading-tight mt-0.5">100% Naturally Soft</p>
                    </div>
                  </div>

                  {/* Floating Element 2: Bottom Featured Product Card from Database */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-cocoa-500/10 shadow-lift flex items-center gap-3 z-20">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-vanilla-200 shrink-0">
                      <SafeImage
                        src={heroAnchorProduct.images[0]?.url || '/images/products/cloudsoft_ribbed_romper.jpg'}
                        alt={heroAnchorProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-strawberry-500 uppercase tracking-wide">Featured Favorite</p>
                      <h4 className="text-xs font-bold text-charcoal-700 truncate">{heroAnchorProduct.title}</h4>
                      <p className="text-xs font-bold text-charcoal-700">
                        {formatPrice(heroAnchorProduct.salePrice || heroAnchorProduct.regularPrice)}{' '}
                        {heroAnchorProduct.salePrice && (
                          <span className="line-through text-[10px] text-cocoa-300 font-normal">
                            {formatPrice(heroAnchorProduct.regularPrice)}
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      href={`/product/${heroAnchorProduct.slug}`}
                      className="p-2.5 rounded-xl bg-strawberry-400 hover:bg-strawberry-500 text-white transition-all transform active:scale-95 shadow-xs shrink-0"
                      aria-label="Shop Featured Baby Style"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION A — SHOP THEIR LITTLE WORLD (CATEGORY SHOWCASE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
              Thoughtfully Curated
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
              Shop Their Little World
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-500 mt-1">
              Gentle wardrobes designed for every newborn stage and developmental step.
            </p>
          </div>
          <Link
            href="/collections"
            className="mt-2 sm:mt-0 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1 group"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className={`group p-3 sm:p-4 rounded-3xl ${cat.bgTint} border transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col items-center text-center`}
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white mb-3 shadow-xs">
                <SafeImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                />
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-charcoal-700 line-clamp-1 group-hover:text-strawberry-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10px] text-cocoa-500 line-clamp-1 mt-0.5">{cat.tagline}</p>
              <span className="text-[10px] font-bold text-strawberry-500 mt-1.5 opacity-80 group-hover:opacity-100">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION B — THE LITTLE CUCKOO EDIT (EDITORIAL COLLECTION)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
              Editorial Showcase
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
              The Little Cuckoo Edit
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-500 mt-1">
              Hand-picked organic staples designed for timeless family photographs and daily comfort.
            </p>
          </div>
          <Link
            href="/shop?badge=organic"
            className="mt-2 sm:mt-0 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1 group"
          >
            <span>View Full Edit</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION C — BEST LOVED ESSENTIALS (COMMUNITY FAVORITES)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Loved by 10,000+ Indian Parents
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
            Best Loved Essentials
          </h2>
          <p className="text-xs sm:text-sm text-cocoa-500 mt-2">
            Our most frequently gifted, rave-reviewed rompers, sleepsuits, and heirloom baby dresses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION D — CRAFTED WITH CARE (ANANT GARMENTS BRAND STORY)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl sm:rounded-5xl bg-vanilla-200/80 border border-cocoa-500/10 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-strawberry-600 uppercase tracking-widest">
              <Award className="w-4 h-4 text-strawberry-500" />
              <span>Crafted With Care in Rajkot</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-700 leading-tight">
              Softness They Deserve.
            </h2>

            <p className="text-xs sm:text-sm text-cocoa-600 leading-relaxed">
              At Little Cuckoo, we do not outsource quality. Handcrafted in Rajkot, Gujarat by {BRAND.legalName}, every seam, snap, and stitch is made under direct supervision. We use exclusively certified organic combed cotton, ensuring baby skin never meets harsh pesticides or toxic chemical azo dyes.
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs space-y-1">
                <Leaf className="w-4 h-4 text-mint-500 mb-1" />
                <h4 className="font-bold text-charcoal-700">100% GOTS Cotton</h4>
                <p className="text-[11px] text-cocoa-400">Silky, naturally breathable fibers</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs space-y-1">
                <ShieldCheck className="w-4 h-4 text-babyblue-500 mb-1" />
                <h4 className="font-bold text-charcoal-700">Nickel-Free Snaps</h4>
                <p className="text-[11px] text-cocoa-400">Zero skin reactions or eczema flare-ups</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs space-y-1">
                <Sparkles className="w-4 h-4 text-strawberry-400 mb-1" />
                <h4 className="font-bold text-charcoal-700">Zero Scratchy Tags</h4>
                <p className="text-[11px] text-cocoa-400">Printed water-based inner neck labels</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-cocoa-500/10 shadow-xs space-y-1">
                <Check className="w-4 h-4 text-emerald-500 mb-1" />
                <h4 className="font-bold text-charcoal-700">Flatlock Seams</h4>
                <p className="text-[11px] text-cocoa-400">Zero chafing on delicate newborn skin</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 group"
              >
                <span>Read the full Anant Garments story</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square max-w-md mx-auto rounded-3xl sm:rounded-4xl overflow-hidden shadow-card border-4 border-white bg-vanilla-200">
              <SafeImage
                src={cmsBrandStory?.imageUrl || '/images/products/newborn_welcome_gift_set.jpg'}
                alt="Craftsmanship in Rajkot by Anant Garments"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-cocoa-500/10 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-strawberry-500 uppercase tracking-wider">Manufacturing Unit</p>
                  <p className="text-xs font-bold text-charcoal-700">Shakti Krupa, Gondal Road, Rajkot</p>
                </div>
                <span className="text-[10px] font-mono bg-vanilla-200 px-2 py-1 rounded text-cocoa-600">
                  GST: {BRAND.gstin}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E — LITTLE LOOKS, BIG SMILES (BABY FASHION GALLERY)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-strawberry-500" />
              <span>{cmsLifestyle?.subtitle || 'Lifestyle Moments'}</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
              {cmsLifestyle?.title || 'Little Looks, Big Smiles'}
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-500 mt-1 max-w-xl">
              {cmsLifestyle?.content || 'Real little wonders enjoying everyday snuggles in our gentle organic cotton fabrics.'}
            </p>
          </div>
          <Link
            href={cmsLifestyle?.ctaLink || '/shop'}
            className="mt-3 sm:mt-0 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1.5 group self-start sm:self-end"
          >
            <span>{cmsLifestyle?.ctaText || 'Shop The Looks'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Magazine Editorial Gallery: 1 Large Hero Card + 4 Supporting Looks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Featured Hero Look (Left 6 Columns) */}
          <div className="lg:col-span-6 relative group rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft border-3 sm:border-4 border-white bg-vanilla-200 min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex flex-col justify-end p-5 sm:p-7 transition-all duration-300 hover:shadow-card">
            <SafeImage
              src={featuredLook?.image || '/images/hero/hero_baby_lifestyle.jpg'}
              alt={featuredLook?.title || 'Featured Look'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-strawberry-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-xs border border-strawberry-100">
                <Sparkles className="w-3 h-3 text-strawberry-400" />
                <span>{featuredLook?.badge || 'EVERYDAY LITTLE JOYS'}</span>
              </span>
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-10 space-y-2 max-w-lg">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug drop-shadow-xs">
                {featuredLook?.title}
              </h3>
              <p className="text-xs sm:text-sm text-vanilla-200 line-clamp-1 font-medium">
                {featuredLook?.productTitle} • ₹{featuredLook?.price}
              </p>
              <div className="pt-2">
                <Link
                  href={`/product/${featuredLook?.productSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white text-xs font-bold transition-all transform group-hover:translate-x-0.5 shadow-pill"
                >
                  <span>Shop The Look</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Supporting Looks (Right 6 Columns in 2x2 Grid) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-5">
            {supportingLooks.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative aspect-square sm:aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-soft border-2 sm:border-3 border-white bg-vanilla-200 flex flex-col justify-end p-3.5 sm:p-4 hover:shadow-card transition-all duration-300"
              >
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent pointer-events-none" />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-strawberry-600 uppercase tracking-wider shadow-xs">
                    {item.badge}
                  </span>
                </div>

                {/* Info & Link */}
                <div className="relative z-10 space-y-0.5 text-white">
                  <p className="font-serif text-xs sm:text-sm font-bold line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-vanilla-200 line-clamp-1">
                    {item.productTitle} • ₹{item.price}
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-strawberry-300 group-hover:text-strawberry-200 transition-colors">
                    <span>Shop Look</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Direct Clickable Overlay Link */}
                <Link
                  href={`/product/${item.productSlug}`}
                  className="absolute inset-0 z-20"
                  aria-label={`Shop look: ${item.title}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F — NEW ARRIVALS (FRESH RELEASES)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
              Fresh From Our Rajkot Workshop
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-500 mt-1">
              The latest seasonal drops in wholesome ice cream pastels.
            </p>
          </div>
          <Link
            href="/shop?badge=new-arrival"
            className="mt-2 sm:mt-0 text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1 group"
          >
            <span>See Full New Drops</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION G — GIFT SOMETHING LOVELY (HOSPITAL BAG & WELCOME SET)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-cocoa-500 text-white p-8 sm:p-12 lg:p-14 shadow-card">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <SafeImage
              src="/images/products/newborn_welcome_gift_set.jpg"
              alt="Gift Something Lovely"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-strawberry-400 text-white text-xs font-bold uppercase tracking-wider inline-block">
              Gift Something Lovely
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-vanilla-100 leading-tight">
              The Welcome Home Newborn Bundle
            </h2>
            <p className="text-xs sm:text-sm text-cocoa-300 leading-relaxed">
              Kimono wrap tops, footed pants, knot beanies, and organic swaddles designed for baby&apos;s very first days. Crafted with zero pressure on the healing umbilical stump.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/product/newborn-welcome-to-the-world-5-piece-organic-set"
                className="py-3 px-6 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-colors flex items-center gap-2"
              >
                <span>Shop 5-Piece Newborn Set — ₹1,499</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-butter-300 font-medium">✨ Includes Complimentary Keepsake Gift Box</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PARENT TESTIMONIALS (REAL REVIEWS FROM DB)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Real Parent Stories
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-700 mt-1">
            What Mothers Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-charcoal-700">&ldquo;{rev.title}&rdquo;</h4>
                  <p className="text-xs text-cocoa-500 leading-relaxed line-clamp-3">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-cocoa-500/10 flex items-center justify-between text-[11px] text-cocoa-400">
                  <span className="font-semibold text-charcoal-700">{rev.customerName}</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-cocoa-400 py-6">
              Reviews loading...
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION H — NEWSLETTER SUBSCRIPTION (INSTANT WELCOME BONUS)
          ========================================================================= */}
      <NewsletterSection />
    </div>
  );
}
