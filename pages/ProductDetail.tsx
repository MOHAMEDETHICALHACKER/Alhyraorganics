
import React, { useState } from 'react';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddRating: (productId: string, rating: number) => void;
  onNavigate: (page: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onAddRating, onNavigate }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleRating = (rating: number) => {
    if (hasRated) return;
    setUserRating(rating);
    onAddRating(product.id, rating);
    setHasRated(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span className="cursor-pointer hover:text-organic-primary" onClick={() => onNavigate('home')}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-organic-primary" onClick={() => onNavigate('shop')}>Shop</span>
        <span>/</span>
        <span className="text-organic-900 font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-organic-primary bg-gray-50">
                  <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-organic-100 text-organic-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                {product.category}
              </span>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={`${i < Math.round(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} `}
                    />
                  ))}
                  <span className="ml-1 text-sm font-bold text-gray-900">{product.rating || 'New'}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Based on {product.reviewCount || 0} reviews
                </p>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-organic-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-organic-600 font-bold bg-organic-50 px-2 py-0.5 rounded text-xs">IN STOCK</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-organic-900">₹{product.price}</span>
              <span className="text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</span>
            </div>
            <p className="text-gray-500 mt-4 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-6">
            {/* Interactive Rating Section */}
            {!hasRated ? (
              <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rate this product</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={28} 
                        className={`transition-colors ${star <= (hoverRating || userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-sm font-bold text-gray-600">
                    {hoverRating === 1 && "Poor"}
                    {hoverRating === 2 && "Fair"}
                    {hoverRating === 3 && "Good"}
                    {hoverRating === 4 && "Excellent"}
                    {hoverRating === 5 && "Outstanding!"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-organic-50 p-6 rounded-3xl border border-organic-100 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-organic-700 uppercase tracking-widest mb-1">Thanks for your feedback!</p>
                   <p className="text-sm font-medium text-organic-900">You rated this {userRating} stars.</p>
                </div>
                <div className="flex">
                  {[...Array(userRating)].map((_, i) => <Star key={i} size={16} className="fill-organic-primary text-organic-primary" />)}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-2xl p-1 w-fit bg-white shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-organic-primary"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-organic-primary"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => { for(let i=0; i<quantity; i++) onAddToCart(product); }}
                className="flex-grow bg-organic-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-organic-100"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              <button className="p-4 rounded-2xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                <Heart size={22} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <ShieldCheck className="mx-auto mb-2 text-organic-primary" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-500">Organic Certified</p>
              </div>
              <div className="text-center">
                <Truck className="mx-auto mb-2 text-organic-primary" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-500">Fast Delivery</p>
              </div>
              <div className="text-center">
                <RefreshCw className="mx-auto mb-2 text-organic-primary" size={24} />
                <p className="text-[10px] uppercase font-bold text-gray-500">7-Day Return</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tabs */}
      <div className="border-b mb-12">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'description' ? 'text-organic-900' : 'text-gray-400'}`}
          >
            Description
            {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-1 bg-organic-primary rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 text-lg font-bold transition-all relative ${activeTab === 'ingredients' ? 'text-organic-900' : 'text-gray-400'}`}
          >
            Ingredients & Nutrition
            {activeTab === 'ingredients' && <div className="absolute bottom-0 left-0 w-full h-1 bg-organic-primary rounded-t-full"></div>}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 min-h-[300px]">
        {activeTab === 'description' && (
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Our premium {product.name} is meticulously prepared using traditional sun-drying and roasting methods. This ensures that every scoop you take is packed with its original natural flavor and nutrient profile.</p>
            <h4 className="font-bold text-gray-900">Key Benefits:</h4>
            <ul className="list-disc pl-5">
              <li>Naturally boosts immunity and vitality</li>
              <li>Easy to digest and perfect for breakfast</li>
              <li>No chemical sprays used during harvesting</li>
              <li>FSSAI certified for the highest quality standards</li>
            </ul>
          </div>
        )}
        {activeTab === 'ingredients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Ingredients:</h4>
              <p className="text-gray-600">{product.ingredients || "Premium hand-selected organic ingredients based on ancient ayurvedic recipes."}</p>
              <div className="mt-8">
                <h4 className="font-bold text-gray-900 mb-4">Nutritional Values (Per 100g):</h4>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1"><span>Energy</span><span className="font-bold">384 kcal</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Protein</span><span className="font-bold">4.2 g</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Iron</span><span className="font-bold">12.4 mg</span></div>
                  <div className="flex justify-between border-b pb-1"><span>Dietary Fiber</span><span className="font-bold">6.8 g</span></div>
                </div>
              </div>
            </div>
            <div className="bg-organic-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <img src="https://img.icons8.com/color/96/000000/leaf.png" className="w-16 mb-4" alt="Organic" />
              <p className="font-bold text-organic-900">Certified Organic Quality</p>
              <p className="text-xs text-gray-500 mt-1">FSSAI Lic. No: {product.fssai || "22423567000123"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
