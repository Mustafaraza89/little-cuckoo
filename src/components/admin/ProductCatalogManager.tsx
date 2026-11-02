'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles,
  Save,
  Tag,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';
import { CATEGORY_IMAGE_REGISTRY } from '@/lib/images';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Variant {
  id?: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
}

interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  gender: string;
  ageGroup?: string | null;
  regularPrice: number;
  salePrice?: number | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  status: string;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: Variant[];
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

const DEFAULT_SIZES = ['NB', '3-6M', '6-12M', '12-18M', '18-24M', '2-3Y'];

export default function ProductCatalogManager({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    categoryId: categories[0]?.id || '',
    gender: 'UNISEX',
    ageGroup: '0-24 Months',
    regularPrice: '',
    salePrice: '',
    description: '',
    fabricDetails: '100% GOTS Certified Organic Combed Cotton (180 GSM). Hypoallergenic flatlock seams.',
    careInstructions: 'Gentle cycle machine wash cold at 30°C. Non-chlorine bleach only. Tumble dry low.',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    status: 'PUBLISHED',
    primaryImageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
    variants: DEFAULT_SIZES.map(size => ({
      size,
      colorName: 'Vanilla Cream',
      colorHex: '#FFF8ED',
      stock: 25,
      sku: '',
    })),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      sku: '',
      categoryId: categories[0]?.id || '',
      gender: 'UNISEX',
      ageGroup: '0-24 Months',
      regularPrice: '',
      salePrice: '',
      description: '',
      fabricDetails: '100% GOTS Certified Organic Combed Cotton (180 GSM). Hypoallergenic flatlock seams.',
      careInstructions: 'Gentle cycle machine wash cold at 30°C. Non-chlorine bleach only. Tumble dry low.',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      status: 'PUBLISHED',
      primaryImageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
      variants: DEFAULT_SIZES.map(size => ({
        size,
        colorName: 'Vanilla Cream',
        colorHex: '#FFF8ED',
        stock: 25,
        sku: '',
      })),
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      categoryId: p.categoryId,
      gender: p.gender,
      ageGroup: p.ageGroup || '0-24 Months',
      regularPrice: p.regularPrice.toString(),
      salePrice: p.salePrice ? p.salePrice.toString() : '',
      description: p.description,
      fabricDetails: p.fabricDetails || '',
      careInstructions: p.careInstructions || '',
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      status: p.status,
      primaryImageUrl: p.images[0]?.url || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
      variants: p.variants.map(v => ({
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        stock: v.stock,
        sku: v.sku,
        id: v.id,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: formData.sku,
        categoryId: formData.categoryId,
        gender: formData.gender,
        ageGroup: formData.ageGroup,
        regularPrice: parseFloat(formData.regularPrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        description: formData.description,
        fabricDetails: formData.fabricDetails,
        careInstructions: formData.careInstructions,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        status: formData.status,
        images: [{ url: formData.primaryImageUrl, altText: formData.title }],
        variants: formData.variants,
      };

      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update product');

        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
        setMessage({ type: 'success', text: `Product "${data.product.title}" updated successfully!` });
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create product');

        setProducts(prev => [data.product, ...prev]);
        setMessage({ type: 'success', text: `Apparel item "${data.product.title}" created and published!` });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setProducts(prev => prev.filter(p => p.id !== id));
      setMessage({ type: 'success', text: `Product "${title}" removed from catalog.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  // Filtered view
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;

    let matchesBadge = true;
    if (selectedBadge === 'BEST_SELLER') matchesBadge = p.isBestSeller;
    if (selectedBadge === 'NEW_ARRIVAL') matchesBadge = p.isNewArrival;
    if (selectedBadge === 'FEATURED') matchesBadge = p.isFeatured;

    return matchesSearch && matchesCategory && matchesBadge;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Product Catalog Management</h1>
          <p className="text-xs text-cocoa-500 mt-1">
            Real-time synchronization with customer storefront. Manage SKUs, variants, prices, and status.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="py-2.5 px-5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Apparel Item</span>
        </button>
      </div>

      {/* Alert Notifications */}
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cocoa-500/10 shadow-soft flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-vanilla-50 border border-cocoa-500/15 rounded-xl px-3 py-2 text-cocoa-700 focus:outline-none focus:border-strawberry-400"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Badge Filter */}
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="text-xs bg-vanilla-50 border border-cocoa-500/15 rounded-xl px-3 py-2 text-cocoa-700 focus:outline-none focus:border-strawberry-400"
          >
            <option value="ALL">All Badges</option>
            <option value="BEST_SELLER">Best Sellers</option>
            <option value="NEW_ARRIVAL">New Arrivals</option>
            <option value="FEATURED">Featured Items</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100/70 text-cocoa-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="py-3 px-4">Item & Visual</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Variants / Stock</th>
                <th className="py-3 px-4">Badges & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cocoa-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                  const primaryImage = p.images[0]?.url || 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-vanilla-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-vanilla-200 shrink-0">
                            <SafeImage src={primaryImage} alt={p.title} fill className="object-cover" />
                          </div>
                          <div>
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-semibold text-charcoal-700 hover:text-strawberry-500 inline-flex items-center gap-1"
                            >
                              <span>{p.title}</span>
                              <ExternalLink className="w-3 h-3 text-cocoa-300" />
                            </Link>
                            <p className="text-cocoa-400 text-[11px]">{p.gender} • {p.ageGroup || 'All ages'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-cocoa-700">
                        {p.category.name}
                      </td>

                      <td className="py-3 px-4 font-mono text-cocoa-500 text-[11px]">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-charcoal-700">
                          {formatPrice(p.salePrice || p.regularPrice)}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-cocoa-300 line-through block">
                            {formatPrice(p.regularPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-charcoal-700">{p.variants.length} sizes</span>
                        <span
                          className={`block text-[11px] font-bold ${
                            totalStock === 0
                              ? 'text-rose-600'
                              : totalStock <= 20
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              p.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-vanilla-200 text-cocoa-600'
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.isBestSeller && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-butter-200 text-charcoal-700">
                              Best Seller
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-babyblue-100 text-babyblue-700">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg border border-cocoa-500/20 text-charcoal-700 hover:bg-strawberry-50 hover:text-strawberry-600 hover:border-strawberry-300 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-cocoa-500/10 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-cocoa-500/10 flex items-center justify-between bg-vanilla-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-strawberry-500" />
                <h3 className="font-serif text-lg text-charcoal-700">
                  {editingProduct ? 'Edit Apparel Product' : 'Add New Apparel Item'}
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

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-cocoa-700 mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Organic Cotton Kimono Tie Romper"
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. LC-RMP-KIMONO-01"
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400 font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Regular Price */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Regular MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    placeholder="e.g. 899"
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Special Sale Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="e.g. 699 (leave blank if no sale)"
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Target Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  >
                    <option value="UNISEX">Unisex (All Babies)</option>
                    <option value="BOY">Baby Boy</option>
                    <option value="GIRL">Baby Girl</option>
                  </select>
                </div>

                {/* Age Group */}
                <div>
                  <label className="block font-bold text-cocoa-700 mb-1">Age Range</label>
                  <input
                    type="text"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    placeholder="e.g. 0-24 Months"
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Primary Image URL */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-cocoa-700 mb-1">Primary Product Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.primaryImageUrl}
                    onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-cocoa-700 mb-1">Full Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed craftsmanship narrative, fabric feel, and baby safety..."
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Fabric Details */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-cocoa-700 mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={formData.fabricDetails}
                    onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-vanilla-50 border border-cocoa-500/15 rounded-xl focus:outline-none focus:border-strawberry-400"
                  />
                </div>

                {/* Badges & Status */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-cocoa-500/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded text-strawberry-500 focus:ring-strawberry-400"
                    />
                    <span className="font-semibold text-charcoal-700">Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded text-strawberry-500 focus:ring-strawberry-400"
                    />
                    <span className="font-semibold text-charcoal-700">New Arrival Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-strawberry-500 focus:ring-strawberry-400"
                    />
                    <span className="font-semibold text-charcoal-700">Featured on Homepage</span>
                  </label>
                </div>

                {/* Variants & Stock Matrix */}
                <div className="sm:col-span-2 pt-2 border-t border-cocoa-500/10">
                  <h4 className="font-bold text-cocoa-700 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-strawberry-500" />
                    <span>Variant Inventory Allocation (Stock per size)</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {formData.variants.map((v, idx) => (
                      <div key={v.size} className="bg-vanilla-50 p-2.5 rounded-xl border border-cocoa-500/10 text-center">
                        <span className="font-bold text-charcoal-700 block mb-1">{v.size}</span>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[idx].stock = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, variants: newVariants });
                          }}
                          className="w-full px-2 py-1 bg-white border border-cocoa-500/20 rounded-lg text-center font-bold text-charcoal-700"
                        />
                        <span className="text-[10px] text-cocoa-400 mt-1 block">units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  <span>{isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
