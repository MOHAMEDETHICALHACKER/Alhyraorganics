
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
      <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-gradient-to-br from-organic-50 via-organic-100 to-organic-200">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-organic-300/20 to-transparent transform skew-x-12 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent opacity-60"></div>
        
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 relative z-10">
          <div className="space-y-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-organic-700 text-sm font-bold border border-organic-100">
              <Leaf size={16} className="text-leaf-500" /> 100% Natural Malt Extracts
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-organic-900 leading-[1.1] text-3d">
              Experience the <span className="text-organic-primary block">Golden Essence</span> of Pure Health
            </h1>
            <p className="text-lg text-organic-800/70 max-w-lg leading-relaxed font-medium">
              Handcrafted organic malts. From the earthy richness of beetroot to the golden vitality of sprouted grains. Taste nature in 3D.
            </p>
            <div className="flex flex-wrap gap-5 pt-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 bg-organic-primary text-white rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all flex items-center gap-2 btn-3d transform hover:-translate-y-1"
              >
                Shop Collection <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white/50 backdrop-blur-sm text-organic-900 border border-organic-200 rounded-2xl font-bold text-lg hover:bg-white transition-all shadow-sm hover:shadow-md"
              >
                Our Origins
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 opacity-80">
              <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-organic-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i}/100/100`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-yellow-500 gap-1"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                <p className="text-xs font-bold text-organic-800">Trusted by 5000+ Families</p>
              </div>
            </div>
          </div>
          
          <div className="relative perspective-1000">
            <div className="relative z-10 transform transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-6">
              <div className="absolute inset-0 bg-organic-500 blur-[60px] opacity-20 rounded-full animate-pulse"></div>
              <img 
                src="https://picsum.photos/seed/malt-bottle/800/1000" 
                alt="Premium Malt" 
                className="rounded-[50px] shadow-2xl relative z-10 w-full max-w-md mx-auto card-3d border-4 border-white/50"
              />
              
              {/* Floating 3D Cards */}
              <div className="absolute top-10 -right-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-floating animate-float z-20 border border-organic-100 hidden md:block">
                 <div className="text-center">
                    <span className="block text-2xl font-bold text-organic-primary">24+</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Vital Nutrients</span>
                 </div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur p-6 rounded-3xl shadow-floating z-20 border border-organic-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-organic-100 to-organic-200 rounded-full flex items-center justify-center text-organic-primary shadow-inner">
                    <HeartPulse size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-organic-500 uppercase font-bold tracking-widest">Best Seller</p>
                    <p className="font-bold text-organic-900 text-lg">ABC Malt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with 3D cards */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-organic-900 mb-4 uppercase tracking-wider text-3d">The Malt Matrix</h2>
            <div className="w-24 h-1 bg-organic-primary mx-auto rounded-full"></div>
            <p className="mt-4 text-organic-700">Three pillars of our organic philosophy.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-white to-organic-50 border border-organic-100 text-center hover:-translate-y-2 transition-transform duration-300 shadow-malt group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-organic-primary shadow-floating group-hover:scale-110 transition-transform">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-organic-900 mb-3">Purity Guaranteed</h3>
              <p className="text-gray-600">Verified chemical-free sourcing. No hidden additives.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-organic-500 to-organic-700 text-white border border-organic-600 text-center transform md:-translate-y-4 shadow-floating">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-inner-malt">
                <HeartPulse size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Nutrient Dense</h3>
              <p className="text-organic-100">Cold-processed to retain the natural "matrix" of vitamins.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-white to-organic-50 border border-organic-100 text-center hover:-translate-y-2 transition-transform duration-300 shadow-malt group">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-organic-primary shadow-floating group-hover:scale-110 transition-transform">
                <Leaf size={36} />
              </div>
              <h3 className="text-xl font-bold text-organic-900 mb-3">Earth First</h3>
              <p className="text-gray-600">Sustainable packaging and ethical farming partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-organic-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-organic-primary font-bold uppercase tracking-widest text-sm mb-2">Our Collection</p>
              <h2 className="text-4xl font-bold text-organic-900 text-3d">Featured Essentials</h2>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 bg-white border border-organic-200 rounded-xl font-bold text-organic-900 hover:bg-organic-50 transition-all shadow-sm"
            >
              View Full Menu
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
        </div>
      </section>

      {/* Signature Highlight */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-organic-900 to-organic-800 rounded-[50px] p-8 md:p-16 text-white overflow-hidden relative shadow-floating">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-black/10 -skew-x-12 -translate-x-10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8">
                <span className="bg-organic-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-organic-500 shadow-sm">Crowd Favorite</span>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-3d">ABC Health Malt: <br/>The Ultimate Vitality Drink</h2>
                <p className="text-organic-100 text-lg">A powerful synergy of Apple, Beetroot, and Carrot. Experience the deep earthy tones of beetroot perfectly balanced with the sweetness of apple and carrot.</p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => onNavigate('shop')}
                    className="bg-white text-organic-900 px-8 py-4 rounded-2xl font-bold hover:bg-organic-100 transition-colors btn-3d border-none shadow-none"
                  >
                    Buy Now - ₹225
                  </button>
                  <button className="text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors border border-white/20">
                    Learn Benefits
                  </button>
                </div>
              </div>
              <div className="flex justify-center perspective-1000">
                <img 
                  src="https://picsum.photos/seed/abc-highlight/600/600" 
                  alt="ABC Malt" 
                  className="rounded-[40px] shadow-2xl w-full max-w-sm transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 border-4 border-white/20"
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
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-floating z-50 hover:scale-110 transition-transform flex items-center gap-2 group border-4 border-white/20"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap px-0 group-hover:px-2">Order via WhatsApp</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M14 14l-1.5-1.5c-1-1-2-1-3 0s-1 2 0 3l1.5 1.5"/></svg>
      </a>
    </div>
  );
};
