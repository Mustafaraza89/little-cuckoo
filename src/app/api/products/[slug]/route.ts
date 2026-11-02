import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
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
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'PUBLISHED',
      },
      take: 4,
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product, relatedProducts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription : existing.shortDescription,
        fabricDetails: body.fabricDetails !== undefined ? body.fabricDetails : existing.fabricDetails,
        careInstructions: body.careInstructions !== undefined ? body.careInstructions : existing.careInstructions,
        gender: body.gender !== undefined ? body.gender : existing.gender,
        ageGroup: body.ageGroup !== undefined ? body.ageGroup : existing.ageGroup,
        regularPrice: body.regularPrice !== undefined ? parseFloat(body.regularPrice) : existing.regularPrice,
        salePrice: body.salePrice !== undefined ? (body.salePrice ? parseFloat(body.salePrice) : null) : existing.salePrice,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
        isNewArrival: body.isNewArrival !== undefined ? Boolean(body.isNewArrival) : existing.isNewArrival,
        isBestSeller: body.isBestSeller !== undefined ? Boolean(body.isBestSeller) : existing.isBestSeller,
        status: body.status !== undefined ? body.status : existing.status,
        categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
      },
      include: {
        variants: true,
        images: true,
        category: true,
      },
    });

    // If variants were provided to update stock
    if (body.variants && Array.isArray(body.variants)) {
      for (const v of body.variants) {
        if (v.id) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              stock: parseInt(v.stock) || 0,
              colorName: v.colorName || undefined,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Cascade delete relations
    const variants = await prisma.productVariant.findMany({
      where: { productId: existing.id },
      select: { id: true },
    });
    const variantIds = variants.map((v) => v.id);

    if (variantIds.length > 0) {
      await prisma.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
    await prisma.productImage.deleteMany({ where: { productId: existing.id } });
    await prisma.review.deleteMany({ where: { productId: existing.id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: existing.id } });

    await prisma.product.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
