
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, Package, Truck, Check, X, AlertCircle, ShoppingBag, CreditCard, User as UserIcon, MapPin, CheckSquare, Square, MessageSquare, ExternalLink, Clock } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onNavigate: (page: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateStatus, onUpdateNotes }) => {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Advanced Verification states
  const [verifiedItems, setVerifiedItems] = useState<Set<string>>(new Set());
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [tempSellerNotes, setTempSellerNotes] = useState('');

  useEffect(() => {
    if (!selectedOrder) {
      setVerifiedItems(new Set());
      setIsPaymentVerified(false);
      setTempSellerNotes('');
    } else {
      setTempSellerNotes(selectedOrder.sellerNotes || '');
    }
  }, [selectedOrder]);

  const toggleItemVerification = (itemId: string) => {
    const newSet = new Set(verifiedItems);
    if (newSet.has(itemId)) newSet.delete(itemId);
    else newSet.add(itemId);
    setVerifiedItems(newSet);
  };

  const filteredOrders = orders.filter(o => 
    (filter === 'All' || o.orderStatus === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || 
     o.address.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
    'Packed': 'bg-purple-100 text-purple-700 border-purple-200',
    'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Delivered': 'bg-green-100 text-green-700 border-green-200'
  };

  const allItemsVerified = selectedOrder ? verifiedItems.size === selectedOrder.items.length : false;

  const getWhatsAppMessage = (order: Order) => {
    const cleanPhone = order.address.phone.replace(/\D/g, '');
    const notesPart = tempSellerNotes ? `\n\nNotes from Seller: ${tempSellerNotes}` : '';
    const message = `Hello ${order.address.fullName}, your order ${order.id} at Al Hyra Organics has been APPROVED! 🌿 We are now preparing your package.\n\nTotal: ₹${order.totalAmount}${notesPart}\n\nThank you for choosing organic wellness!`;
    const phonePrefix = cleanPhone.startsWith('91') ? '' : '91';
    return {
      url: `https://wa.me/${phonePrefix}${cleanPhone}?text=${encodeURIComponent(message)}`,
      text: message
    };
  };

  const handleApprove = (order: Order) => {
    if (!allItemsVerified || !isPaymentVerified) return;

    if (onUpdateNotes) {
      onUpdateNotes(order.id, tempSellerNotes);
    }
    onUpdateStatus(order.id, 'Confirmed');
    
    const { url } = getWhatsAppMessage(order);
    window.open(url, '_blank');
    setSelectedOrder(null);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Review, verify and confirm organic wellness orders.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID or Name..."
              className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 w-full md:w-64 focus:ring-2 focus:ring-organic-primary/20 outline-none shadow-sm"
            />
          </div>
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold text-gray-600 outline-none shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Needs Review</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Order Details</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5 text-gray-700 font-medium">
                    {order.address.fullName}
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus === 'Pending' ? 'Needs Review' : order.orderStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          order.orderStatus === 'Pending' 
                          ? 'bg-organic-primary text-white hover:bg-organic-900' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {order.orderStatus === 'Pending' ? <CheckCircle size={14} /> : <Eye size={14} />}
                        {order.orderStatus === 'Pending' ? 'Review & Approve' : 'View Details'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Review & Approval Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slideUp flex flex-col h-[90vh]">
            
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-organic-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-organic-100">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Review Order {selectedOrder.id}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} /> Received {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm transition-all"><X size={24} /></button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Side: Verification Checklist */}
                <div className="lg:col-span-7 space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Package size={16} /> Product Availability Check
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${allItemsVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {verifiedItems.size} / {selectedOrder.items.length} Verified
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => {
                        const isVerified = verifiedItems.has(item.id);
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => toggleItemVerification(item.id)}
                            className={`flex items-center gap-4 p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                              isVerified 
                              ? 'bg-green-50/50 border-green-200' 
                              : 'bg-white border-gray-100 hover:border-organic-primary/30'
                            }`}
                          >
                            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                              <img src={item.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-grow">
                              <p className={`font-bold transition-all ${isVerified ? 'text-green-800 line-through opacity-50' : 'text-gray-800'}`}>
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price} • {item.weight}</p>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isVerified ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}>
                              <Check size={20} strokeWidth={3} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPaymentVerified ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Payment Verification</p>
                          <p className="text-xs text-gray-500">Method: {selectedOrder.paymentStatus} • Total: ₹{selectedOrder.totalAmount}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsPaymentVerified(!isPaymentVerified)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          isPaymentVerified ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isPaymentVerified ? 'Verified ✓' : 'Verify Payment'}
                      </button>
                    </div>
                  </section>
                </div>

                {/* Right Side: Customer Details & Notification Preview */}
                <div className="lg:col-span-5 space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <UserIcon size={16} /> Customer Information
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Shipping Name</p>
                        <p className="font-bold text-gray-900">{selectedOrder.address.fullName}</p>
                      </div>
                      <div className="flex gap-10">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">WhatsApp Phone</p>
                          <p className="font-bold text-gray-900">{selectedOrder.address.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Zip Code</p>
                          <p className="font-bold text-gray-900">{selectedOrder.address.zipCode}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Address</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MessageSquare size={16} /> Approval Workspace
                    </h3>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-xs font-bold text-gray-500 mb-2 block">Seller Notes (Will be sent to customer)</span>
                        <textarea 
                          value={tempSellerNotes}
                          onChange={(e) => setTempSellerNotes(e.target.value)}
                          placeholder="e.g. Preparing fresh batch. Will dispatch tonight."
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:bg-white focus:ring-2 focus:ring-organic-primary/10 outline-none transition-all min-h-[100px]"
                        />
                      </label>

                      <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100 relative group overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-[#25D366] text-white p-1 rounded">
                            <MessageSquare size={12} />
                          </div>
                          <span className="text-[10px] font-bold text-[#25D366] uppercase tracking-wider">WhatsApp Notification Preview</span>
                        </div>
                        <p className="text-xs text-gray-600 italic whitespace-pre-wrap leading-relaxed line-clamp-4">
                          "{getWhatsAppMessage(selectedOrder).text}"
                        </p>
                        <div className="absolute inset-0 bg-green-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <p className="text-[10px] font-bold text-green-700">LIVE PREVIEW</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-gray-100 flex gap-4 bg-white">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-10 py-5 rounded-2xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              {selectedOrder.orderStatus === 'Pending' && (
                <button 
                  onClick={() => handleApprove(selectedOrder)}
                  disabled={!allItemsVerified || !isPaymentVerified}
                  className="flex-grow bg-organic-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-organic-100 hover:bg-organic-900 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                >
                  <CheckCircle size={24} className="group-hover:scale-110 transition-transform" /> 
                  Approve Order & Notify Customer
                  <ExternalLink size={18} className="opacity-50" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
