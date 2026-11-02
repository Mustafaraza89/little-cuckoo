import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { amount, receipt, orderNumber } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // If live Razorpay API keys are configured, call Razorpay Orders API
    if (keyId && keySecret && !keyId.includes('mock') && !keyId.includes('test_mock')) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || orderNumber || `rcpt_${Date.now()}`,
          notes: {
            orderNumber: orderNumber || '',
            brand: 'Little Cuckoo',
          },
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        return NextResponse.json({ success: false, error: rzpData.error?.description || 'Razorpay order creation failed' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        orderId: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId,
      });
    }

    // Development & Test Mode: Generate valid simulated Razorpay Order ID
    const mockOrderId = `order_lc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_littlecuckoo_2026',
      isMock: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
