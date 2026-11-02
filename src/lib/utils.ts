import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercent(regularPrice: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LC-${yearMonth}-${random}`;
}

export function generateInvoiceNumber(orderIdSuffix: string): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${orderIdSuffix.slice(-4).toUpperCase()}`;
}

export function formatDate(dateString: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}
