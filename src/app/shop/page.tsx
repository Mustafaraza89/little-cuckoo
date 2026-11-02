import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { SlidersHorizontal, ChevronRight, X } from 'lucide-react';

export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    category?: string;
    gender?: string;
    ageGroup?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    badge?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, gender, ageGroup, sort = 'newest', search, minPrice, maxPrice, badge } = searchParams;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (category) {
    where.category = { slug: category };
  }
  if (gender && gender !== 'ALL') {
    where.gender = gender;
  }
  if (ageGroup && ageGroup !== 'ALL') {
    where.ageGroup = { contains: ageGroup };
  }
  if (badge === 'organic') {
    where.fabricDetails = { contains: 'Organic' };
  } else if (badge === 'new-arrival') {
    where.isNewArrival = true;
  } else if (badge === 'pastels') {
    where.OR = [
      { title: { contains: 'Pastel' } },
      { description: { contains: 'pastel' } },
      { isFeatured: true },
    ];
  }
  if (minPrice || maxPrice) {
    where.salePrice = {};
    if (minPrice) where.salePrice.gte = parseFloat(minPrice);
    if (maxPrice) where.salePrice.lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { salePrice: 'asc' };
  if (sort === 'price-desc') orderBy = { salePrice: 'desc' };
  if (sort === 'rating') orderBy = { rating: 'desc' };
  if (sort === 'bestseller') orderBy = { isBestSeller: 'desc' };

  let categories: any[] = [];
  let products: any[] = [];

  try {
    const [c, p] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      }),
    ]);
    categories = c;
    products = p;
  } catch (err) {
    console.warn('[ShopPage] Database query resilient fallback:', err);
  }

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-cocoa-500 mb-6">
        <Link href="/" className="hover:text-strawberry-500">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
        <Link href="/shop" className="hover:text-strawberry-500">Shop</Link>
        {activeCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-cocoa-300" />
            <span className="font-semibold text-charcoal-700">{activeCategory.name}</span>
          </>
        )}
      </nav>

      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cocoa-500/10">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl text-charcoal-700">
            {activeCategory ? activeCategory.name : 'All Baby Collections'}
          </h1>
          <p className="text-xs text-cocoa-500 mt-1">
            Showing {products.length} {products.length === 1 ? 'item' : 'items'} in organic baby apparel
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-xs font-semibold text-charcoal-700">Sort by:</label>
          <div className="flex gap-2">
            <Link
              href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'newest' })}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                sort === 'newest'
                  ? 'bg-strawberry-400 text-white border-strawberry-400'
                  : 'bg-white text-cocoa-700 border-cocoa-500/20 hover:border-strawberry-300'
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'price-asc' })}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                sort === 'price-asc'
                  ? 'bg-strawberry-400 text-white border-strawberry-400'
                  : 'bg-white text-cocoa-700 border-cocoa-500/20 hover:border-strawberry-300'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?${new URLSearchParams({ ...searchParams, sort: 'rating' })}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                sort === 'rating'
                  ? 'bg-strawberry-400 text-white border-strawberry-400'
                  : 'bg-white text-cocoa-700 border-cocoa-500/20 hover:border-strawberry-300'
              }`}
            >
              Top Rated
            </Link>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Active Filters Pill Bar */}
          {(category || gender || search) && (
            <div className="p-4 rounded-2xl bg-vanilla-200/60 border border-cocoa-500/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cocoa-500">
                <span>Active Filters</span>
                <Link href="/shop" className="text-strawberry-600 hover:underline">Clear all</Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-white text-charcoal-700 px-2.5 py-1 rounded-full border border-cocoa-500/10 font-medium">
                    {activeCategory.name}
                    <Link href={`/shop?${new URLSearchParams({ ...searchParams, category: '' })}`}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </Link>
                  </span>
                )}
                {gender && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-white text-charcoal-700 px-2.5 py-1 rounded-full border border-cocoa-500/10 font-medium">
                    Gender: {gender}
                    <Link href={`/shop?${new URLSearchParams({ ...searchParams, gender: '' })}`}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </Link>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft">
            <h3 className="font-serif text-base text-charcoal-700 mb-3">Categories</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/shop"
                  className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-colors ${
                    !category ? 'bg-vanilla-200 font-bold text-strawberry-600' : 'text-charcoal-700 hover:bg-vanilla-100'
                  }`}
                >
                  <span>All Categories</span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/shop?${new URLSearchParams({ ...searchParams, category: c.slug })}`}
                    className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-colors ${
                      category === c.slug
                        ? 'bg-vanilla-200 font-bold text-strawberry-600'
                        : 'text-charcoal-700 hover:bg-vanilla-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-cocoa-300 text-[11px]">({c._count.products})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gender Filter */}
          <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft">
            <h3 className="font-serif text-base text-charcoal-700 mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {['UNISEX', 'GIRL', 'BOY'].map((g) => (
                <Link
                  key={g}
                  href={`/shop?${new URLSearchParams({ ...searchParams, gender: gender === g ? '' : g })}`}
                  className={`px-3 py-1.5 rounded-full border transition-colors ${
                    gender === g
                      ? 'bg-strawberry-400 text-white border-strawberry-400 font-semibold'
                      : 'bg-white text-charcoal-700 border-cocoa-500/20 hover:border-strawberry-300'
                  }`}
                >
                  {g === 'UNISEX' ? 'Unisex' : g === 'GIRL' ? 'Baby Girl' : 'Baby Boy'}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-cocoa-500/10 p-8 space-y-3">
              <p className="font-serif text-xl text-charcoal-700">No baby apparel found</p>
              <p className="text-xs text-cocoa-500 max-w-sm mx-auto">
                We couldn't find items matching your selected criteria. Try adjusting or clearing your filters.
              </p>
              <Link
                href="/shop"
                className="inline-block py-2.5 px-6 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white text-xs font-semibold shadow-pill transition-all"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
