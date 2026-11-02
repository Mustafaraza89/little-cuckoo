'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../ui/SearchModal';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const { openCart, items } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);

  // If on admin routes, render ONLY children - completely clean and isolated admin experience
  if (isAdmin) {
    return <>{children}</>;
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-vanilla-100">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={openCart}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">{children}</main>

      <Footer />

      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
