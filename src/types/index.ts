export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'PRODUCT_MANAGER' | 'ORDER_MANAGER' | 'CUSTOMER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface ProductVariantItem {
  id: string;
  productId: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
  lowStockThreshold: number;
  priceAdjustment: number;
}

export interface ProductImageItem {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ReviewItem {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  ageGroup?: string | null;
  gender: 'BOY' | 'GIRL' | 'UNISEX';
  regularPrice: number;
  salePrice?: number | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  hsnCode: string;
  taxPercent: number;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: CategoryItem;
  images: ProductImageItem[];
  variants: ProductVariantItem[];
  reviews?: ReviewItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  id: string;
  cartId: string;
  variantId: string;
  variant: ProductVariantItem & {
    product: ProductItem;
  };
  quantity: number;
}

export interface CartType {
  id: string;
  items: CartItemType[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  couponCode?: string | null;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  guestEmail?: string | null;
  shippingAddress: string;
  billingAddress?: string | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'REFUNDED';
  paymentMethod: 'RAZORPAY' | 'COD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  estimatedDelivery?: string | null;
  invoiceNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemType[];
}

export interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  startDate: string;
  endDate?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}

export interface CMSSectionItem {
  id: string;
  sectionKey: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl?: string | null;
  extraData?: string | null;
  sortOrder: number;
  isEnabled: boolean;
}
