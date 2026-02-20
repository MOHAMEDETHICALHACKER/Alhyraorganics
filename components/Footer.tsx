
import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-organic-900 text-organic-100 pt-16 pb-8 border-t-4 border-organic-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div 
              className="flex items-center mb-6 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" 
              onClick={() => onNavigate?.('home')}
            >
              <Logo variant="light" className="h-20 w-auto" />
            </div>
            <p className="text-organic-200/80 leading-relaxed mb-6 text-sm">
              Al Hyra Organics pioneers pure nutrition. We extract the essence of nature to bring you the finest malts and organic supplements.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white text-3d">Quick Links</h3>
            <ul className="space-y-4 text-organic-200">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Home</button></li>
              <li><button onClick={() => onNavigate?.('shop')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Shop All Products</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">About Our Story</button></li>
              <li><button onClick={() => onNavigate?.('admin-dashboard')} className="hover:text-white transition-colors font-bold text-organic-400 text-left">Seller Portal</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white text-3d">Customer Care</h3>
            <ul className="space-y-4 text-organic-200">
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Contact Us</button></li>
              <li><button onClick={() => onNavigate?.('terms')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigate?.('refund')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Return & Refund</button></li>
              <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition-colors text-left hover:translate-x-1 transform duration-200">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white text-3d">Stay Natural</h3>
            <p className="text-organic-200 mb-4 text-sm">Subscribe to receive updates on new malt flavors and exclusive organic deals.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-organic-800 border-none rounded-xl px-4 py-2 w-full text-white placeholder-organic-400 focus:ring-1 focus:ring-organic-300 shadow-inner-malt"
              />
              <button className="bg-white text-organic-900 px-4 py-2 rounded-xl font-bold hover:bg-organic-100 transition-colors shadow-md">Join</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-organic-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-organic-400 font-medium">
          <p>© 2024 Al Hyra Organics. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <span>FSSAI No: 22423567000123</span>
            <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-6 opacity-60 filter grayscale hover:grayscale-0 transition-all" alt="Razorpay" />
          </div>
        </div>
      </div>
    </footer>
  );
};
