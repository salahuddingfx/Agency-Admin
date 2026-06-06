import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Search, Shield, Info, Database } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function AuditLogs() {
  const { auditLogs, auth } = useAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // RBAC Access Control Check: Only Super Admin and Admin can view Audit Logs
  const isAuthorized = auth.user?.role === 'Super Admin' || auth.user?.role === 'Admin';

  const filtered = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.role.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination indexing math
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

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
          Security audit logs are restricted to **Super Admins** and **Admins**. Your current login role is **{auth.user?.role || 'Guest'}**.
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
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Security Audit Logs</h1>
        <p className="text-xs text-slate-500 font-sans">Read-only logging tracking user logins, dataset mutations, and system changes</p>
      </div>

      {/* Filter Bar */}
      <div className="admin-card py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search action logs, users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on filter
            }}
            className="admin-input pl-10"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold">Row count:</span>
          <select 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }} 
            className="bg-slate-100 dark:bg-brand-slateAccent/40 border border-brand-borderLight dark:border-brand-slateAccent text-slate-700 dark:text-white rounded px-2 py-1 outline-none"
          >
            <option value={5}>5 Rows</option>
            <option value={10}>10 Rows</option>
            <option value={20}>20 Rows</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="pb-3 pl-4">Timestamp</th>
                <th className="pb-3">Action Description</th>
                <th className="pb-3">Staff Operator</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right pr-4">IP Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight dark:divide-brand-slateAccent/10 text-xs font-mono">
              {paginated.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-[11px] text-slate-600 dark:text-slate-400">
                  <td className="py-3.5 pl-4 text-[10px] text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 font-sans font-semibold text-slate-800 dark:text-white">{log.action}</td>
                  <td className="py-3.5">{log.user}</td>
                  <td className="py-3.5 text-brand-primary text-[10px] font-bold">{log.role.toUpperCase()}</td>
                  <td className="py-3.5 text-right pr-4 text-[10px] text-slate-500">{log.ip}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 italic font-sans">No audit events matches query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">
          Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({filtered.length} total entries)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn-secondary py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn-secondary py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

    </motion.div>
  );
}
