import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/product/ProductDetailClient';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { images: true },
  });

  if (!product) return { title: 'Product Not Found | Little Cuckoo' };

  return {
    title: `${product.title} | Little Cuckoo`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'PUBLISHED',
    },
    take: 4,
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
