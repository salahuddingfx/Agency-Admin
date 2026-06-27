import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, FileText } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import CloudinaryUpload from '../components/CloudinaryUpload';

export default function CaseStudiesMgmt() {
  const { cases, setCases, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('Draft');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const filtered = cases.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.client.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingCase(null);
    setTitle('');
    setClient('');
    setStatus('Draft');
    setProblem('');
    setSolution('');
    setResult('');
    setCoverImage('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingCase(item);
    setTitle(item.title);
    setClient(item.client);
    setStatus(item.status);
    setProblem(item.problem || '');
    setSolution(item.solution || '');
    setResult(item.result || '');
    setCoverImage(item.coverImage || '');
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;

    if (editingCase) {
      setCases(prev => prev.map(c => c.id === editingCase.id ? {
        ...c, title, client, status, problem, solution, result, coverImage
      } : c));
      logAction(`Modified Case Study: ${title}`);
    } else {
      const created = {
        id: `case-${Date.now()}`,
        title,
        client,
        status,
        problem,
        solution,
        result,
        coverImage
      };
      setCases(prev => [...prev, created]);
      logAction(`Created Case Study: ${title}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, caseTitle) => {
    if (confirm(`Delete case study "${caseTitle}"?`)) {
      setCases(prev => prev.filter(c => c.id !== id));
      logAction(`Deleted Case Study: ${caseTitle}`);
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Case Studies</h1>
          <p className="text-xs text-slate-500 font-sans">Manage client problem descriptions, technical solutions, and business outcomes</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>New Case Study</span>
        </button>
      </div>

      <div className="admin-card py-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search title, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="admin-card space-y-4 hover:border-brand-primary/10 transition-colors">
            <div className="flex justify-between items-start border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/5 px-2 py-0.5 border border-brand-primary/10 rounded">
                  {item.status}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white font-display mt-2">{item.title}</h3>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Partner: {item.client}</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditDrawer(item)}
                  className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">The Challenge</h4>
                <p>{item.problem || 'No challenge description entered.'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">The Solution</h4>
                <p>{item.solution || 'No solution details entered.'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Business Results</h4>
                <p>{item.result || 'No results recorded.'}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-card py-16 text-center text-slate-500 italic">No case studies found matching criteria.</div>
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
              className="relative w-full max-w-lg bg-white dark:bg-brand-darker border-l border-brand-borderLight dark:border-brand-slateAccent h-full overflow-y-auto p-6 sm:p-8 z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4 mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                    {editingCase ? 'Modify Case Study' : 'New Case Study Spec'}
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
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Case Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Scaling Headless Commerce Ecosystem"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Client Partner</label>
                      <input
                        type="text"
                        required
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="e.g., Apex Retail Corp"
                        className="admin-input"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Staging Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">The Challenge (Problem)</label>
                    <textarea
                      rows={3}
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What visual or technical issue was the client facing?"
                      className="admin-input resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">The Solution (Engineering & Design)</label>
                    <textarea
                      rows={3}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="What engineering architecture or design models did Nextora deploy?"
                      className="admin-input resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Results & Core Metrics</label>
                    <textarea
                      rows={3}
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      placeholder="What speed, cost, or conversion results were achieved?"
                      className="admin-input resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <CloudinaryUpload
                    label="Cover Image"
                    value={coverImage}
                    onChange={setCoverImage}
                    accept="image/*"
                    previewType="image"
                  />

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save Case Study</button>
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
