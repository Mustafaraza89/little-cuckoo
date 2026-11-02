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

    // Live counts & aggregates
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      orders,
      lowStockVariants,
      recentOrders,
      categories,
    ] = await Promise.all([
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true, createdAt: true, status: true },
      }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 10 } },
        include: { product: true },
        take: 10,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { items: true },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrdersCount = await prisma.order.count({ where: { status: 'PENDING' } });
    const processingOrdersCount = await prisma.order.count({ where: { status: 'PROCESSING' } });
    const deliveredOrdersCount = await prisma.order.count({ where: { status: 'DELIVERED' } });

    // Group sales by day/recent
    const salesByDate: Record<string, number> = {};
    for (const o of orders) {
      const dateKey = o.createdAt.toISOString().split('T')[0];
      salesByDate[dateKey] = (salesByDate[dateKey] || 0) + o.totalAmount;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders: pendingOrdersCount,
        processingOrders: processingOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        lowStockCount: lowStockVariants.length,
      },
      lowStockVariants,
      recentOrders,
      categories,
      salesByDate,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
