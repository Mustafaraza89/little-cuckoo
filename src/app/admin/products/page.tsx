import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductCatalogManager from '@/components/admin/ProductCatalogManager';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return <ProductCatalogManager initialProducts={products as any} categories={categories} />;
}
