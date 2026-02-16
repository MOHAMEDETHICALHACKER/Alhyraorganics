
import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { User, CartItem } from '../types';

interface HeaderProps {
  user: User | null;
  cart: CartItem[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, cart, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-organic-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-organic-800 leading-none">AL HYRA</h1>
            <p className="text-[10px] text-earth tracking-widest font-semibold">ORGANICS</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-organic-primary transition-colors">Home</button>
          <button onClick={() => onNavigate('shop')} className="hover:text-organic-primary transition-colors">Shop</button>
          <button onClick={() => onNavigate('about')} className="hover:text-organic-primary transition-colors">About Us</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-organic-primary transition-colors">Contact</button>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('cart')} 
            className="relative p-2 text-gray-700 hover:text-organic-primary"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => user.role === 'ADMIN' ? onNavigate('admin-dashboard') : onNavigate('account')}
                className="flex items-center gap-2 text-gray-700 hover:text-organic-primary"
              >
                {user.role === 'ADMIN' ? <LayoutDashboard size={22} /> : <UserIcon size={22} />}
                <span className="hidden sm:inline text-sm font-semibold">{user.name}</span>
              </button>
              <button onClick={onLogout} className="text-gray-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2 bg-organic-primary text-white rounded-full text-sm font-semibold hover:bg-organic-900 transition-all shadow-md"
            >
              Login
            </button>
          )}

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 animate-fadeIn">
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="p-2 text-left font-medium">Home</button>
          <button onClick={() => { onNavigate('shop'); setIsMenuOpen(false); }} className="p-2 text-left font-medium">Shop</button>
          <button onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className="p-2 text-left font-medium">About Us</button>
          <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="p-2 text-left font-medium">Contact</button>
        </div>
      )}
    </header>
  );
};
