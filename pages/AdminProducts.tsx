
import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Package, X, Image as ImageIcon, Upload, Minus } from 'lucide-react';
import { Product } from '../types';

interface AdminProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    weight: '250g',
    stock: 0,
    category: 'Health Mix',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a product image.");
      return;
    }

    if (editingProduct) {
      onUpdate({ ...editingProduct, ...formData } as Product);
    } else {
      onAdd({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product);
    }
    closeModal();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Max 5MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        weight: '250g',
        stock: 0,
        category: 'Health Mix',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const updateStock = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      stock: Math.max(0, (prev.stock || 0) + delta)
    }));
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Add, edit or remove products from your organic store.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-organic-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-organic-100 hover:bg-organic-900 transition-all"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={product.image || 'https://placehold.co/400x400?text=No+Image'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-organic-50 text-organic-700 text-[10px] font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-900">₹{product.price}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="font-medium text-gray-700">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-gray-400 hover:text-organic-primary hover:bg-organic-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Product Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all"
                    placeholder="e.g. Premium ABC Malt"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all"
                  >
                    <option>Health Mix</option>
                    <option>Breakfast</option>
                    <option>Kids Nutrition</option>
                    <option>Prophetic Medicine</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stock Units</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-transparent focus-within:ring-2 focus-within:ring-organic-primary/20 transition-all">
                    <button 
                      type="button"
                      onClick={() => updateStock(-1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-organic-primary hover:bg-white rounded-xl transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <input 
                      type="number"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Math.max(0, Number(e.target.value))})}
                      className="flex-grow bg-transparent border-none text-center font-bold text-gray-900 focus:ring-0 outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => updateStock(1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-organic-primary hover:bg-white rounded-xl transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all min-h-[100px]"
                  placeholder="Detailed description of the product..."
                />
              </div>

              {/* Enhanced Manual Image Upload Section */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">Product Image</label>
                <div className="flex flex-col md:flex-row gap-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-grow bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-organic-primary/30 transition-all group relative overflow-hidden"
                  >
                    <Upload className="text-gray-400 group-hover:text-organic-primary mb-3" size={40} />
                    <p className="text-sm font-bold text-gray-700 group-hover:text-organic-primary text-center">
                      {formData.image ? 'Change Product Image' : 'Click to Upload Image'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Square Image (Max 5MB)</p>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  
                  <div className="w-full md:w-48 aspect-square bg-gray-50 rounded-3xl border-2 border-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                    {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <p className="text-white text-[10px] font-bold uppercase tracking-widest">Preview</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <ImageIcon size={48} />
                        <p className="text-[10px] mt-2 font-bold uppercase">No Image</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={closeModal} className="flex-grow py-4 rounded-2xl font-bold text-gray-500 border hover:bg-gray-50 transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={!formData.image}
                  className="flex-grow bg-organic-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-organic-100 hover:bg-organic-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
