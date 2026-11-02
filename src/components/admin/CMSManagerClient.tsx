'use client';

import React, { useState } from 'react';
import { Sliders, Check, Save } from 'lucide-react';

export default function CMSManagerClient({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState<Record<string, any>>(() => {
    const map: Record<string, any> = {};
    for (const s of initialSections) {
      map[s.sectionKey] = s;
    }
    return map;
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const handleUpdate = async (sectionKey: string) => {
    const data = sections[sectionKey];
    if (!data) return;

    setSavingKey(sectionKey);
    setSuccessKey(null);

    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessKey(sectionKey);
        setTimeout(() => setSuccessKey(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(null);
    }
  };

  const hero = sections['hero'] || {};
  const brandStory = sections['brandStory'] || {};
  const announcement = sections['announcement'] || {};
  const lifestyle = sections['lifestyle'] || {};

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 1. Hero Banner Editor */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-cocoa-500/10 pb-4">
          <div>
            <h3 className="font-serif text-lg text-charcoal-700">1. Homepage Hero Banner</h3>
            <p className="text-xs text-cocoa-500">The main visual headline seen by visitors on landing</p>
          </div>
          <button
            type="button"
            disabled={savingKey === 'hero'}
            onClick={() => handleUpdate('hero')}
            className="py-2 px-4 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-1.5"
          >
            {successKey === 'hero' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savingKey === 'hero' ? 'Saving...' : successKey === 'hero' ? 'Saved!' : 'Save Hero'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Headline Title</label>
            <input
              type="text"
              value={hero.title || ''}
              onChange={(e) => setSections({
                ...sections,
                hero: { ...hero, title: e.target.value }
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Subtitle / Body Description</label>
            <textarea
              rows={3}
              value={hero.subtitle || ''}
              onChange={(e) => setSections({
                ...sections,
                hero: { ...hero, subtitle: e.target.value }
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={hero.ctaText || ''}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...hero, ctaText: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">CTA Link Destination</label>
              <input
                type="text"
                value={hero.ctaLink || ''}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...hero, ctaLink: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand Story Editor */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-cocoa-500/10 pb-4">
          <div>
            <h3 className="font-serif text-lg text-charcoal-700">2. Brand Story & Craftsmanship</h3>
            <p className="text-xs text-cocoa-500">Highlighting the Rajkot factory (Anant Garments) promise</p>
          </div>
          <button
            type="button"
            disabled={savingKey === 'brandStory'}
            onClick={() => handleUpdate('brandStory')}
            className="py-2 px-4 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-1.5"
          >
            {successKey === 'brandStory' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savingKey === 'brandStory' ? 'Saving...' : successKey === 'brandStory' ? 'Saved!' : 'Save Story'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Story Heading</label>
            <input
              type="text"
              value={brandStory.title || ''}
              onChange={(e) => setSections({
                ...sections,
                brandStory: { ...brandStory, title: e.target.value }
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Story Content</label>
            <textarea
              rows={4}
              value={brandStory.content || ''}
              onChange={(e) => setSections({
                ...sections,
                brandStory: { ...brandStory, content: e.target.value }
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Lifestyle Moments Gallery Editor */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-cocoa-500/10 pb-4">
          <div>
            <h3 className="font-serif text-lg text-charcoal-700">3. Lifestyle Moments Gallery (&ldquo;Little Looks, Big Smiles&rdquo;)</h3>
            <p className="text-xs text-cocoa-500">Editorial baby fashion lookbook showcasing real infants in organic cotton</p>
          </div>
          <button
            type="button"
            disabled={savingKey === 'lifestyle'}
            onClick={() => handleUpdate('lifestyle')}
            className="py-2 px-4 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-1.5"
          >
            {successKey === 'lifestyle' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savingKey === 'lifestyle' ? 'Saving...' : successKey === 'lifestyle' ? 'Saved!' : 'Save Lifestyle'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Section Title</label>
              <input
                type="text"
                value={lifestyle.title || ''}
                onChange={(e) => setSections({
                  ...sections,
                  lifestyle: { ...lifestyle, title: e.target.value }
                })}
                placeholder="Little Looks, Big Smiles"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">Eyebrow Badge</label>
              <input
                type="text"
                value={lifestyle.subtitle || ''}
                onChange={(e) => setSections({
                  ...sections,
                  lifestyle: { ...lifestyle, subtitle: e.target.value }
                })}
                placeholder="LITTLE LOOKS, BIG SMILES"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-700 mb-1">Section Description</label>
            <input
              type="text"
              value={lifestyle.content || ''}
              onChange={(e) => setSections({
                ...sections,
                lifestyle: { ...lifestyle, content: e.target.value }
              })}
              placeholder="Real little wonders enjoying everyday snuggles in our gentle organic cotton fabrics."
              className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={lifestyle.ctaText || ''}
                onChange={(e) => setSections({
                  ...sections,
                  lifestyle: { ...lifestyle, ctaText: e.target.value }
                })}
                placeholder="Shop The Looks"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal-700 mb-1">CTA Destination Link</label>
              <input
                type="text"
                value={lifestyle.ctaLink || ''}
                onChange={(e) => setSections({
                  ...sections,
                  lifestyle: { ...lifestyle, ctaLink: e.target.value }
                })}
                placeholder="/shop"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cocoa-500/20 text-xs text-charcoal-700 focus:outline-none focus:border-strawberry-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
