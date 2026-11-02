'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Layers, 
  Users, 
  Sliders, 
  Settings, 
  ExternalLink,
  Menu,
  X,
  Bell,
  LogOut,
  Sparkles,
  Search,
  ChevronDown,
  FolderTree,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Ticket,
  Image as ImageIcon,
  Star,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Catalog', href: '/admin/products', icon: Package },
  { label: 'Category Hierarchy', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders & Shipments', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: Layers },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Homepage CMS', href: '/admin/cms', icon: Sliders },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Coupons & Discounts', href: '/admin/coupons', icon: Ticket },
  { label: 'Reviews & Ratings', href: '/admin/reviews', icon: Star },
  { label: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Admin Users & Roles', href: '/admin/users', icon: ShieldAlert },
  { label: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminStats, setAdminStats] = useState<{ lowStockCount: number; recentOrders: any[] } | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // If on admin login page, render clean login view without admin shell
  const isLoginPage = pathname === '/admin/login';

  // Auth guard: check credentials on mount if not on /admin/login
  useEffect(() => {
    if (isLoginPage) return;

    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.user) {
          const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER'];
          if (!adminRoles.includes(data.user.role)) {
            router.push('/admin/login');
          } else {
            setCurrentUser(data.user);
          }
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  // Fetch live stats for notifications badge
  useEffect(() => {
    if (isLoginPage) return;

    fetch('/api/admin/dashboard')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setAdminStats(data);
      })
      .catch(() => {});
  }, [pathname, isLoginPage]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Compute dynamic breadcrumbs & title
  const currentNavItem = ADMIN_NAV.find(n => n.href === pathname) || {
    label: pathname === '/admin' ? 'Dashboard Overview' : 'Admin Console',
    href: pathname,
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-vanilla-50 flex flex-col md:flex-row text-charcoal-700">
      {/* Mobile Top App Bar (<768px) */}
      <div className="md:hidden bg-white border-b border-cocoa-500/10 px-3 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-charcoal-700 hover:bg-vanilla-200 transition-colors"
            aria-label="Open admin navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-28 h-7">
            <Image
              src="/logo/little_cuckoo_horizontal.svg"
              alt="Little Cuckoo Admin"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile Notifications Trigger */}
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-full text-charcoal-700 hover:bg-vanilla-200 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {adminStats && adminStats.lowStockCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-strawberry-500 rounded-full" />
            )}
          </button>

          {/* Quick link to live store */}
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-cocoa-500 hover:text-strawberry-500 rounded-lg hover:bg-vanilla-200 transition-colors"
            title="Open Live Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sidebar Overlay on Mobile & Static Sidebar on Desktop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-cocoa-500/10 flex flex-col transform transition-transform duration-250 ease-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 sm:p-5 border-b border-cocoa-500/10 flex items-center justify-between">
          <Link href="/admin" className="relative w-36 h-9 block">
            <Image
              src="/logo/little_cuckoo_horizontal.svg"
              alt="Little Cuckoo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-cocoa-500 hover:bg-vanilla-200 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enterprise Unit Identification */}
        <div className="px-4 py-2.5 bg-vanilla-100/70 border-b border-cocoa-500/10 flex items-center justify-between text-xs">
          <span className="font-bold text-strawberry-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-strawberry-400" />
            <span>HQ Console</span>
          </span>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-cocoa-500/10 text-cocoa-500">
            Rajkot, GJ
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-strawberry-400 text-white shadow-pill'
                    : 'text-cocoa-700 hover:bg-vanilla-100 hover:text-charcoal-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cocoa-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with Organization Info */}
        <div className="p-3.5 border-t border-cocoa-500/10 space-y-2 bg-vanilla-50/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-white transition-colors border border-transparent hover:border-cocoa-500/10"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-strawberry-500" />
              <span>Customer Storefront</span>
            </span>
            <span className="text-[10px] text-cocoa-400">↗</span>
          </Link>

          <div className="px-3 py-2 rounded-xl bg-white border border-cocoa-500/10 text-[11px] text-cocoa-500">
            <p className="font-bold text-charcoal-700">{BRAND.legalName}</p>
            <p className="font-mono text-[10px] text-cocoa-400">GST: {BRAND.gstin}</p>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop/Tablet Header Bar */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-cocoa-500/10 px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
          {/* Breadcrumbs & Title */}
          <div className="flex items-center gap-2 text-xs">
            <Link href="/admin" className="text-cocoa-400 hover:text-strawberry-500 transition-colors">
              Admin
            </Link>
            <span className="text-cocoa-300">/</span>
            <span className="font-bold text-charcoal-700">{currentNavItem.label}</span>
          </div>

          {/* Center Search Input */}
          <div className="relative w-64 lg:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search SKUs, orders, customers..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-vanilla-50 border border-cocoa-500/15 rounded-full focus:outline-none focus:border-strawberry-400 transition-colors"
            />
          </div>

          {/* Right Action Icons: Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-charcoal-700 hover:text-strawberry-500 hover:bg-vanilla-100 rounded-full relative transition-colors"
                aria-label="Admin notifications"
              >
                <Bell className="w-4 h-4" />
                {adminStats && adminStats.lowStockCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-strawberry-500 rounded-full animate-ping" />
                )}
                {adminStats && adminStats.lowStockCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-strawberry-500 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-cocoa-500/10 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-cocoa-500/10 pb-2 mb-3">
                    <h4 className="text-xs font-bold text-charcoal-700">Stock & Order Alerts</h4>
                    <span className="text-[10px] bg-strawberry-100 text-strawberry-700 font-bold px-2 py-0.5 rounded-full">
                      {adminStats?.lowStockCount || 0} alerts
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {adminStats && adminStats.lowStockCount > 0 ? (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900">
                            {adminStats.lowStockCount} Variants Under Threshold
                          </p>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            Check inventory management to replenish units.
                          </p>
                          <Link
                            href="/admin/inventory"
                            onClick={() => setNotificationsOpen(false)}
                            className="inline-block mt-1.5 text-[11px] font-bold text-amber-800 underline hover:text-amber-900"
                          >
                            Restock Inventory Now →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-cocoa-400">
                        <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                        <p className="text-xs">All inventory levels are healthy.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-3 py-1 border-l border-cocoa-500/15 hover:opacity-90 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-strawberry-100 text-strawberry-700 font-bold text-xs flex items-center justify-center">
                  VB
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-charcoal-700 leading-none">Vadaliya Bhimjibhai</p>
                  <p className="text-[10px] text-cocoa-400 leading-tight mt-0.5">Proprietor (ANANT)</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-cocoa-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cocoa-500/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-cocoa-500/10 mb-1">
                    <p className="text-xs font-bold text-charcoal-700">Vadaliya Bhimjibhai Muljibhai</p>
                    <p className="text-[11px] text-cocoa-400 truncate">{BRAND.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono bg-vanilla-200 px-1.5 py-0.5 rounded text-cocoa-600">
                      GSTIN: {BRAND.gstin}
                    </span>
                  </div>

                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-700 hover:bg-vanilla-100 rounded-xl transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-cocoa-400" />
                    <span>Store Configuration</span>
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-700 hover:bg-vanilla-100 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cocoa-400" />
                    <span>Open Live Storefront</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-strawberry-600 hover:bg-strawberry-50 rounded-xl transition-colors text-left font-semibold mt-1 border-t border-cocoa-500/10 pt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
