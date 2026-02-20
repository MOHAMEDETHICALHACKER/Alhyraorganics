
import { Product, StaticPage } from './types';

export const BUSINESS_WHATSAPP = "919751311724";

// Permanent Seller Credentials
export const SELLER_EMAIL = "admin@alhyra.com";
export const SELLER_PASSWORD = "AlHyraAdmin786"; // Secure permanent password

export const INITIAL_STATIC_PAGES: StaticPage[] = [
  {
    id: 'about',
    title: 'About Us',
    content: 'Al Hyra Organics was founded with a single mission: to provide pure, traditional, and chemical-free nutrition to modern families. Our journey started in 2015 when we realized the lack of authentic health malts in the market. Today, we serve thousands of happy customers with our signature ABC Malt and other organic offerings.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: 'We are here to help! \n\nEmail: support@alhyra.com\nPhone: +91 97513 11724\nAddress: Al Hyra Organics, Industrial Estate, Tamil Nadu, India.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. We only collect information necessary to process your orders and improve your shopping experience. We never share your data with third parties.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    content: 'If you are not satisfied with your purchase, you can return unopened products within 7 days of delivery for a full refund. Please contact our support team to initiate a return.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    content: 'By using our website, you agree to our terms of service. All products are subject to availability. Prices may change without prior notice.',
    lastUpdated: new Date().toISOString()
  }
];

export const PRELOADED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ABC Malt',
    description: 'Apple, Beetroot, and Carrot mix for ultimate vitality.',
    price: 225,
    weight: '250g',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    category: 'Health Mix',
    ingredients: 'Dehydrated Apple, Beetroot, Carrot, Country Sugar, Cardamom.',
    nutritionalValue: 'Energy: 380kcal, Protein: 4g, Iron: 12mg',
    fssai: '22423567000123',
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Beetroot Malt',
    description: 'Rich in iron and antioxidants, perfect for natural energy.',
    price: 175,
    weight: '250g',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1596525753634-93302da93673?auto=format&fit=crop&w=800&q=80',
    category: 'Health Mix',
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Multigrain Mix',
    description: 'The complete breakfast solution for all ages.',
    price: 200,
    weight: '250g',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
    category: 'Breakfast',
    rating: 4.7,
    reviewCount: 56
  },
  {
    id: '4',
    name: 'Carrot Malt',
    description: 'Natural eye-health booster made with farm-fresh carrots.',
    price: 175,
    weight: '250g',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d601?auto=format&fit=crop&w=800&q=80',
    category: 'Health Mix',
    rating: 4.3,
    reviewCount: 42
  },
  {
    id: '5',
    name: 'Red Banana Malt',
    description: 'Energy dense malt specifically for growing kids.',
    price: 185,
    weight: '250g',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1623081048684-25cb27e75344?auto=format&fit=crop&w=800&q=80',
    category: 'Kids Nutrition',
    fssai: '22424309000052',
    rating: 4.9,
    reviewCount: 210
  },
  {
    id: '6',
    name: 'Talbina',
    description: 'Sunnah food made from Barley for heart health.',
    price: 125,
    weight: '250g',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1640188636418-4e1a00a4d07b?auto=format&fit=crop&w=800&q=80',
    category: 'Prophetic Medicine',
    rating: 4.6,
    reviewCount: 75
  },
  {
    id: '7',
    name: 'Pumpkin Malt',
    description: 'Rare nutrition from pumpkin seeds and flesh.',
    price: 175,
    weight: '250g',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1570534536531-c3bcd6b963cc?auto=format&fit=crop&w=800&q=80',
    category: 'Health Mix',
    rating: 4.4,
    reviewCount: 31
  },
  {
    id: '8',
    name: 'Ragi Malt',
    description: 'Calcium-rich sprouted Ragi for bone strength.',
    price: 200,
    weight: '250g',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1610725663727-08799a997893?auto=format&fit=crop&w=800&q=80',
    category: 'Breakfast',
    rating: 4.8,
    reviewCount: 92
  }
];
