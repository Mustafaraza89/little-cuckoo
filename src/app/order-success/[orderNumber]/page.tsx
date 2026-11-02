import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { 
  CheckCircle2, 
  Printer, 
  Truck, 
  MapPin, 
  Package, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import PrintInvoiceButton from '@/components/ui/PrintInvoiceButton';
import { formatPrice, formatDate } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

export const revalidate = 0;

interface OrderSuccessPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  let shippingAddress: any = {};
  try {
    shippingAddress = JSON.parse(order.shippingAddress);
  } catch (e) {
    shippingAddress = {};
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-strawberry-500 uppercase tracking-widest">
          Order Successfully Placed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-700">
          Thank you, {order.customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-md mx-auto">
          Your order has been confirmed and scheduled for production & dispatch from our Rajkot manufacturing facility.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cocoa-500/10 shadow-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cocoa-500/10">
          <div>
            <span className="text-[11px] text-cocoa-500">Order Reference</span>
            <p className="font-mono text-base font-bold text-charcoal-700">{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-[11px] text-cocoa-500">Invoice Number</span>
            <p className="font-mono text-sm font-semibold text-cocoa-700">{order.invoiceNumber || 'INV-2026-PENDING'}</p>
          </div>
          <div>
            <span className="text-[11px] text-cocoa-500">Order Date</span>
            <p className="text-sm font-semibold text-charcoal-700">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-[11px] text-cocoa-500">Payment Status</span>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Delivery Progress Bar */}
        <div className="bg-vanilla-100 p-5 rounded-2xl border border-cocoa-500/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-700">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-strawberry-500" />
              <span>Courier: {order.courierName || 'Delhivery Express'}</span>
            </span>
            <span className="text-cocoa-500">Tracking: {order.trackingNumber || 'Assigned upon packing'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold pt-1">
            <div className="bg-emerald-500 text-white py-1.5 rounded-lg">1. Confirmed</div>
            <div className="bg-strawberry-300 text-white py-1.5 rounded-lg">2. In Production (Rajkot)</div>
            <div className="bg-vanilla-300 text-cocoa-700 py-1.5 rounded-lg">3. Out for Delivery</div>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h3 className="font-serif text-lg text-charcoal-700 mb-4">Ordered Items</h3>
          <div className="divide-y divide-cocoa-500/10">
            {order.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-charcoal-700">{item.productTitle}</h4>
                  <p className="text-cocoa-500 text-[11px]">{item.variantTitle} • SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-charcoal-700">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                  <p className="text-cocoa-500 font-semibold">{formatPrice(item.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax & Total Breakdown */}
        <div className="pt-4 border-t border-cocoa-500/10 space-y-1.5 text-xs text-cocoa-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Savings & Discounts</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-cocoa-300">
            <span>Inclusive 5% GST</span>
            <span>{formatPrice(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-charcoal-700 pt-3 border-t border-cocoa-500/10">
            <span>Total Paid</span>
            <span className="text-strawberry-500 text-lg">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Address and Tax Invoice Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-cocoa-500/10 text-xs">
          <div className="p-4 rounded-2xl bg-vanilla-50 border border-cocoa-500/10 space-y-1">
            <h4 className="font-bold text-charcoal-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-strawberry-500" />
              <span>Shipping Destination</span>
            </h4>
            <p className="font-medium text-charcoal-700">{shippingAddress.fullName}</p>
            <p className="text-cocoa-500">{shippingAddress.street}, {shippingAddress.apartment || ''}</p>
            <p className="text-cocoa-500">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
            <p className="text-cocoa-500">Phone: {order.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-vanilla-50 border border-cocoa-500/10 space-y-1">
            <h4 className="font-bold text-charcoal-700 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Manufacturer & GST Details</span>
            </h4>
            <p className="font-semibold text-charcoal-700">{BRAND.legalName}</p>
            <p className="text-cocoa-500">GSTIN: <span className="font-mono text-charcoal-700">{BRAND.gstin}</span></p>
            <p className="text-cocoa-500">UDYAM: <span className="font-mono text-charcoal-700">{BRAND.udyam}</span></p>
            <p className="text-cocoa-500">Factory: Shakti Krupa, Gondal Road, Rajkot 360002</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <PrintInvoiceButton />
        <Link
          href="/shop"
          className="py-3 px-8 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-colors flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/track-order"
          className="py-3 px-6 rounded-full bg-white hover:bg-vanilla-200 border border-cocoa-500/20 text-charcoal-700 font-semibold text-xs transition-colors"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}
