
import React from 'react';
import { StaticPage } from '../types';
import { Leaf, ArrowLeft } from 'lucide-react';

interface StaticPageViewProps {
  page: StaticPage;
  onBack: () => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({ page, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-20 animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-organic-primary font-bold mb-8 hover:underline"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-organic-50 text-organic-primary rounded-2xl flex items-center justify-center">
            <Leaf size={24} />
          </div>
          <h1 className="text-4xl font-bold text-organic-900">{page.title}</h1>
        </div>

        <div className="prose prose-lg prose-green max-w-none">
          {page.content.split('\n').map((line, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">
              {line}
            </p>
          ))}
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 italic">
          <p>Al Hyra Organics - Pure & Traditional Wellness</p>
          <p>Last Updated: {new Date(page.lastUpdated).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
