import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const ageGroup = searchParams.get('ageGroup');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = { slug: category };
    }
    if (gender && gender !== 'ALL') {
      where.gender = gender;
    }
    if (ageGroup && ageGroup !== 'ALL') {
      where.ageGroup = { contains: ageGroup };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }
    if (minPrice || maxPrice) {
      where.salePrice = {};
      if (minPrice) where.salePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.salePrice.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { fabricDetails: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { salePrice: 'asc' };
    if (sort === 'price-desc') orderBy = { salePrice: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      sku,
      description,
      shortDescription,
      fabricDetails,
      careInstructions,
      ageGroup,
      gender,
      regularPrice,
      salePrice,
      categoryId,
      isFeatured,
      isNewArrival,
      isBestSeller,
      images = [],
      variants = [],
    } = body;

    const product = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        description,
        shortDescription,
        fabricDetails,
        careInstructions,
        ageGroup,
        gender: gender || 'UNISEX',
        regularPrice: parseFloat(regularPrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        isBestSeller: Boolean(isBestSeller),
        images: {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || title,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku || `${sku}-${v.size}-${v.colorName}`,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#F3848F',
            stock: parseInt(v.stock) || 0,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
