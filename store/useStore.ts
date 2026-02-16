
import { useState, useEffect, useCallback } from 'react';
import { User, Product, CartItem, Order, Coupon, Role, StaticPage } from '../types';
import { PRELOADED_PRODUCTS, SELLER_EMAIL, SELLER_PASSWORD, INITIAL_STATIC_PAGES } from '../constants';

// Simulated database initialization
const INITIAL_PRODUCTS = PRELOADED_PRODUCTS;
const INITIAL_ORDERS: Order[] = [];
const INITIAL_COUPONS: Coupon[] = [
  { code: 'ORGANIC10', discountPercentage: 10, expiryDate: '2025-12-31' },
  { code: 'FREESHIP', discountPercentage: 0, expiryDate: '2025-12-31' } // Special case handled in UI
];

export const useStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [staticPages, setStaticPages] = useState<StaticPage[]>(INITIAL_STATIC_PAGES);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  // Updated Authentication logic with validation
  const login = useCallback(async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // Admin Verification
    if (email.toLowerCase() === SELLER_EMAIL.toLowerCase()) {
      if (password === SELLER_PASSWORD) {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Al Hyra Admin',
          email: SELLER_EMAIL,
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        };
        setUser(adminUser);
        setLoading(false);
        return { success: true, message: 'Welcome to the Seller Portal.' };
      } else {
        setLoading(false);
        return { success: false, message: 'Invalid Admin password.' };
      }
    }

    // Default Customer Login (Simplified for production simulation)
    const customerUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString()
    };
    setUser(customerUser);
    setLoading(false);
    return { success: true, message: 'Login successful.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  // Cart logic
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // Coupon logic
  const applyCoupon = useCallback((code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      const expiry = new Date(coupon.expiryDate);
      if (expiry >= new Date()) {
        setAppliedCoupon(coupon);
        return { success: true, message: 'Coupon applied successfully!' };
      }
      return { success: false, message: 'Coupon has expired.' };
    }
    return { success: false, message: 'Invalid coupon code.' };
  }, [coupons]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Order logic
  const placeOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    // Update stock
    setProducts(prev => prev.map(p => {
      const orderItem = order.items.find(item => item.id === p.id);
      if (orderItem) {
        return { ...p, stock: p.stock - orderItem.quantity };
      }
      return p;
    }));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  }, []);

  const updateOrderNotes = useCallback((orderId: string, notes: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, sellerNotes: notes } : o));
  }, []);

  // Admin Product logic
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  // Static Pages logic
  const updateStaticPage = useCallback((id: string, title: string, content: string) => {
    setStaticPages(prev => prev.map(page => 
      page.id === id ? { ...page, title, content, lastUpdated: new Date().toISOString() } : page
    ));
  }, []);

  return {
    user,
    setUser,
    login,
    logout,
    loading,
    products,
    setProducts,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    orders,
    placeOrder,
    updateOrderStatus,
    updateOrderNotes,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addProduct,
    deleteProduct,
    updateProduct,
    staticPages,
    updateStaticPage
  };
};
