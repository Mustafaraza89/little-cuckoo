import React from 'react';
import { prisma } from '@/lib/prisma';
import InventoryManagerClient from '@/components/admin/InventoryManagerClient';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: {
      product: { select: { title: true, sku: true } },
    },
    orderBy: { stock: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Inventory & Stock Adjustments</h1>
        <p className="text-xs text-cocoa-500 mt-1">
          Monitor variant-level stock counts, restock warehouse batches, and track automatic order deductions.
        </p>
      </div>

      <InventoryManagerClient initialVariants={variants} />
    </div>
  );
}
