export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;          // Ej: "Chocolate Suizo - 1kg"
  flavor?: string;         // Ej: "Chocolate Suizo"
  size?: string;           // Ej: "1kg"
  priceInCents: number;    // Ej: 4500000 = $45.000 ARS
  compareAtPriceInCents?: number; // Ej: 5200000 = $52.000 ARS
  stock: number;
  weightGrams?: number;
  isDefault?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  brand: string;
  category: Category;
  categoryId: string;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  basePriceInCents: number;
  compareAtPriceInCents?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  servingInfo?: string;
  nutritionalHighlights?: string[];
}

export interface CartItem {
  id: string; // composite key: `${productId}-${variantId}`
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantTitle: string;
  flavor?: string;
  size?: string;
  priceInCents: number;
  compareAtPriceInCents?: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

export interface CustomerShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  deliveryMethod: 'shipping' | 'pickup';
  street: string;
  number: string;
  apartment?: string;
  neighborhood?: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';
export type FulfillmentStatus = 'unfulfilled' | 'preparing' | 'ready_for_pickup' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  unitPriceInCents: number;
  quantity: number;
  totalPriceInCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string;
  deliveryMethod: 'shipping' | 'pickup';
  shippingAddress?: CustomerShippingAddress;
  items: OrderItem[];
  subtotalInCents: number;
  shippingFeeInCents: number;
  discountInCents: number;
  totalInCents: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentMethod?: string;
  mercadopagoPaymentId?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
}

export interface StoreSettings {
  storeName: string;
  legalName: string;
  supportPhone: string;
  supportEmail: string;
  instagram: string;
  hoursDescription: string;
  pickupAddress: string;
  dispatchAddress: string;
  freeShippingThresholdInCents: number;
  flatShippingRateInCents: number;
}
