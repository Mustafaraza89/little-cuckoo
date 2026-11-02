'use client';

import React, { useState } from 'react';
import { Layers, Plus, Check, AlertTriangle } from 'lucide-react';

export default function InventoryManagerClient({ initialVariants }: { initialVariants: any[] }) {
  const [variants, setVariants] = useState(initialVariants);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleRestock = async (variantId: string, amount: number) => {
    setUpdatingId(variantId);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          quantityChange: amount,
          type: 'RESTOCK',
          notes: `Warehouse batch restock (+${amount}) by admin`,
        }),
      });

      const data = await res.json();
      if (data.success && data.variant) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, stock: data.variant.stock } : v))
        );
        setSuccessMsg(`Restocked variant with +${amount} units.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100/70 text-cocoa-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="py-3 px-4">Item & Variant</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Color</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-vanilla-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-charcoal-700">
                    {v.product.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-cocoa-500">
                    {v.sku}
                  </td>
                  <td className="py-3 px-4 font-bold text-charcoal-700">
                    {v.size}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 font-medium text-cocoa-700">
                      <span className="w-3 h-3 rounded-full border border-cocoa-500/20" style={{ backgroundColor: v.colorHex }} />
                      <span>{v.colorName}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-charcoal-700">{v.stock}</span> units
                  </td>
                  <td className="py-3 px-4">
                    {v.stock <= 5 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        Critical Low
                      </span>
                    ) : v.stock <= 15 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      type="button"
                      disabled={updatingId === v.id}
                      onClick={() => handleRestock(v.id, 10)}
                      className="py-1 px-2.5 rounded-lg bg-vanilla-200 hover:bg-vanilla-300 text-charcoal-700 text-xs font-bold transition-colors"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === v.id}
                      onClick={() => handleRestock(v.id, 25)}
                      className="py-1 px-2.5 rounded-lg bg-vanilla-200 hover:bg-vanilla-300 text-charcoal-700 text-xs font-bold transition-colors"
                    >
                      +25
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === v.id}
                      onClick={() => handleRestock(v.id, 50)}
                      className="py-1 px-2.5 rounded-lg bg-strawberry-100 hover:bg-strawberry-200 text-strawberry-700 text-xs font-bold transition-colors"
                    >
                      +50
                    </button>
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
