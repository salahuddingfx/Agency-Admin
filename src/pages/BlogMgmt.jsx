import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Globe, FileText } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function BlogMgmt() {
  const { blogs, setBlogs, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Sarah Jenkins');
  const [category, setCategory] = useState('Web Development');
  const [status, setStatus] = useState('Draft');
  const [tags, setTags] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [snippet, setSnippet] = useState('');

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingBlog(null);
    setTitle('');
    setAuthor('Sarah Jenkins');
    setCategory('Web Development');
    setStatus('Draft');
    setTags('');
    setSeoTitle('');
    setSeoDesc('');
    setSnippet('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingBlog(item);
    setTitle(item.title);
    setAuthor(item.author);
    setCategory(item.category);
    setStatus(item.status);
    setTags(item.tags ? item.tags.join(', ') : '');
    setSeoTitle(item.metaTitle || '');
    setSeoDesc(item.metaDesc || '');
    setSnippet(item.snippet || '');
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? {
        ...b, title, author, category, status, tags: parsedTags, metaTitle: seoTitle, metaDesc: seoDesc, snippet
      } : b));
      logAction(`Modified Blog Post: ${title}`);
    } else {
      const created = {
        id: `post-${Date.now()}`,
        title,
        author,
        category,
        status,
        tags: parsedTags,
        metaTitle: seoTitle,
        metaDesc: seoDesc,
        snippet,
        publishDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read'
      };
      setBlogs(prev => [...prev, created]);
      logAction(`Created Blog Post: ${title}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, postTitle) => {
    if (confirm(`Delete blog post "${postTitle}"?`)) {
      setBlogs(prev => prev.filter(b => b.id !== id));
      logAction(`Deleted Blog Post: ${postTitle}`);
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Blog Operations</h1>
          <p className="text-xs text-slate-500 font-sans">Draft articles, tag tech news, and configure page meta crawlers</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>New Post</span>
        </button>
      </div>

      <div className="admin-card py-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search article titles, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Blogs Listings Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 pl-4">Title</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">SEO Title / Schema</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight dark:divide-brand-slateAccent/10 text-xs">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-4 font-semibold text-slate-800 dark:text-white max-w-xs truncate">{post.title}</td>
                  <td className="py-4 text-slate-500">{post.author}</td>
                  <td className="py-4 text-slate-400">{post.category}</td>
                  <td className="py-4 font-mono text-[10px] text-slate-500">
                    {post.metaTitle || 'Default Inherited'}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      post.status === 'Published' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button 
                      onClick={() => openEditDrawer(post)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 italic">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              className="relative w-full max-w-lg bg-white dark:bg-brand-darker border-l border-brand-borderLight dark:border-brand-slateAccent h-full overflow-y-auto p-6 sm:p-8 z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4 mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                    {editingBlog ? 'Modify Blog Post' : 'New Blog Draft'}
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
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Article Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Implementing Offline Syncing in React Native"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Author</label>
                      <select value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input">
                        <option>Sarah Jenkins</option>
                        <option>David Carter</option>
                        <option>Amina Al-Masri</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                        <option>Web Development</option>
                        <option>Mobile App Development</option>
                        <option>UI/UX Design</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="React, CSS, Mobile"
                        className="admin-input"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Snippet Intro</label>
                    <textarea
                      rows={2}
                      value={snippet}
                      onChange={(e) => setSnippet(e.target.value)}
                      placeholder="Short teaser description showing in lists..."
                      className="admin-input resize-none"
                    />
                  </div>

                  {/* SEO Configuration Section */}
                  <div className="border border-brand-borderLight dark:border-brand-slateAccent/60 p-4 rounded-lg space-y-3 bg-slate-50 dark:bg-brand-darker/30">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Globe size={12} className="text-brand-primary" />
                      <span>SEO Crawlers Metadata</span>
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-slate-500">Meta Title Tag</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Defaults to title | Nextora Studio"
                        className="admin-input bg-white dark:bg-brand-darker/60"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-slate-500">Meta Description Tag</label>
                      <textarea
                        rows={2}
                        value={seoDesc}
                        onChange={(e) => setSeoDesc(e.target.value)}
                        placeholder="Search snippet summary (160 characters limit)..."
                        className="admin-input bg-white dark:bg-brand-darker/60 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save Post</button>
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
