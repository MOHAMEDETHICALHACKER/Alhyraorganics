
import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket, X } from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CartProps {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, 
  appliedCoupon, 
  onApplyCoupon, 
  onRemoveCoupon, 
  onUpdateQuantity, 
  onRemove, 
  onNavigate 
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage / 100) : 0;
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = () => {
    const result = onApplyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-organic-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="bg-organic-primary text-white px-12 py-4 rounded-full font-bold hover:bg-organic-900 transition-all shadow-xl shadow-organic-100"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <h1 className="text-4xl font-bold text-organic-900 mb-12">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.weight}</p>
                <div className="mt-2 text-organic-primary font-bold">₹{item.price}</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-1 px-2 border border-gray-100">
                <button 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-organic-primary"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-organic-primary"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-lg font-bold text-organic-900 min-w-[80px] text-right">
                ₹{item.price * item.quantity}
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => onNavigate('shop')}
            className="text-organic-primary font-bold flex items-center gap-2 hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1"><Ticket size={14} /> Coupon ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-organic-primary font-bold">FREE</span> : `₹${shipping}`}</span>
              </div>

              {!appliedCoupon && shipping > 0 && subtotal < 1000 && (
                <p className="text-[10px] text-organic-600 font-semibold bg-organic-50 p-2 rounded-lg text-center">Add ₹{999 - subtotal} more for Free Shipping!</p>
              )}

              <div className="border-t pt-4 flex justify-between text-xl font-bold text-organic-900">
                <span>Total</span>
                <span>₹{Math.max(0, total)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Have a Coupon?</label>
              {appliedCoupon ? (
                <div className="bg-organic-50 border border-organic-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-organic-primary text-white rounded-lg flex items-center justify-center">
                      <Ticket size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-organic-900">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-organic-700 font-medium">{appliedCoupon.discountPercentage}% OFF applied</p>
                    </div>
                  </div>
                  <button onClick={onRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                    placeholder="Enter code..."
                    className="flex-grow bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-organic-primary/20 outline-none transition-all"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={!couponInput}
                    className="bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>}
            </div>

            <button 
              onClick={() => onNavigate('checkout')}
              className="w-full bg-organic-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-organic-200"
            >
              Checkout Now <ArrowRight size={20} />
            </button>
            
            <div className="mt-8 pt-8 border-t flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 grayscale opacity-50" alt="Visa" />
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 grayscale opacity-50" alt="Mastercard" />
                <img src="https://img.icons8.com/color/48/000000/upi.png" className="h-6 grayscale opacity-50" alt="UPI" />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">100% Secure Payments Powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
