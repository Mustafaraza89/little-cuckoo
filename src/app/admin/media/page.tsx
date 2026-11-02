'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Upload, Copy, Check, Filter, Search, Trash2, ExternalLink } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: 'HERO' | 'PRODUCTS' | 'CATEGORIES' | 'LIFESTYLE';
  dimensions: string;
  size: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'm-1',
    name: 'Hero Baby Lifestyle Campaign Photo',
    url: '/images/hero/hero_baby_lifestyle.jpg',
    category: 'HERO',
    dimensions: '1920 x 1080',
    size: '784 KB',
  },
  {
    id: 'm-2',
    name: 'CloudSoft Ribbed Romper Studio Flatlay',
    url: '/images/products/cloudsoft_ribbed_romper.jpg',
    category: 'PRODUCTS',
    dimensions: '1024 x 1024',
    size: '817 KB',
  },
  {
    id: 'm-3',
    name: 'Newborn Welcome 5-Piece Organic Gift Set',
    url: '/images/products/newborn_welcome_gift_set.jpg',
    category: 'PRODUCTS',
    dimensions: '1024 x 1024',
    size: '820 KB',
  },
  {
    id: 'm-4',
    name: 'Buttercup Yellow Zip Sleepsuit',
    url: '/images/products/buttercup_zip_sleepsuit.jpg',
    category: 'PRODUCTS',
    dimensions: '1024 x 1024',
    size: '960 KB',
  },
  {
    id: 'm-5',
    name: 'Sweet Pea Muslin Swaddle Duo Pack',
    url: '/images/products/muslin_swaddle_duo.jpg',
    category: 'PRODUCTS',
    dimensions: '1024 x 1024',
    size: '784 KB',
  },
  {
    id: 'm-6',
    name: 'Little Flora Heirloom Embroidered Dress Set',
    url: '/images/products/heirloom_baby_dress.jpg',
    category: 'PRODUCTS',
    dimensions: '1024 x 1365',
    size: '732 KB',
  },
  {
    id: 'm-7',
    name: 'Baby Boy Linen Co-ord Set',
    url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=85',
    category: 'CATEGORIES',
    dimensions: '600 x 600',
    size: '145 KB',
  },
  {
    id: 'm-8',
    name: 'Natural Studio Baby Lifestyle',
    url: '/images/hero/hero_baby_lifestyle.jpg',
    category: 'LIFESTYLE',
    dimensions: '1920 x 1080',
    size: '784 KB',
  },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets = assets.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Digital Asset Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Media Library</h1>
          <p className="text-xs text-cocoa-500">
            High-resolution baby clothing campaign photography, studio lookbooks, and category assets.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Image Asset</span>
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'HERO', 'PRODUCTS', 'CATEGORIES', 'LIFESTYLE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-charcoal-700 text-white shadow-xs'
                  : 'bg-white border border-cocoa-500/10 text-cocoa-600 hover:bg-vanilla-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-cocoa-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group rounded-3xl bg-white border border-cocoa-500/10 shadow-soft overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-vanilla-200 overflow-hidden">
              <SafeImage
                src={asset.url}
                alt={asset.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-charcoal-700">
                {asset.category}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <p className="font-bold text-xs text-charcoal-700 truncate" title={asset.name}>
                {asset.name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-cocoa-400 font-mono">
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>

              <div className="pt-2 border-t border-cocoa-500/10 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-strawberry-600 hover:text-strawberry-700"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cocoa-400 hover:text-charcoal-700 p-1"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
