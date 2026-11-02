import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal = 0 } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, valid: false, error: 'Coupon code required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Coupon "${cleanCode}" is invalid or inactive.`,
      }, { status: 404 });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Coupon "${cleanCode}" is not yet active.`,
      }, { status: 400 });
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Coupon "${cleanCode}" has expired.`,
      }, { status: 400 });
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Minimum order amount of ₹${coupon.minOrderValue} required for coupon "${cleanCode}".`,
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: `Coupon "${cleanCode}" usage limit has been reached.`,
      }, { status: 400 });
    }

    // Compute discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      // FIXED / FLAT
      discountAmount = Math.min(subtotal, coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, valid: false, error: error.message }, { status: 500 });
  }
}
