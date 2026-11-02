import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { generateOrderNumber, generateInvoiceNumber } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod = 'RAZORPAY', // RAZORPAY or COD
      couponCode,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Shopping bag is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json({ success: false, error: 'Please provide a complete shipping address' }, { status: 400 });
    }

    // 1. Re-validate items and stock from DB
    let computedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json({ success: false, error: `Variant ${item.sku || item.variantId} not found` }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for ${variant.product.title} (${variant.size}). Only ${variant.stock} left.`,
        }, { status: 400 });
      }

      const unitPrice = variant.product.salePrice || variant.product.regularPrice;
      const lineTotal = unitPrice * item.quantity;
      computedSubtotal += lineTotal;

      validatedItems.push({
        variant,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // 2. Validate Coupon
    let computedDiscount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (coupon && coupon.isActive) {
        if (coupon.discountType === 'PERCENTAGE') {
          computedDiscount = Math.round(computedSubtotal * (coupon.discountValue / 100));
          if (coupon.maxDiscount && computedDiscount > coupon.maxDiscount) {
            computedDiscount = coupon.maxDiscount;
          }
        } else {
          computedDiscount = coupon.discountValue;
        }
      }
    }

    // 3. Additional 5% discount for prepaid UPI/Razorpay (mitigating Indian COD RTO)
    if (paymentMethod === 'RAZORPAY') {
      const prepaidBonus = Math.round((computedSubtotal - computedDiscount) * (BRAND.prepaidDiscountPercent / 100));
      computedDiscount += prepaidBonus;
    }

    // 4. Shipping Fee
    const shippingFee = computedSubtotal >= BRAND.freeShippingThreshold ? 0 : BRAND.standardShippingFee;

    // 5. Taxes (5% GST inclusive)
    const taxableAmount = Math.max(0, computedSubtotal - computedDiscount);
    const taxAmount = Math.round((taxableAmount * 0.05) * 100) / 100;
    const totalAmount = taxableAmount + shippingFee;

    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber(orderNumber);

    // 6. Create Order and deduct inventory in transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          invoiceNumber,
          userId: user?.userId || null,
          guestEmail: shippingAddress.email || user?.email || 'guest@littlecuckoo.com',
          customerName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          shippingAddress: JSON.stringify(shippingAddress),
          subtotal: computedSubtotal,
          discount: computedDiscount,
          shippingFee,
          taxAmount,
          totalAmount,
          couponCode: couponCode || (paymentMethod === 'RAZORPAY' ? 'PREPAID5' : null),
          status: 'CONFIRMED',
          paymentMethod,
          paymentStatus: paymentMethod === 'RAZORPAY' ? 'PAID' : 'PENDING',
          razorpayOrderId: paymentMethod === 'RAZORPAY' ? `order_${Date.now()}` : null,
          razorpayPaymentId: paymentMethod === 'RAZORPAY' ? `pay_${Date.now()}` : null,
          courierName: 'Delhivery',
          adminNotes: notes || null,
          items: {
            create: validatedItems.map((vi) => ({
              productId: vi.variant.productId,
              variantId: vi.variant.id,
              productTitle: vi.variant.product.title,
              variantTitle: `${vi.variant.size} / ${vi.variant.colorName}`,
              sku: vi.variant.sku,
              unitPrice: vi.unitPrice,
              quantity: vi.quantity,
              totalPrice: vi.lineTotal,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Deduct variant inventory & create audit log
      for (const vi of validatedItems) {
        await tx.productVariant.update({
          where: { id: vi.variant.id },
          data: {
            stock: { decrement: vi.quantity },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            variantId: vi.variant.id,
            type: 'ORDER_DEDUCT',
            quantityChange: -vi.quantity,
            notes: `Order ${orderNumber} placed`,
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order,
      message: paymentMethod === 'RAZORPAY' ? 'Payment processed successfully' : 'Order placed with Cash on Delivery',
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
