import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Plus, Edit2, Trash2, X, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { toast } from 'sonner';

export default function UserMgmt() {
  const { usersList, setUsersList, auth, logAction } = useAdmin();
  
  // Gating access at page level: Only Super Admin and Admin can access User Management
  const isAuthorized = auth.user?.role === 'Super Admin' || auth.user?.role === 'Admin';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');
  const [status, setStatus] = useState('Active');

  const openAddDrawer = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('Editor');
    setStatus('Active');
    setDrawerOpen(true);
  };

  const openEditDrawer = (usr) => {
    setEditingUser(usr);
    setName(usr.name);
    setEmail(usr.email);
    setRole(usr.role);
    setStatus(usr.status);
    setDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      setUsersList(prev => prev.map(u => u.id === editingUser.id ? {
        ...u, name, email, role, status
      } : u));
      logAction(`Modified Internal User Profile: ${email} (Role: ${role})`);
    } else {
      const created = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        status
      };
      setUsersList(prev => [...prev, created]);
      logAction(`Created Internal User: ${email} (Role: ${role})`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, uEmail) => {
    // Cannot delete yourself
    if (uEmail === auth.user?.email) {
      toast.error('Cannot delete your own active session profile.');
      return;
    }

    if (confirm(`Revoke dashboard permissions for ${uEmail}?`)) {
      setUsersList(prev => prev.filter(u => u.id !== id));
      logAction(`Deleted Internal User Profile: ${uEmail}`);
    }
  };

  const toggleStatus = (usr) => {
    const nextStatus = usr.status === 'Active' ? 'Suspended' : 'Active';
    setUsersList(prev => prev.map(u => u.id === usr.id ? { ...u, status: nextStatus } : u));
    logAction(`Toggled user "${usr.email}" status to ${nextStatus}`);
  };

  if (!isAuthorized) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="admin-card border-red-500/20 max-w-lg mx-auto mt-12 text-center space-y-4 p-8"
      >
        <ShieldAlert size={48} className="text-red-500 mx-auto" />
        <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white uppercase tracking-wider">Access Blocked</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          User Management is restricted to **Super Admins** and **Admins**. Your current login role is **{auth.user?.role || 'Guest'}**.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">User Accounts</h1>
          <p className="text-xs text-slate-500 font-sans">Manage dashboard authorization profiles, and access credentials permissions</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>Add User</span>
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 pl-4">Staff Member</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Dashboard Role</th>
                <th className="pb-3">Account Status</th>
                <th className="pb-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight dark:divide-brand-slateAccent/10 text-xs">
              {usersList.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-4 font-semibold text-slate-800 dark:text-white">{usr.name}</td>
                  <td className="py-4 text-slate-500">{usr.email}</td>
                  <td className="py-4 font-bold text-brand-primary uppercase tracking-wide text-[10px]">{usr.role}</td>
                  <td className="py-4">
                    <button
                      onClick={() => toggleStatus(usr)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        usr.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                      title="Toggle active status"
                    >
                      {usr.status}
                    </button>
                  </td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button 
                      onClick={() => openEditDrawer(usr)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded"
                      title="Edit User"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDelete(usr.id, usr.email)}
                      className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded"
                      title="Delete User"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                    {editingUser ? 'Edit User details' : 'Add System User'}
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
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Staff Member Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      className="admin-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">System Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., name@nextora.tech"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Authorization Role</label>
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="admin-input">
                        <option>Super Admin</option>
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>Editor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Account status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
                        <option>Active</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save User</button>
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
