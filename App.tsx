
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
import { StaticPageView } from './pages/StaticPageView';
import { Product } from './types';
import { Download, FileText, Package, Layout } from 'lucide-react';
import { generateInvoicePDF } from './utils/invoiceGenerator';

const App: React.FC = () => {
  const { 
    user, login, logout, products, cart, addToCart, 
    updateCartQuantity, removeFromCart, orders, placeOrder, 
    loading, updateOrderStatus, updateOrderNotes, addProduct, updateProduct, deleteProduct,
    appliedCoupon, applyCoupon, removeCoupon,
    staticPages, updateStaticPage
  } = useStore();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        return selectedProduct ? <ProductDetail product={selectedProduct} onAddToCart={addToCart} onNavigate={setCurrentPage} /> : <Home products={products} onNavigate={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
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
                 Recent Purchase History
               </h3>
               
               {orders.filter(o => o.userId === user?.id).length > 0 ? (
                 <div className="space-y-6">
                   {orders.filter(o => o.userId === user?.id).map(order => (
                     <div key={order.id} className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col lg:flex-row justify-between lg:items-center gap-8 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group">
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
                        
                        <div className="flex items-center gap-4">
                          {order.orderStatus !== 'Pending' ? (
                            <button 
                              onClick={() => generateInvoicePDF(order)}
                              className="w-full lg:w-auto flex items-center justify-center gap-2 bg-white text-organic-primary border border-organic-200 px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-organic-primary hover:text-white hover:border-organic-primary transition-all shadow-sm active:scale-95"
                            >
                              <Download size={18} /> Download Invoice PDF
                            </button>
                          ) : (
                            <div className="w-full lg:w-auto text-center text-[10px] font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-6 py-3.5 rounded-2xl border border-yellow-100 italic">
                              Awaiting Seller Confirmation
                            </div>
                          )}
                        </div>
                     </div>
                   ))}
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
