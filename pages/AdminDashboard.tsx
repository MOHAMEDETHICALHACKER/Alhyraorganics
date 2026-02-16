
import React from 'react';
import { ShoppingBag, Users, DollarSign, TrendingUp, AlertTriangle, Package, Calendar, Clock, CheckCircle, Bell } from 'lucide-react';
import { Order, Product } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products, onNavigate }) => {
  const totalRevenue = orders.reduce((acc, o) => o.paymentStatus === 'Paid' ? acc + o.totalAmount : acc, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);
  const recentOrders = orders.slice(0, 5);
  const pendingApprovals = orders.filter(o => o.orderStatus === 'Pending');

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Approvals', value: pendingApprovals.length, icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Active Products', value: products.length, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-semibold">
            <Calendar size={18} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-organic-primary text-white px-6 py-2 rounded-xl shadow-lg shadow-organic-100 font-semibold">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {stat.label === 'Pending Approvals' && pendingApprovals.length > 0 && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-[80px] -z-0"></div>
            )}
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 relative z-10`}>
              <stat.icon size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium relative z-10">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 relative z-10">{stat.value}</h3>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold mt-2 relative z-10">
              <TrendingUp size={14} /> +12.5% from last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <button onClick={() => onNavigate('admin-orders')} className="text-organic-primary font-bold text-sm">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">Order ID</th>
                    <th className="px-8 py-4">Customer</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-900">{order.id}</td>
                      <td className="px-8 py-5 text-gray-600">{order.address.fullName}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                          order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.orderStatus === 'Pending' ? 'Needs Approval' : order.orderStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-gray-900">₹{order.totalAmount}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-400">No orders found yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory & Alerts */}
        <div className="space-y-6">
          {pendingApprovals.length > 0 && (
            <div className="bg-yellow-50 p-8 rounded-[40px] shadow-sm border border-yellow-100 animate-pulse">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <Bell size={20} /> Action Required
              </h3>
              <p className="text-sm text-yellow-700 mb-6">
                You have {pendingApprovals.length} orders awaiting product and payment confirmation.
              </p>
              <button 
                onClick={() => onNavigate('admin-orders')}
                className="w-full bg-yellow-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-200"
              >
                Review Confirmation Requests
              </button>
            </div>
          )}

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={20} /> Low Stock Alerts
            </h3>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-orange-600 font-medium">{p.stock} units remaining</p>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('admin-products')} className="text-xs bg-white text-orange-600 px-3 py-1 rounded-lg font-bold shadow-sm">Restock</button>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                   <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                   <p className="text-sm font-medium">All products are well stocked.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-organic-900 p-8 rounded-[40px] text-white">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => onNavigate('admin-products')} className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors text-left">
                <Package size={20} /> Manage Inventory
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors text-left">
                <DollarSign size={20} /> Financial Summary
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors text-left">
                <Clock size={20} /> Update Shop Banners
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
