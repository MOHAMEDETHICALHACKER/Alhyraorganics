
import React, { useState } from 'react';
import { FileText, Edit, Save, X, History } from 'lucide-react';
import { StaticPage } from '../types';

interface AdminPagesProps {
  pages: StaticPage[];
  onUpdate: (id: string, title: string, content: string) => void;
}

export const AdminPages: React.FC<AdminPagesProps> = ({ pages, onUpdate }) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleEdit = (page: StaticPage) => {
    setEditingPageId(page.id);
    setEditTitle(page.title);
    setEditContent(page.content);
  };

  const handleSave = () => {
    if (editingPageId) {
      onUpdate(editingPageId, editTitle, editContent);
      setEditingPageId(null);
    }
  };

  return (
    <div className="animate-fadeIn pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Content Pages</h1>
        <p className="text-gray-500">Edit the content of your About Us, Contact, and Legal pages.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 transition-all hover:shadow-md">
            {editingPageId === page.id ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg text-organic-primary flex items-center gap-2">
                     <FileText size={20} /> Editing {page.title}
                   </h3>
                   <div className="flex gap-2">
                     <button 
                        onClick={() => setEditingPageId(null)}
                        className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl"
                     >
                       <X size={20} />
                     </button>
                     <button 
                        onClick={handleSave}
                        className="bg-organic-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                     >
                       <Save size={18} /> Save Changes
                     </button>
                   </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Page Title</label>
                  <input 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none font-bold"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Page Content</label>
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-organic-primary/20 transition-all outline-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-organic-50 text-organic-primary rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{page.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <History size={12} /> Last updated: {new Date(page.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden lg:block text-gray-400 text-sm max-w-md truncate">
                    {page.content}
                  </div>
                  <button 
                    onClick={() => handleEdit(page)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gray-50 text-gray-700 hover:bg-organic-50 hover:text-organic-primary transition-all"
                  >
                    <Edit size={16} /> Edit Content
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
