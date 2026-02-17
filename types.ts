
export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  stock: number;
  image: string;
  category: string;
  ingredients?: string;
  nutritionalValue?: string;
  fssai?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';
export type PaymentStatus = 'Paid' | 'Pending' | 'COD';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  sellerNotes?: string;
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  expiryDate: string;
}

export interface StaticPage {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}
