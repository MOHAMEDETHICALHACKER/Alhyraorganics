
import React, { useState } from 'react';
import { Plus, Ticket, Trash2, X, Sparkles, Calendar, Percent } from 'lucide-react';
import { Coupon } from '../types';

interface AdminCouponsProps {
  coupons: Coupon[];
  onAdd: (coupon: Coupon) => void;
  onDelete: (code: string) => void;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({ coupons, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 10,
    expiryDate: ''
  });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567000123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      code: formData.code.toUpperCase()
    });
    setIsModalOpen(false);
    setFormData({ code: '', discountPercentage: 10, expiryDate: '' });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Code Management</h1>
          <p className="text-gray-500">Create and manage discounts for your customers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-organic-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-organic-100 hover:bg-organic-900 transition-all"
        >
          <Plus size={20} /> Create Promo Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-organic-50 rounded-bl-[40px] flex items-center justify-center text-organic-primary">
              <Ticket size={24} />
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Coupon</span>
              <h3 className="text-2xl font-bold text-organic-900 mt-1">{coupon.code}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Percent size={16} className="text-organic-primary" />
                <span className="font-bold text-gray-700">{coupon.discountPercentage}% Discount</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-500">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => onDelete(coupon.code)}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Delete Coupon
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">New Promo Code</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Coupon Code</label>
                <div className="flex gap-2">
                  <input 
                    required
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="flex-grow bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none font-bold tracking-widest"
                    placeholder="E.G. SUMMER20"
                  />
                  <button 
                    type="button"
                    onClick={generateRandomCode}
                    className="p-4 bg-organic-50 text-organic-primary rounded-2xl hover:bg-organic-100 transition-all"
                    title="Generate Random Code"
                  >
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Discount Percentage (%)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={e => setFormData({...formData, discountPercentage: Number(e.target.value)})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Expiry Date</label>
                <input 
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 rounded-2xl font-bold text-gray-500 border hover:bg-gray-50 transition-all">Cancel</button>
                <button 
                  type="submit" 
                  className="flex-grow bg-organic-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-organic-100 hover:bg-organic-900 transition-all"
                >
                  Create Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
