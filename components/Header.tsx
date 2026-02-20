
import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { User, CartItem } from '../types';
import { Logo } from './Logo';

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
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-organic-100 shadow-sm">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer py-2 hover:opacity-80 transition-opacity" 
          onClick={() => onNavigate('home')}
        >
          <Logo className="h-20 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-organic-900">
          <button onClick={() => onNavigate('home')} className="hover:text-organic-primary transition-colors hover:scale-105 transform duration-200">Home</button>
          <button onClick={() => onNavigate('shop')} className="hover:text-organic-primary transition-colors hover:scale-105 transform duration-200">Shop</button>
          <button onClick={() => onNavigate('about')} className="hover:text-organic-primary transition-colors hover:scale-105 transform duration-200">Our Story</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-organic-primary transition-colors hover:scale-105 transform duration-200">Contact</button>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('cart')} 
            className="relative p-2 text-organic-800 hover:text-organic-primary transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-organic-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {cartCount}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => user.role === 'ADMIN' ? onNavigate('admin-dashboard') : onNavigate('account')}
                className="flex items-center gap-2 text-organic-800 hover:text-organic-primary transition-colors bg-organic-50 px-3 py-1.5 rounded-xl border border-organic-100 hover:border-organic-300"
              >
                {user.role === 'ADMIN' ? <LayoutDashboard size={20} /> : <UserIcon size={20} />}
                <span className="hidden sm:inline text-sm font-bold">{user.name}</span>
              </button>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 bg-organic-primary text-white rounded-xl text-sm font-bold hover:bg-organic-900 transition-all shadow-md btn-3d"
            >
              Login
            </button>
          )}

          <button className="md:hidden text-organic-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-organic-100 p-4 flex flex-col gap-4 animate-fadeIn absolute w-full shadow-xl">
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="p-3 bg-organic-50 rounded-xl text-left font-bold text-organic-900">Home</button>
          <button onClick={() => { onNavigate('shop'); setIsMenuOpen(false); }} className="p-3 bg-organic-50 rounded-xl text-left font-bold text-organic-900">Shop</button>
          <button onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className="p-3 bg-organic-50 rounded-xl text-left font-bold text-organic-900">Our Story</button>
          <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="p-3 bg-organic-50 rounded-xl text-left font-bold text-organic-900">Contact</button>
        </div>
      )}
    </header>
  );
};
