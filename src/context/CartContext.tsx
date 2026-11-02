'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRAND } from '@/lib/constants';

export interface CartItem {
  id: string; // unique cart item id (variantId or composite)
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  price: number;
  regularPrice: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  freeShippingProgress: number; // 0 to 100
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cuckoo_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('cuckoo_coupon');
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('cuckoo_cart', JSON.stringify(items));
      if (couponCode) {
        localStorage.setItem('cuckoo_coupon', couponCode);
      } else {
        localStorage.removeItem('cuckoo_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, couponCode, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }
      const newItem: CartItem = {
        ...item,
        id: `${item.variantId}_${Date.now()}`,
      };
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id && i.variantId !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id || i.variantId === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setCouponCode('WELCOME10');
      return { success: true, message: 'WELCOME10 applied! 10% discount added.' };
    }
    if (clean === 'CUCKOO5') {
      setCouponCode('CUCKOO5');
      return { success: true, message: 'CUCKOO5 applied! Extra 5% prepaid discount added.' };
    }
    if (clean === 'LITTLEWONDERS') {
      if (subtotal < 1499) {
        return { success: false, message: 'LITTLEWONDERS requires a minimum order of ₹1,499.' };
      }
      setCouponCode('LITTLEWONDERS');
      return { success: true, message: 'LITTLEWONDERS applied! ₹200 discount added.' };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (couponCode === 'WELCOME10') {
    discount = Math.round(subtotal * 0.10);
  } else if (couponCode === 'CUCKOO5') {
    discount = Math.round(subtotal * 0.05);
  } else if (couponCode === 'LITTLEWONDERS' && subtotal >= 1499) {
    discount = 200;
  }

  const shippingFee = subtotal >= BRAND.freeShippingThreshold || subtotal === 0 ? 0 : BRAND.standardShippingFee;
  const taxableAmount = Math.max(0, subtotal - discount);
  // 5% GST inclusive
  const taxAmount = Math.round((taxableAmount * 0.05) * 100) / 100;
  const total = taxableAmount + shippingFee;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / BRAND.freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, BRAND.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        taxAmount,
        total,
        freeShippingProgress,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
