'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

interface Props {
  initialCategories: CategoryItem[];
}

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
    bannerUrl: '',
    sortOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
      bannerUrl: '',
      sortOrder: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      bannerUrl: cat.bannerUrl || '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        imageUrl: formData.imageUrl,
        bannerUrl: formData.bannerUrl,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };

      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update category');

        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...data.category } : c));
        setMessage({ type: 'success', text: `Category "${data.category.name}" updated successfully.` });
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create category');

        setCategories(prev => [...prev, { ...data.category, _count: { products: 0 } }]);
        setMessage({ type: 'success', text: `New Category "${data.category.name}" added to catalog.` });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setCategories(prev => prev.filter(c => c.id !== id));
      setMessage({ type: 'success', text: `Category "${name}" removed.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete category' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Category Hierarchy</h1>
          <p className="text-xs text-cocoa-500 mt-1">
            Manage product collections, banner aesthetics, and storefront taxonomy.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="py-2.5 px-5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
          >
            {/* Visual Thumbnail */}
            <div className="relative h-44 w-full bg-vanilla-200">
              <SafeImage
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=85'}
                alt={cat.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-charcoal-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                {cat._count?.products || 0} active products
              </span>
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-charcoal-700">{cat.name}</h3>
                  <span className="text-[10px] font-mono text-cocoa-400">Order: #{cat.sortOrder}</span>
                </div>
                <p className="text-xs text-cocoa-500 mt-1 line-clamp-2">
                  {cat.description || 'Collection designed for newborns and little ones.'}
                </p>
                <p className="text-[11px] font-mono text-strawberry-600 mt-1">/shop?category={cat.slug}</p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-cocoa-500/10 flex items-center justify-between">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-cocoa-700 hover:text-strawberry-500 inline-flex items-center gap-1"
                >
                  <span>View in Store</span>
                  <ExternalLink className="w-3 h-3 text-cocoa-400" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-cocoa-500/20 text-charcoal-700 hover:bg-strawberry-50 hover:text-strawberry-600 hover:border-strawberry-300 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-cocoa-500/10 overflow-hidden">
            <div className="p-5 border-b border-cocoa-500/10 flex items-center justify-between bg-vanilla-50">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-strawberry-500" />
                <h3 className="font-serif text-lg text-charcoal-700">
                  {editingCategory ? 'Edit Category' : 'Create New Collection'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1 text-cocoa-400 hover:text-charcoal-700 rounded-full hover:bg-vanilla-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-cocoa-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Organic Swaddles & Blankets"
                  className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                />
              </div>

              <div>
                <label className="block font-bold text-cocoa-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. organic-swaddles (auto-generated if blank)"
                  className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-cocoa-700 mb-1">Curated Baby Photography Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                />
              </div>

              <div>
                <label className="block font-bold text-cocoa-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief narrative for category header..."
                  className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-strawberry-500 focus:ring-strawberry-400"
                    />
                    <span className="font-semibold text-charcoal-700">Display in Navigation</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-cocoa-500/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="py-2 px-4 rounded-full border border-cocoa-500/20 text-cocoa-700 font-semibold hover:bg-vanilla-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2 px-6 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold shadow-pill transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
