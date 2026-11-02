import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, paymentStatus, trackingNumber, courierName, adminNotes } = body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (courierName !== undefined) data.courierName = courierName;
    if (adminNotes !== undefined) data.adminNotes = adminNotes;

    const updated = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
