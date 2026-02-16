
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User as UserIcon, ShieldAlert } from 'lucide-react';
import { Role } from '../types';

interface LoginProps {
  onLogin: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onLogin(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-organic-50 rounded-bl-[100px] -z-0"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-organic-primary rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-organic-200">
             <UserIcon size={32} />
          </div>
          
          <h2 className="text-3xl font-bold text-organic-900 mb-2">
            {isRegister ? 'Create Account' : (email.includes('admin') ? 'Seller Access' : 'Welcome Back')}
          </h2>
          <p className="text-gray-500 mb-8">
            {isRegister 
              ? 'Join the Al Hyra organic community' 
              : (email.includes('admin') ? 'Authorized personnel only' : 'Login to your premium dashboard')}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium animate-shake">
              <ShieldAlert size={20} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none" 
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {!isRegister && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-bold text-organic-primary hover:underline">Forgot Password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-organic-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-organic-900 transition-all shadow-xl shadow-organic-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? 'Authenticating...' : (isRegister ? 'Sign Up' : 'Sign In')} <ArrowRight size={20} />
            </button>
          </form>

          {!email.includes('admin') && (
            <div className="mt-8 text-center text-gray-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 font-bold text-organic-primary hover:underline"
              >
                {isRegister ? 'Login' : 'Create One'}
              </button>
            </div>
          )}

          {email.includes('admin') && (
            <div className="mt-8 p-4 bg-organic-50/50 rounded-2xl border border-organic-100/50 text-center">
               <p className="text-[10px] uppercase font-bold text-organic-600 tracking-widest">Secure Administrator Portal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
