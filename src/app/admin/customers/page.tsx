import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: { select: { id: true, totalAmount: true } },
      addresses: true,
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Customer Directory</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          Registered parents, total lifetime purchases, and saved delivery destinations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-cocoa-500/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-vanilla-100/70 text-cocoa-700 font-bold border-b border-cocoa-500/10">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Registered On</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">City / State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-500/10">
              {customers.map((c) => {
                const totalSpend = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
                const primaryAddress = c.addresses[0];

                return (
                  <tr key={c.id} className="hover:bg-vanilla-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-charcoal-700">
                      {c.name}
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-cocoa-700 font-medium">{c.email}</p>
                      <p className="text-cocoa-500 text-[11px]">{c.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3 px-4 text-cocoa-500">
                      {formatDate(c.createdAt)}
                    </td>

                    <td className="py-3 px-4 font-semibold text-charcoal-700">
                      {c.orders.length} orders
                    </td>

                    <td className="py-3 px-4 font-bold text-strawberry-600">
                      {formatPrice(totalSpend)}
                    </td>

                    <td className="py-3 px-4 text-cocoa-700">
                      {primaryAddress ? `${primaryAddress.city}, ${primaryAddress.state}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
