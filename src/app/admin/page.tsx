import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Real-time Database queries
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    paidOrders,
    pendingOrdersCount,
    lowStockVariants,
    recentOrders,
    categories,
  ] = await Promise.all([
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: { totalAmount: true, createdAt: true },
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 15 } },
      include: { product: true },
      take: 6,
      orderBy: { stock: 'asc' },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { items: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-700">Business Overview</h1>
          <p className="text-xs text-cocoa-500 mt-1">
            Real-time sales, order lifecycle, and warehouse inventory at Rajkot unit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="py-2.5 px-5 rounded-full bg-strawberry-400 hover:bg-strawberry-500 text-white font-bold text-xs shadow-pill transition-all"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cocoa-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal-700">{formatPrice(totalRevenue)}</h3>
            <p className="text-[11px] text-emerald-600 mt-0.5">✓ From {paidOrders.length} settled orders</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cocoa-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-strawberry-100 text-strawberry-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal-700">{totalOrders}</h3>
            <p className="text-[11px] text-cocoa-500 mt-0.5">{pendingOrdersCount} orders awaiting dispatch</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cocoa-500 uppercase tracking-wider">Registered Parents</span>
            <div className="w-8 h-8 rounded-xl bg-babyblue-100 text-babyblue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal-700">{totalCustomers}</h3>
            <p className="text-[11px] text-babyblue-600 mt-0.5">Active retail customers</p>
          </div>
        </div>

        {/* Total Products & Stock */}
        <div className="p-5 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cocoa-500 uppercase tracking-wider">Active Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-butter-200 text-charcoal-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal-700">{totalProducts} SKUs</h3>
            <p className="text-[11px] text-amber-600 mt-0.5">{lowStockVariants.length} items on low stock alert</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg text-charcoal-700">Recent Customer Orders</h3>
              <p className="text-xs text-cocoa-500">Live order queue synced with database</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-strawberry-600 hover:text-strawberry-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-vanilla-100/70 text-cocoa-700 font-bold border-b border-cocoa-500/10">
                <tr>
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cocoa-500/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-vanilla-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-strawberry-600">
                      <Link href={`/order-success/${order.orderNumber}`} target="_blank">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-charcoal-700">{order.customerName}</td>
                    <td className="py-3 px-3 text-cocoa-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-3 font-bold text-charcoal-700">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-emerald-700">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-strawberry-100 text-strawberry-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-cocoa-500/10 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif text-lg text-charcoal-700">Stock Alerts</h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-strawberry-600 hover:text-strawberry-700"
            >
              Restock &rarr;
            </Link>
          </div>
          <p className="text-xs text-cocoa-500">Variants nearing threshold in warehouse</p>

          <div className="space-y-3">
            {lowStockVariants.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-2xl bg-vanilla-50 border border-cocoa-500/10 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-charcoal-700 line-clamp-1">{v.product.title}</h4>
                  <p className="text-cocoa-500 text-[11px]">{v.size} • {v.colorName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                    v.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {v.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
