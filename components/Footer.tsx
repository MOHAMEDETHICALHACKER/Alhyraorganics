
import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-organic-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-organic-primary font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">AL HYRA</h1>
                <p className="text-[10px] text-cream tracking-widest font-semibold uppercase">ORGANICS</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Pioneering premium organic nutrition since 2015. We bring nature's purest gifts directly to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-300">
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-white transition-colors text-left">Home</button></li>
              <li><button onClick={() => onNavigate?.('shop')} className="hover:text-white transition-colors text-left">Shop All Products</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="hover:text-white transition-colors text-left">About Our Story</button></li>
              <li><button onClick={() => onNavigate?.('admin-dashboard')} className="hover:text-white transition-colors font-bold text-organic-300 text-left">Seller Portal</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Customer Care</h3>
            <ul className="space-y-4 text-gray-300">
              <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => onNavigate?.('terms')} className="hover:text-white transition-colors text-left">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigate?.('refund')} className="hover:text-white transition-colors text-left">Return & Refund</button></li>
              <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-organic-800 border-none rounded-md px-4 py-2 w-full text-white placeholder-gray-500 focus:ring-1 focus:ring-organic-300"
              />
              <button className="bg-white text-organic-primary px-4 py-2 rounded-md font-bold hover:bg-cream transition-colors">Join</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-organic-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 Al Hyra Organics. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>FSSAI No: 22423567000123</span>
            <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-6 opacity-60 filter grayscale hover:grayscale-0 transition-all" alt="Razorpay" />
          </div>
        </div>
      </div>
    </footer>
  );
};
