'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, PackageX } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchSearchResults(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Catalog Search
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">Search Products</h1>

        <form onSubmit={handleSearchSubmit} className="relative pt-2">
          <Search className="w-5 h-5 text-cocoa-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rompers, organic swaddles, gift sets..."
            className="w-full pl-12 pr-28 py-3.5 rounded-full border border-cocoa-500/20 bg-white text-xs sm:text-sm text-charcoal-700 shadow-soft focus:outline-none focus:border-strawberry-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-cocoa-400">Popular:</span>
          {['Romper', 'Newborn', 'Swaddle', 'Gift Set', 'Organic Cotton', 'Sleepsuit'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                fetchSearchResults(tag);
              }}
              className="px-3 py-1 rounded-full bg-white border border-cocoa-500/10 text-cocoa-600 hover:bg-strawberry-50 hover:text-strawberry-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        {loading ? (
          <div className="py-16 text-center text-xs text-cocoa-400">
            Searching Little Cuckoo catalog...
          </div>
        ) : hasSearched && products.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-vanilla-200 flex items-center justify-center mx-auto text-cocoa-400">
              <PackageX className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-charcoal-700 font-bold">
              No matching products found
            </h3>
            <p className="text-xs text-cocoa-500">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try another keyword or browse our core collections.
            </p>
            <div>
              <Link
                href="/shop"
                className="inline-block px-5 py-2.5 rounded-full bg-strawberry-400 text-white font-bold text-xs shadow-pill hover:bg-strawberry-500 transition-colors"
              >
                Explore All Products &rarr;
              </Link>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-cocoa-500 pb-2 border-b border-cocoa-500/10">
              <span>Found <strong>{products.length}</strong> styles matching &ldquo;{query}&rdquo;</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
