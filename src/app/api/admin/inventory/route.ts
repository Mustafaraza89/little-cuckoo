import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const lowStockOnly = searchParams.get('lowStock') === 'true';

    const where: any = {};
    if (lowStockOnly) {
      where.stock = { lte: 10 };
    }

    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: {
          select: { id: true, title: true, sku: true, images: true },
        },
        stockHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { stock: 'asc' },
    });

    return NextResponse.json({ success: true, variants });
  } catch (error: any) {
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
    const { variantId, quantityChange, type = 'MANUAL_ADJUST', notes } = body;

    const change = parseInt(quantityChange);
    if (isNaN(change)) {
      return NextResponse.json({ success: false, error: 'Valid quantity change required' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stock: { increment: change },
        },
        include: { product: true },
      });

      await tx.inventoryTransaction.create({
        data: {
          variantId,
          type,
          quantityChange: change,
          notes: notes || `Stock updated by admin (${admin.email})`,
        },
      });

      return variant;
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
