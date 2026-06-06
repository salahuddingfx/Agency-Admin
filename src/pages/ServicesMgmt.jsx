import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, EyeOff, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function ServicesMgmt() {
  const { services, setServices, auth, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Form variables
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [metric, setMetric] = useState('');
  const [status, setStatus] = useState('Draft');
  const [desc, setDesc] = useState('');
  
  const [permissionError, setPermissionError] = useState('');

  // Search Filter
  const filtered = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingService(null);
    setTitle('');
    setCategory('Engineering');
    setMetric('');
    setStatus('Draft');
    setDesc('');
    setPermissionError('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (srv) => {
    setEditingService(srv);
    setTitle(srv.title);
    setCategory(srv.category);
    setMetric(srv.metric);
    setStatus(srv.status);
    setDesc(srv.shortDesc || '');
    setPermissionError('');
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !metric.trim()) {
      alert('Please fill out Title and Metric targets.');
      return;
    }

    if (editingService) {
      // Edit
      setServices(prev => prev.map(s => s.id === editingService.id ? {
        ...s, title, category, metric, status, shortDesc: desc
      } : s));
      logAction(`Modified Service: ${title}`);
    } else {
      // Create
      const created = {
        id: `srv-${Date.now()}`,
        title,
        category,
        metric,
        status,
        shortDesc: desc
      };
      setServices(prev => [...prev, created]);
      logAction(`Created Service: ${title}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, srvTitle) => {
    // RBAC: Only Super Admin and Admin can delete services
    if (auth.user?.role !== 'Super Admin' && auth.user?.role !== 'Admin') {
      setPermissionError(`Insufficient Permissions: Delete Service blocked for Role: ${auth.user?.role}. Super Admin or Admin credentials required.`);
      setTimeout(() => setPermissionError(''), 5000);
      return;
    }

    if (confirm(`Are you sure you want to delete service "${srvTitle}"?`)) {
      setServices(prev => prev.filter(s => s.id !== id));
      logAction(`Deleted Service: ${srvTitle}`);
    }
  };

  const togglePublish = (srv) => {
    const nextStatus = srv.status === 'Published' ? 'Draft' : 'Published';
    setServices(prev => prev.map(s => s.id === srv.id ? { ...s, status: nextStatus } : s));
    logAction(`Updated status for "${srv.title}" to ${nextStatus}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Services Directory</h1>
          <p className="text-xs text-slate-500 font-sans">Draft, publish, and outline customer capability offerings</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Permission alert messages */}
      <AnimatePresence>
        {permissionError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-500"
          >
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider">Access Denied</h4>
              <p className="text-xs mt-1 font-semibold">{permissionError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter panel */}
      <div className="admin-card py-4 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search service title, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 pl-4">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Core SLA Metric</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight dark:divide-brand-slateAccent/10 text-xs">
              {filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-4 font-semibold text-slate-800 dark:text-white">{srv.title}</td>
                  <td className="py-4 text-slate-500">{srv.category}</td>
                  <td className="py-4 text-slate-400 font-mono text-[10px]">{srv.metric}</td>
                  <td className="py-4">
                    <button
                      onClick={() => togglePublish(srv)}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        srv.status === 'Published' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                      title="Click to toggle status"
                    >
                      {srv.status}
                    </button>
                  </td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button 
                      onClick={() => openEditDrawer(srv)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary hover:border-brand-primary/20 rounded transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDelete(srv.id, srv.title)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 hover:border-red-500/20 rounded transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 italic">No services matched criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SLIDE OUT FORM DRAWER (Framer Motion) --- */}
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
                    {editingService ? 'Edit Service Details' : 'Add New Service'}
                  </h3>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Service Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Headless React Portals"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="admin-input"
                      >
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Operations</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Staging Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="admin-input"
                      >
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Core SLA Metric</label>
                    <input
                      type="text"
                      required
                      value={metric}
                      onChange={(e) => setMetric(e.target.value)}
                      placeholder="e.g., 99.9% Uptime Guarantee"
                      className="admin-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Capabilities Description</label>
                    <textarea
                      rows={4}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Enter a brief summary of this service stack..."
                      className="admin-input resize-none"
                    />
                  </div>

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
                      Save Parameters
                    </button>
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
