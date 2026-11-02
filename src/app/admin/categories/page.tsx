import React from 'react';
import { prisma } from '@/lib/prisma';
import CategoryManager from '@/components/admin/CategoryManager';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return <CategoryManager initialCategories={categories as any} />;
}
