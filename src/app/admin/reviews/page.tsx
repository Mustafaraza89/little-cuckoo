'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Filter, AlertCircle, RefreshCw } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.reviews);
      } else {
        setError(data.error || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !currentStatus }),
      });
      if (res.ok) {
        setReviews(
          reviews.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'APPROVED') return r.isApproved;
    if (filter === 'PENDING') return !r.isApproved;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
            Customer Feedback
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Reviews & Ratings</h1>
          <p className="text-xs text-cocoa-500">
            Moderate, approve, and showcase verified parent reviews across the store.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-cocoa-500/20 text-xs font-bold text-cocoa-600 hover:bg-vanilla-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'APPROVED', 'PENDING'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-charcoal-700 text-white shadow-xs'
                : 'bg-white border border-cocoa-500/10 text-cocoa-600 hover:bg-vanilla-100'
            }`}
          >
            {tab} ({reviews.filter((r) => (tab === 'ALL' ? true : tab === 'APPROVED' ? r.isApproved : !r.isApproved)).length})
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-cocoa-400">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-10 text-center text-xs text-cocoa-400">No reviews found for this view.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-vanilla-100 text-charcoal-700 font-bold border-b border-cocoa-500/10">
                <tr>
                  <th className="p-4">Customer & Product</th>
                  <th className="p-4">Rating & Review</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-500/10 text-cocoa-600">
                {filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-vanilla-50/50 transition-colors">
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-charcoal-700">{rev.customerName}</p>
                      <p className="text-[11px] text-strawberry-600 truncate mt-0.5">
                        {rev.product?.title || 'General Store Review'}
                      </p>
                    </td>
                    <td className="p-4 max-w-md space-y-1">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      {rev.title && <p className="font-bold text-charcoal-700 text-xs">{rev.title}</p>}
                      <p className="text-xs text-cocoa-500 line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="p-4 text-cocoa-400 whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          rev.isApproved
                            ? 'border border-amber-300 text-amber-700 hover:bg-amber-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {rev.isApproved ? 'Unpublish' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-cocoa-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
