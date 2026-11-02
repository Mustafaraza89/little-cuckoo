import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Order reference required' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let verified = false;

    if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      // Cryptographic signature check: hmac_sha256(order_id + "|" + payment_id, secret)
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      verified = expectedSignature === razorpaySignature;
    } else {
      // Mock / Dev payment verification
      verified = true;
    }

    if (!verified) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order in database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      order: {
        orderNumber: updated.orderNumber,
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        totalAmount: updated.totalAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
