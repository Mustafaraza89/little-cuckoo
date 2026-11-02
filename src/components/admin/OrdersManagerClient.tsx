'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrdersManagerClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber);
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o)));
        setSuccessMsg(`Order ${orderNumber} updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingUpdate = async (orderNumber: string, trackingNumber: string) => {
    try {
      await fetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, courierName: 'Delhivery' }),
      });
      setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? { ...o, trackingNumber } : o)));
      setSuccessMsg(`Tracking updated for ${orderNumber}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full font-bold border transition-colors ${
              filterStatus === s
                ? 'bg-strawberry-400 text-white border-strawberry-400 shadow-xs'
                : 'bg-white text-cocoa-700 border-cocoa-500/20 hover:border-strawberry-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100/70 text-cocoa-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">Items / Details</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Courier Tracking</th>
                <th className="py-3 px-4">Status Transition</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-vanilla-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-strawberry-600 block">{o.orderNumber}</span>
                    <span className="text-[11px] text-cocoa-500">{formatDate(o.createdAt)}</span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-charcoal-700">{o.customerName}</p>
                    <p className="text-[11px] text-cocoa-500">{o.phone}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-charcoal-700">{o.items?.length || 0} items</span>
                    <p className="text-[11px] text-cocoa-500 truncate max-w-xs">
                      {o.items?.map((i: any) => `${i.productTitle} (${i.variantTitle})`).join(', ')}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-charcoal-700">{formatPrice(o.totalAmount)}</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">{o.paymentMethod}</span>
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      defaultValue={o.trackingNumber || ''}
                      placeholder="Enter AWB #"
                      onBlur={(e) => handleTrackingUpdate(o.orderNumber, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-cocoa-500/20 text-xs font-mono w-32 focus:outline-none focus:border-strawberry-400"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      disabled={updatingId === o.orderNumber}
                      onChange={(e) => handleStatusChange(o.orderNumber, e.target.value)}
                      className="px-2.5 py-1 rounded-xl border border-cocoa-500/20 bg-white text-xs font-bold text-charcoal-700 focus:outline-none focus:border-strawberry-400"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/order-success/${o.orderNumber}`}
                      target="_blank"
                      className="py-1 px-2.5 rounded-lg border border-cocoa-500/20 text-[11px] font-semibold text-charcoal-700 hover:bg-vanilla-200"
                    >
                      Invoice ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
