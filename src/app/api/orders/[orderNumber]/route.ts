import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderNumber } = params;
    const body = await req.json();
    const { status, trackingNumber, courierName, paymentStatus, adminNotes } = body;

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        paymentStatus: paymentStatus || undefined,
        adminNotes: adminNotes || undefined,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
