import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Sparkles } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function PortfolioMgmt() {
  const { portfolio, setPortfolio, auth, logAction } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [client, setClient] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageColor, setImageColor] = useState('from-blue-600 to-cyan-500');
  const [imageUrl, setImageUrl] = useState('');

  const categories = ['All', 'Web Development', 'Mobile App Development', 'POS Solutions', 'ERP & CRM Systems', 'UI/UX Design'];

  const filtered = portfolio.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.client.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddDrawer = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Web Development');
    setClient('');
    setFeatured(false);
    setImageColor('from-blue-600 to-cyan-500');
    setImageUrl('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setClient(item.client);
    setFeatured(item.featured);
    setImageColor(item.imageColor || 'from-blue-600 to-cyan-500');
    setImageUrl(item.imageUrl || '');
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      alert('Please fill out Project Title and Client Name.');
      return;
    }

    if (editingItem) {
      setPortfolio(prev => prev.map(p => p.id === editingItem.id ? {
        ...p, title, category, client, featured, imageColor, imageUrl
      } : p));
      logAction(`Modified Portfolio Project: ${title}`);
    } else {
      const created = {
        id: `proj-${Date.now()}`,
        title,
        category,
        client,
        featured,
        imageColor,
        imageUrl
      };
      setPortfolio(prev => [...prev, created]);
      logAction(`Created Portfolio Project: ${title}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, projTitle) => {
    if (confirm(`Delete project "${projTitle}" from portfolio?`)) {
      setPortfolio(prev => prev.filter(p => p.id !== id));
      logAction(`Deleted Portfolio Project: ${projTitle}`);
    }
  };

  // Mock File Drag-and-drop triggers preview
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewFile(URL.createObjectURL(file));
      // Pick a random gradient as a mockup representation color
      const gradients = [
        'from-purple-600 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-pink-500 to-rose-600',
        'from-orange-500 to-amber-600'
      ];
      setImageColor(gradients[Math.floor(Math.random() * gradients.length)]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Portfolio Showcase</h1>
          <p className="text-xs text-slate-500 font-sans">Manage custom project portfolios, category tags, and assets</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>
      </div>

      {/* Categories Tabs & Search */}
      <div className="admin-card py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 dark:bg-brand-slateAccent/40 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search project or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="admin-card overflow-hidden p-0 flex flex-col justify-between group relative"
          >
            {/* Visual Header Grid representation */}
            <div className={`h-36 bg-gradient-to-tr ${item.imageColor} relative p-4 flex flex-col justify-between`}>
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-[9px] font-bold uppercase tracking-widest bg-black/30 backdrop-blur px-2 py-0.5 rounded text-white border border-white/10">
                  {item.category}
                </span>
                {item.featured && (
                  <span className="w-5 h-5 rounded-full bg-brand-primary/95 text-white flex items-center justify-center shadow-premium" title="Featured Project">
                    <Sparkles size={10} className="animate-pulse" />
                  </span>
                )}
              </div>

              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider z-10">{item.client}</span>
            </div>

            {/* Description details body */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display mb-4">{item.title}</h3>
              
              <div className="flex justify-between items-center pt-3 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                <span className="text-[9px] text-slate-400 font-mono">ID: {item.id}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditDrawer(item)}
                    className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 italic">No projects found matching selection.</div>
        )}
      </div>

      {/* --- FORM DRAWER --- */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-brand-darker border-l border-brand-borderLight dark:border-brand-slateAccent h-full overflow-y-auto p-6 sm:p-8 z-10"
            >
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4 mb-6">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                  {editingItem ? 'Edit Project parameters' : 'Create Portfolio project'}
                </h3>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., DineSync Smart POS UI"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Client Partner</label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g., Hospitality Group Inc."
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Category Tag</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="admin-input"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1 pt-6 pl-2 flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-3.5 w-3.5 rounded bg-brand-darker border-brand-slateAccent text-brand-primary focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-[10px] uppercase font-semibold text-slate-400 ml-2 cursor-pointer select-none">
                      Featured Project
                    </label>
                  </div>
                </div>

                {/* Cloudinary Cover Image Upload */}
                <CloudinaryUpload
                  label="Project Cover Image"
                  value={imageUrl}
                  onChange={setImageUrl}
                  accept="image/*"
                  previewType="image"
                />

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="w-1/2 btn-secondary py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 btn-primary py-2.5"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
