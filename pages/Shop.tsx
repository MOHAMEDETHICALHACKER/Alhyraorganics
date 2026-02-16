
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface ShopProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ products, onAddToCart, onViewProduct }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popularity');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || p.category === category)
    );

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, category, sort]);

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-organic-900">Explore Our Shop</h1>
          <p className="text-gray-500">Pure, organic goodness delivered to your doorstep.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-organic-primary/20 transition-all">
          <Search className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none focus:outline-none w-full md:w-64 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={20} className="text-organic-primary" /> Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left ${category === cat ? 'bg-organic-primary text-white shadow-lg shadow-organic-200' : 'bg-white border border-gray-100 hover:border-organic-200 text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-organic-primary" /> Sort By
            </h3>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-organic-primary/20"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="p-6 bg-organic-900 rounded-[32px] text-white">
            <h4 className="font-bold mb-2">Free Shipping!</h4>
            <p className="text-xs text-gray-300">On all orders above ₹999. Use code FREESHIP</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500">No products found matching your selection.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 text-organic-primary font-bold">Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
