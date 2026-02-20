
import React from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group relative bg-white rounded-3xl transition-all duration-500 flex flex-col h-full card-3d hover:-translate-y-2 hover:shadow-floating">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer rounded-t-3xl bg-organic-50"
        onClick={() => onViewDetails(product)}
      >
        <div className="absolute inset-0 bg-organic-500/5 mix-blend-multiply z-10 pointer-events-none"></div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-normal"
        />
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-md text-organic-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase shadow-sm border border-organic-100">
            {product.category}
          </span>
        </div>
        
        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-organic-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20 backdrop-blur-[2px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-organic-900 hover:bg-organic-primary hover:text-white transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={22} />
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative">
        {/* Decorative separator */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-organic-200 to-transparent"></div>

        <div className="flex justify-between items-start mb-2 mt-2">
          <h3 className="font-bold text-lg text-organic-900 group-hover:text-organic-primary transition-colors cursor-pointer leading-tight" onClick={() => onViewDetails(product)}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1 bg-organic-50 px-2 py-1 rounded-lg">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-bold text-organic-800">{product.rating || 'New'}</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{product.weight}</span>
               <span className="text-xl font-bold text-organic-700 text-3d">₹{product.price}</span>
            </div>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-organic-primary text-white p-3.5 rounded-2xl hover:bg-organic-900 transition-all shadow-lg shadow-organic-300 hover:shadow-organic-500 active:scale-95 group-hover:bg-organic-600"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
