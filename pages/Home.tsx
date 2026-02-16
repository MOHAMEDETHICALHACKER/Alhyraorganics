
import React from 'react';
import { ArrowRight, Star, ShieldCheck, HeartPulse, Leaf } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { BUSINESS_WHATSAPP } from '../constants';

interface HomeProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ products, onNavigate, onAddToCart, onViewProduct }) => {
  const featured = products.slice(0, 4);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-organic-50 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-organic-100/30 rounded-l-[100px] -z-10 transform translate-x-20"></div>
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-organic-700 text-sm font-semibold">
              <Leaf size={16} /> 100% Organic & Natural
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-organic-900 leading-tight">
              Fuel Your Body with <span className="text-organic-primary">Pure Nutrition</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Al Hyra Organics brings you the essence of traditional wellness. From our signature ABC Malt to ancient grains, we prioritize your health.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 bg-organic-primary text-white rounded-full font-bold text-lg hover:bg-organic-900 transition-all flex items-center gap-2 shadow-xl shadow-organic-200"
              >
                Shop Collection <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white text-organic-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Our Story
              </button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/organic-main/800/1000" 
              alt="Organic Malt" 
              className="rounded-[40px] shadow-2xl relative z-10 w-full max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-700"
            />
            {/* Floating items */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl z-20 animate-bounce">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-organic-100 rounded-full flex items-center justify-center text-organic-primary">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Premium Quality</p>
                  <p className="font-bold text-gray-800">ABC Health Malt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-organic-900 mb-4 uppercase tracking-wider">Why Choose Organic?</h2>
            <div className="w-20 h-1 bg-organic-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-cream border border-earth/10 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-organic-primary shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-organic-900 mb-3">Purity Guaranteed</h3>
              <p className="text-gray-600">No preservatives, no artificial colors, no additives. Just raw nature.</p>
            </div>
            <div className="p-8 rounded-3xl bg-organic-50 border border-organic-100 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-organic-primary shadow-sm">
                <HeartPulse size={32} />
              </div>
              <h3 className="text-xl font-bold text-organic-900 mb-3">Nutrient Dense</h3>
              <p className="text-gray-600">Crafted to retain maximum vitamins and minerals for your vitality.</p>
            </div>
            <div className="p-8 rounded-3xl bg-cream border border-earth/10 hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-organic-primary shadow-sm">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold text-organic-900 mb-3">Locally Sourced</h3>
              <p className="text-gray-600">Supporting local farmers and sustainable agricultural practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-organic-primary font-bold uppercase tracking-widest text-sm mb-2">Our Collection</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-organic-900">Featured Products</h2>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="hidden md:flex items-center gap-2 text-organic-primary font-bold hover:underline"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onViewDetails={onViewProduct}
              />
            ))}
          </div>
          
          <div className="mt-12 md:hidden text-center">
            <button 
              onClick={() => onNavigate('shop')}
              className="bg-white border border-gray-200 px-8 py-3 rounded-full font-bold text-organic-900 shadow-sm"
            >
              Shop All Products
            </button>
          </div>
        </div>
      </section>

      {/* Signature Highlight */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-organic-900 rounded-[50px] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 -translate-x-10"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <span className="bg-organic-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Wanted</span>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">ABC Health Malt: The Ultimate Vitality Drink</h2>
                <p className="text-gray-300 text-lg">A powerful blend of Apple, Beetroot, and Carrot. Thousands have transformed their morning routine with this natural superfood mix.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => onNavigate('shop')}
                    className="bg-white text-organic-900 px-8 py-4 rounded-full font-bold hover:bg-cream transition-colors"
                  >
                    Buy Now - ₹225
                  </button>
                  <button className="border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                    Learn Benefits
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://picsum.photos/seed/abc-highlight/600/600" 
                  alt="ABC Malt" 
                  className="rounded-3xl shadow-2xl w-full max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${BUSINESS_WHATSAPP}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">Order via WhatsApp</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M14 14l-1.5-1.5c-1-1-2-1-3 0s-1 2 0 3l1.5 1.5"/></svg>
      </a>
    </div>
  );
};
