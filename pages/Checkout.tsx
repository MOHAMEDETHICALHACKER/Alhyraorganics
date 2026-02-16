
import React, { useState } from 'react';
import { ShoppingBag, CreditCard, Truck, CheckCircle, MapPin, Phone, User as UserIcon, Building2, Home as HomeIcon, ShieldCheck, Lock, Clock, Ticket } from 'lucide-react';
import { CartItem, Order, User, Coupon } from '../types';
import { BUSINESS_WHATSAPP } from '../constants';

interface CheckoutProps {
  user: User | null;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onPlaceOrder: (order: Order) => void;
  onNavigate: (page: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ user, cart, appliedCoupon, onPlaceOrder, onNavigate }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [addressType, setAddressType] = useState<'home' | 'work'>('home');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage / 100) : 0;
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal - discountAmount + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerWhatsApp = (order: Order) => {
    const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    const discountText = order.couponCode ? `\nCoupon: ${order.couponCode} (-₹${order.discountAmount})` : '';
    const message = `Order Confirmation Request from Al Hyra Organics!
Order ID: ${order.id}
Status: Awaiting Seller Approval
Customer: ${order.address.fullName}
Items: ${itemsText}${discountText}
Total: ₹${order.totalAmount}
Address: ${order.address.street}, ${order.address.city}, ${order.address.zipCode}
Payment: ${order.paymentStatus}`;
    
    const url = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCompletePayment = () => {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user?.id || 'guest',
      items: cart,
      totalAmount: total,
      discountAmount: discountAmount,
      couponCode: appliedCoupon?.code,
      paymentStatus: paymentMethod === 'cod' ? 'COD' : 'Paid',
      orderStatus: 'Pending',
      address: { ...formData },
      createdAt: new Date().toISOString()
    };
    
    onPlaceOrder(newOrder);
    triggerWhatsApp(newOrder);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 text-yellow-600 animate-pulse">
          <Clock size={64} />
        </div>
        <h1 className="text-4xl font-bold text-organic-900 mb-4">Confirmation Request Sent!</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Thank you for choosing Al Hyra Organics. Your order request has been submitted. Our team is reviewing the <strong>product list and payment details</strong>. You will receive an update once it is approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate('shop')}
            className="bg-organic-primary text-white px-12 py-4 rounded-full font-bold shadow-xl shadow-organic-100"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => onNavigate('account')}
            className="bg-white border border-gray-200 text-organic-900 px-12 py-4 rounded-full font-bold"
          >
            Track Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {step === 'details' ? (
            <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-organic-50 rounded-xl flex items-center justify-center text-organic-primary">
                    <Truck size={24} />
                  </div>
                  Shipping Details
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-organic-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                  <div className="w-8 h-px bg-gray-200"></div>
                  <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold">2</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                        placeholder="e.g. Rahul Sharma" 
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                        placeholder="+91 00000 00000" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setAddressType('home')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${addressType === 'home' ? 'bg-white text-organic-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <HomeIcon size={14} /> Home
                    </button>
                    <button 
                      onClick={() => setAddressType('work')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${addressType === 'work' ? 'bg-white text-organic-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Building2 size={14} /> Work
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="street" 
                        value={formData.street} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                        placeholder="House No, Street, Area" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">City</label>
                    <input 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                      placeholder="City Name" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 px-1">State</label>
                      <input 
                        name="state" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                        placeholder="State" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 px-1">ZIP Code</label>
                      <input 
                        name="zipCode" 
                        value={formData.zipCode} 
                        onChange={handleInputChange} 
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 focus:bg-white focus:border-organic-primary/30 focus:ring-4 focus:ring-organic-primary/5 transition-all outline-none" 
                        placeholder="000000" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.zipCode}
                  onClick={() => setStep('payment')}
                  className="w-full bg-organic-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all shadow-xl shadow-organic-100 disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                >
                  Proceed to Payment
                  <div className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
                    <CreditCard size={18} />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 animate-slideIn">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-organic-50 rounded-xl flex items-center justify-center text-organic-primary">
                    <CreditCard size={24} />
                  </div>
                  Payment Method
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-organic-primary text-organic-primary flex items-center justify-center text-sm font-bold">1</div>
                  <div className="w-8 h-px bg-organic-primary"></div>
                  <span className="w-8 h-8 rounded-full bg-organic-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                </div>
              </div>
              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'razorpay' ? 'border-organic-primary bg-organic-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-organic-primary' : 'border-gray-300'}`}>
                      {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-organic-primary rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Razorpay (Cards, UPI, NetBanking)</p>
                      <p className="text-sm text-gray-500">Secure payment via Razorpay gateway</p>
                    </div>
                  </div>
                  <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-8" alt="Razorpay" />
                </div>

                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'cod' ? 'border-organic-primary bg-organic-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-organic-primary' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-organic-primary rounded-full"></div>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-500">Pay when you receive the package</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg"><Truck size={24} className="text-gray-400" /></div>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button 
                  onClick={() => setStep('details')}
                  className="px-8 py-5 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleCompletePayment}
                  className="flex-grow bg-organic-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all shadow-lg"
                >
                  Request Confirmation
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag size={20} className="text-organic-primary" /> Order Request
            </h3>
            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-4 mb-6 pr-2 border-b pb-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-6 space-y-3">
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 text-sm font-bold">
                  <span className="flex items-center gap-1"><Ticket size={14} /> Coupon ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-organic-primary pt-3 pb-6 border-b border-dashed">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              
              <div className="pt-6">
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Lock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">100% Secure Transaction</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <div className="flex gap-3">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-7" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-7" alt="Mastercard" />
                    <img src="https://img.icons8.com/color/48/000000/upi.png" className="h-7" alt="UPI" />
                  </div>
                  <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-5 opacity-70" alt="Razorpay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
