
import { useState, useEffect, useCallback } from 'react';
import { User, Product, CartItem, Order, Coupon, Role, StaticPage } from '../types';
import { PRELOADED_PRODUCTS, SELLER_EMAIL, SELLER_PASSWORD, INITIAL_STATIC_PAGES } from '../constants';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const useStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate Connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Data Listeners
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setProducts(items.length > 0 ? items : PRELOADED_PRODUCTS);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ ...doc.data(), code: doc.id } as Coupon)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
    });

    const unsubPages = onSnapshot(collection(db, 'staticPages'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StaticPage));
      setStaticPages(items.length > 0 ? items : INITIAL_STATIC_PAGES);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'staticPages');
    });

    return () => {
      unsubProducts();
      unsubCoupons();
      unsubPages();
    };
  }, []);

  // Orders Listener (User specific or Admin)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    let q;
    if (user.role === 'ADMIN') {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'orders'), where('userId', '==', user.id), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [user]);

  const login = useCallback(async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      if (!password) throw new Error('Password is required');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
        return { success: true, message: 'Login successful.' };
      } else {
        const newUser: User = {
          id: firebaseUser.uid,
          name: email.split('@')[0],
          email: email,
          role: email.toLowerCase() === SELLER_EMAIL.toLowerCase() ? 'ADMIN' : 'CUSTOMER',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
        return { success: true, message: 'Login successful.' };
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password!);
          const firebaseUser = userCredential.user;
          const newUser: User = {
            id: firebaseUser.uid,
            name: email.split('@')[0],
            email: email,
            role: email.toLowerCase() === SELLER_EMAIL.toLowerCase() ? 'ADMIN' : 'CUSTOMER',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
          return { success: true, message: 'Account created and logged in.' };
        } catch (regError: any) {
          return { success: false, message: regError.message };
        }
      }
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setCart([]);
    setAppliedCoupon(null);
  }, []);

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

  const addCoupon = useCallback(async (coupon: Coupon) => {
    try {
      await setDoc(doc(db, 'coupons', coupon.code), coupon);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `coupons/${coupon.code}`);
    }
  }, []);

  const deleteCoupon = useCallback(async (code: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', code));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `coupons/${code}`);
    }
  }, []);

  const placeOrder = useCallback(async (order: Order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
      
      for (const item of order.items) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock;
          await updateDoc(productRef, { stock: currentStock - item.quantity });
        }
      }

      setCart([]);
      setAppliedCoupon(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${order.id}`);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['orderStatus']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { orderStatus: status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  }, []);

  const updateOrderNotes = useCallback(async (orderId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { sellerNotes: notes });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${product.id}`);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { ...product });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    }
  }, []);

  const addRating = useCallback(async (productId: string, rating: number) => {
    try {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const p = productDoc.data() as Product;
        const currentRating = p.rating || 0;
        const currentCount = p.reviewCount || 0;
        const newCount = currentCount + 1;
        const newRating = Number(((currentRating * currentCount + rating) / newCount).toFixed(1));
        await updateDoc(productRef, { rating: newRating, reviewCount: newCount });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  }, []);

  const updateStaticPage = useCallback(async (id: string, title: string, content: string) => {
    try {
      await setDoc(doc(db, 'staticPages', id), {
        id,
        title,
        content,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `staticPages/${id}`);
    }
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
    addCoupon,
    deleteCoupon,
    addProduct,
    deleteProduct,
    updateProduct,
    addRating,
    staticPages,
    updateStaticPage
  };
};


