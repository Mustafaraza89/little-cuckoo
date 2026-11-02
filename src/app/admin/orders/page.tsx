import React from 'react';
import { prisma } from '@/lib/prisma';
import OrdersManagerClient from '@/components/admin/OrdersManagerClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Order Management & Fulfillment</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          Monitor incoming customer orders, assign courier AWB tracking, and update dispatch status.
        </p>
      </div>

      <OrdersManagerClient initialOrders={orders} />
    </div>
  );
}
