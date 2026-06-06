import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function TechMgmt() {
  const { tech, setTech, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [desc, setDesc] = useState('');

  const filtered = tech.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingItem(null);
    setName('');
    setCategory('Frontend');
    setDesc('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDesc(item.desc || '');
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      setTech(prev => prev.map(t => t.id === editingItem.id ? {
        ...t, name, category, desc
      } : t));
      logAction(`Modified Tech Entry: ${name}`);
    } else {
      const created = {
        id: `tech-${Date.now()}`,
        name,
        category,
        desc
      };
      setTech(prev => [...prev, created]);
      logAction(`Created Tech Entry: ${name}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, techName) => {
    if (confirm(`Delete technology "${techName}"?`)) {
      setTech(prev => prev.filter(t => t.id !== id));
      logAction(`Deleted Tech Entry: ${techName}`);
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Technology Catalog</h1>
          <p className="text-xs text-slate-500 font-sans">Manage database engines, front-end libraries, CDNs, and infrastructure tools</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>Add Technology</span>
        </button>
      </div>

      <div className="admin-card py-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search stack name (e.g., Docker)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="admin-card flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/5 px-2 py-0.5 border border-brand-primary/10 rounded">
                {item.category}
              </span>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white font-display">{item.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">{item.desc}</p>
            </div>
            
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
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">No technologies found.</div>
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
                    {editingItem ? 'Edit Stack parameters' : 'New Technology parameter'}
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
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Technology Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Express.js"
                      className="admin-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Stack Layer Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Database</option>
                      <option>Infrastructure</option>
                      <option>Tools</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Service Description</label>
                    <textarea
                      rows={3}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Explain how Nextora implements this stack..."
                      className="admin-input resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save Technology</button>
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
