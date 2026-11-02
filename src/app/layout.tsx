import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import AppShell from '@/components/layout/AppShell';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Little Cuckoo — Made for Little Wonders | Premium Organic Baby Clothing',
    template: '%s | Little Cuckoo',
  },
  description: 'Pure 100% GOTS certified combed organic cotton baby apparel. Hypoallergenic, kind to sensitive skin, and crafted with love in Rajkot, Gujarat by Anant Garments.',
  keywords: [
    'baby clothes',
    'organic baby clothing',
    'newborn rompers',
    'baby gift sets',
    'GOTS organic cotton babywear',
    'Little Cuckoo',
    'Anant Garments',
    'Rajkot',
  ],
  themeColor: '#FFF8ED',
  authors: [{ name: 'ANANT GARMENTS', url: 'https://littlecuckoo.com' }],
  creator: 'ANANT GARMENTS, Rajkot',
  publisher: 'Little Cuckoo',
  openGraph: {
    title: 'Little Cuckoo — Made for Little Wonders',
    description: 'Wholesome, silky-soft organic baby clothes designed to protect delicate newborn skin.',
    url: 'https://littlecuckoo.com',
    siteName: 'Little Cuckoo',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Little Cuckoo Organic Baby Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Little Cuckoo — Made for Little Wonders',
    description: '100% GOTS organic cotton baby apparel crafted in Rajkot, Gujarat.',
    images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-vanilla-100 text-charcoal-700">
        <CartProvider>
          <WishlistProvider>
            <AppShell>{children}</AppShell>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
