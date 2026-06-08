import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Star } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function TestimonialsMgmt() {
  const { testimonials, setTestimonials, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);

  const filtered = testimonials.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.company.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingItem(null);
    setName('');
    setCompany('');
    setText('');
    setStars(5);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCompany(item.company);
    setText(item.text);
    setStars(item.stars);
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !text.trim()) return;

    if (editingItem) {
      setTestimonials(prev => prev.map(t => t.id === editingItem.id ? {
        ...t, name, company, text, stars
      } : t));
      logAction(`Modified Testimonial: Review from ${name}`);
    } else {
      const created = {
        id: `tm-${Date.now()}`,
        name,
        company,
        text,
        stars
      };
      setTestimonials(prev => [...prev, created]);
      logAction(`Created Testimonial: Review from ${name}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, clientName) => {
    if (confirm(`Delete testimonial from client "${clientName}"?`)) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      logAction(`Deleted Testimonial: Review from ${clientName}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Client Testimonials</h1>
          <p className="text-xs text-slate-500 font-sans">Manage customer quotes, feedback parameters, and public stars ratings</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>New Review</span>
        </button>
      </div>

      <div className="admin-card py-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search client reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="admin-card flex flex-col justify-between hover:border-brand-primary/10 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">{item.name}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.company}</span>
                </div>
                
                <div className="flex text-amber-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                "{item.text}"
              </p>
            </div>

            <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40 flex justify-between items-center text-[10px] text-slate-500 mt-6">
              <span className="font-mono">ID: {item.id}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditDrawer(item)}
                  className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">No testimonials matched selection.</div>
        )}
      </div>

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
              className="relative w-full max-w-md bg-white dark:bg-brand-darker border-l border-brand-borderLight dark:border-brand-slateAccent h-full overflow-y-auto p-6 sm:p-8 z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4 mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                    {editingItem ? 'Edit Testimonial Details' : 'Lodging Client Feedback'}
                  </h3>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Client Contact Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Company Name</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Apex International"
                        className="admin-input"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Star Rating</label>
                      <select value={stars} onChange={(e) => setStars(Number(e.target.value))} className="admin-input">
                        <option value={5}>5 Stars Excellent</option>
                        <option value={4}>4 Stars Good</option>
                        <option value={3}>3 Stars Fair</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Testimonial Text Quote</label>
                    <textarea
                      rows={4}
                      required
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Insert the client's direct review here..."
                      className="admin-input resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save Testimonial</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
