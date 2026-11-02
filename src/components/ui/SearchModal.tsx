'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/ui/SafeImage';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Organic Rompers',
  'Newborn Hospital Set',
  'Bamboo Sleepsuit',
  'Heirloom Dress',
  'Baby Shower Hamper',
  'Waffle Knit',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (e) {
        console.error('Search fetch failed', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all border border-cocoa-500/10 z-50">
          {/* Search Input Bar */}
          <div className="relative p-4 sm:p-5 border-b border-cocoa-500/10 flex items-center gap-3 bg-vanilla-50">
            <Search className="w-5 h-5 text-strawberry-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, category, fabric, or SKU..."
              className="w-full bg-transparent text-sm sm:text-base text-charcoal-700 placeholder:text-cocoa-300 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-cocoa-300 hover:text-charcoal-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-vanilla-200 text-cocoa-500 text-xs font-semibold px-2.5 ml-2"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="p-5 max-h-[65vh] overflow-y-auto">
            {/* Quick Categories when no query */}
            {!query && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-cocoa-500 uppercase tracking-wider mb-2.5">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-vanilla-200/80 hover:bg-strawberry-100 hover:text-strawberry-600 text-charcoal-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-cocoa-500/10">
                  <div className="flex items-center gap-2 text-xs text-cocoa-500 mb-3">
                    <Sparkles className="w-4 h-4 text-strawberry-400" />
                    <span>Featured Collections</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/shop?category=newborn-essentials"
                      onClick={onClose}
                      className="p-3 rounded-2xl bg-vanilla-100 hover:bg-vanilla-200 transition-colors flex items-center justify-between text-xs font-semibold text-charcoal-700"
                    >
                      <span>Newborn Essentials (0-3M)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cocoa-400" />
                    </Link>
                    <Link
                      href="/shop?category=rompers-and-bodysuits"
                      onClick={onClose}
                      className="p-3 rounded-2xl bg-vanilla-100 hover:bg-vanilla-200 transition-colors flex items-center justify-between text-xs font-semibold text-charcoal-700"
                    >
                      <span>Organic Rompers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cocoa-400" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            {query && (
              <div>
                {loading ? (
                  <div className="py-8 text-center text-xs text-cocoa-500 animate-pulse">
                    Searching catalog...
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-cocoa-500 uppercase tracking-wider mb-2">
                      Results for "{query}" ({results.length})
                    </p>
                    {results.map((product) => {
                      const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80';
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-vanilla-100 transition-colors group"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-vanilla-200 shrink-0">
                            <SafeImage
                              src={img}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-strawberry-500 uppercase">
                              {product.category?.name || 'Organic Baby'}
                            </span>
                            <h4 className="text-xs font-semibold text-charcoal-700 group-hover:text-strawberry-500 transition-colors truncate">
                              {product.title}
                            </h4>
                            <p className="text-[11px] text-cocoa-300 truncate">
                              {product.fabricDetails || '100% GOTS Organic Cotton'}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-charcoal-700">
                              {formatPrice(product.salePrice || product.regularPrice)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <p className="font-serif text-base text-charcoal-700">No products found for "{query}"</p>
                    <p className="text-xs text-cocoa-500">
                      Try searching for "romper", "sleepsuit", "dress", or "organic".
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
