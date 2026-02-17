
import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminPages } from './pages/AdminPages';
import { AdminCoupons } from './pages/AdminCoupons';
import { StaticPageView } from './pages/StaticPageView';
import { Product, OrderStatus } from './types';
import { Download, FileText, Package, Layout, Ticket, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { generateInvoicePDF } from './utils/invoiceGenerator';

const ORDER_STAGES: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderTracker: React.FC<{ currentStatus: OrderStatus }> = ({ currentStatus }) => {
  const currentIndex = ORDER_STAGES.indexOf(currentStatus);

  return (
    <div className="py-6 px-4 bg-white rounded-3xl border border-gray-100 mt-4 animate-fadeIn">
      <div className="flex items-center justify-between relative">
        {ORDER_STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === ORDER_STAGES.length - 1;

          return (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center relative z-10 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-organic-primary text-white' : 
                  isCurrent ? 'bg-organic-100 text-organic-primary ring-4 ring-organic-50' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} fill={isCurrent ? 'currentColor' : 'none'} />}
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 text-center ${
                  isCurrent ? 'text-organic-primary' : 'text-gray-400'
                }`}>
                  {stage}
                </p>
              </div>
              {!isLast && (
                <div className="flex-1 h-1 bg-gray-100 -mt-6 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-organic-primary transition-all duration-1000"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { 
    user, login, logout, products, cart, addToCart, 
    updateCartQuantity, removeFromCart, orders, placeOrder, 
    loading, updateOrderStatus, updateOrderNotes, addProduct, updateProduct, deleteProduct,
    appliedCoupon, applyCoupon, removeCoupon,
    staticPages, updateStaticPage, addRating,
    coupons, addCoupon, deleteCoupon
  } = useStore();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Auth Redirect: If logged in, don't show login page
  useEffect(() => {
    if (user && currentPage === 'login') {
      setCurrentPage(user.role === 'ADMIN' ? 'admin-dashboard' : 'home');
    }
  }, [user, currentPage]);

  const toggleOrderExpansion = (orderId: string) => {
    const next = new Set(expandedOrders);
    if (next.has(orderId)) next.delete(orderId);
    else next.add(orderId);
    setExpandedOrders(next);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const renderPage = () => {
    // Shared Admin check: Redirect to login if trying to access admin pages while not an admin
    if (currentPage.startsWith('admin-') && user?.role !== 'ADMIN') {
      return (
        <Login 
          onLogin={async (email, password) => { 
            const result = await login(email, password); 
            return result;
          }} 
          loading={loading} 
        />
      );
    }

    // Static Pages Routing
    const staticPageMatch = staticPages.find(p => p.id === currentPage);
    if (staticPageMatch) {
      return <StaticPageView page={staticPageMatch} onBack={() => setCurrentPage('home')} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home products={products} onNavigate={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
      case 'shop':
        return <Shop products={products} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
      case 'product-detail':
        return selectedProduct ? <ProductDetail product={selectedProduct} onAddToCart={addToCart} onAddRating={addRating} onNavigate={setCurrentPage} /> : <Home products={products} onNavigate={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
      case 'cart':
        return (
          <Cart 
            cart={cart} 
            appliedCoupon={appliedCoupon}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onUpdateQuantity={updateCartQuantity} 
            onRemove={removeFromCart} 
            onNavigate={setCurrentPage} 
          />
        );
      case 'checkout':
        return <Checkout user={user} cart={cart} appliedCoupon={appliedCoupon} onPlaceOrder={placeOrder} onNavigate={setCurrentPage} />;
      case 'login':
        return (
          <Login 
            onLogin={async (email, password) => { 
              return await login(email, password); 
            }} 
            loading={loading} 
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard orders={orders} products={products} onNavigate={setCurrentPage} />;
      case 'admin-products':
        return <AdminProducts products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} onNavigate={setCurrentPage} />;
      case 'admin-orders':
        return <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} onUpdateNotes={updateOrderNotes} onNavigate={setCurrentPage} />;
      case 'admin-pages':
        return <AdminPages pages={staticPages} onUpdate={updateStaticPage} />;
      case 'admin-coupons':
        return <AdminCoupons coupons={coupons} onAdd={addCoupon} onDelete={deleteCoupon} />;
      case 'account':
        return (
          <div className="container mx-auto px-4 py-20 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                 <div>
                   <p className="text-xl font-bold text-organic-900">Hello, {user?.name}!</p>
                   <p className="text-gray-500 font-medium">{user?.email}</p>
                 </div>
                 <button 
                   onClick={logout}
                   className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100"
                 >
                   Sign Out
                 </button>
               </div>
               
               <h3 className="text-lg font-bold border-t pt-10 mb-8 flex items-center gap-2">
                 <Package size={22} className="text-organic-primary" />
                 Track My Orders
               </h3>
               
               {orders.filter(o => o.userId === user?.id).length > 0 ? (
                 <div className="space-y-6">
                   {orders.filter(o => o.userId === user?.id).map(order => {
                     const isExpanded = expandedOrders.has(order.id);
                     return (
                       <div key={order.id} className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group overflow-hidden">
                          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <p className="text-lg font-bold text-gray-900">{order.id}</p>
                                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                  order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><FileText size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="font-bold text-organic-900">₹{order.totalAmount.toFixed(2)}</span>
                                <span className="text-xs">{order.items.length} item(s) purchased</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <button 
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {isExpanded ? 'Hide Tracking' : 'Track Package'}
                              </button>
                              
                              {order.orderStatus !== 'Pending' ? (
                                <button 
                                  onClick={() => generateInvoicePDF(order)}
                                  className="flex items-center justify-center gap-2 bg-white text-organic-primary border border-organic-200 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-organic-primary hover:text-white hover:border-organic-primary transition-all shadow-sm"
                                >
                                  <Download size={16} /> Invoice PDF
                                </button>
                              ) : (
                                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-100 italic">
                                  Awaiting Confirmation
                                </div>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-8 pt-8 border-t border-gray-100 animate-fadeIn">
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Progress</p>
                               <OrderTracker currentStatus={order.orderStatus} />
                               
                               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-gray-50">
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping To</p>
                                    <p className="text-sm font-bold text-gray-800">{order.address.fullName}</p>
                                    <p className="text-xs text-gray-500">{order.address.street}, {order.address.city}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                                    <p className="text-sm font-bold text-gray-800">
                                      {order.orderStatus === 'Delivered' ? 'Delivered on time' : 'Within 3-5 business days'}
                                    </p>
                                    <p className="text-xs text-gray-500">Standard Organic Shipping</p>
                                  </div>
                               </div>
                            </div>
                          )}
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-gray-50/30 rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <Package size={40} />
                    </div>
                    <p className="text-gray-400 font-medium">No order history found for this account.</p>
                    <button 
                      onClick={() => setCurrentPage('shop')}
                      className="mt-6 bg-organic-primary text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-organic-900 transition-all shadow-lg shadow-organic-100"
                    >
                      Browse Store
                    </button>
                 </div>
               )}
            </div>
          </div>
        );
      default:
        return <Home products={products} onNavigate={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        user={user} 
        cart={cart} 
        onNavigate={setCurrentPage} 
        onLogout={() => { logout(); setCurrentPage('home'); }} 
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Admin Navigation */}
          {user?.role === 'ADMIN' && currentPage.startsWith('admin-') && (
            <div className="mb-10 flex gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-gray-100">
              <button 
                onClick={() => setCurrentPage('admin-dashboard')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${currentPage === 'admin-dashboard' ? 'bg-organic-primary text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setCurrentPage('admin-products')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${currentPage === 'admin-products' ? 'bg-organic-primary text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setCurrentPage('admin-orders')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${currentPage === 'admin-orders' ? 'bg-organic-primary text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Orders
              </button>
              <button 
                onClick={() => setCurrentPage('admin-pages')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${currentPage === 'admin-pages' ? 'bg-organic-primary text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                Pages
              </button>
              <button 
                onClick={() => setCurrentPage('admin-coupons')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${currentPage === 'admin-coupons' ? 'bg-organic-primary text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Ticket size={16} /> Promo Codes
                </div>
              </button>
            </div>
          )}
          {renderPage()}
        </div>
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
