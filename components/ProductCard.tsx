
import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-gray-50"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-organic-100 text-organic-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            {product.category}
          </span>
        </div>
        
        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-organic-primary hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 group-hover:text-organic-primary transition-colors cursor-pointer mb-1" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">{product.weight}</span>
            <span className="text-lg font-bold text-organic-900">₹{product.price}</span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-organic-primary text-white p-3 rounded-xl hover:bg-organic-900 transition-colors shadow-lg shadow-organic-200"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
