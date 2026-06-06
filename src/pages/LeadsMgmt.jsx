import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, UserPlus, FileText, X, CheckCircle, Clock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function LeadsMgmt() {
  const { leads, setLeads, usersList, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');

  const statuses = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'];

  const filtered = leads.filter(l => 
    l.company.toLowerCase().includes(search.toLowerCase()) || 
    l.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (leadId, comp, nextStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: nextStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: nextStatus }));
    }
    logAction(`Updated Lead "${comp}" status pipeline stage to ${nextStatus}`);
  };

  const handleAssigneeChange = (leadId, comp, assignee) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignee } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, assignee }));
    }
    logAction(`Assigned Lead "${comp}" manager resource to ${assignee}`);
  };

  const addLeadNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { 
      ...l, notes: [...l.notes, newNote] 
    } : l));
    setSelectedLead(prev => ({ 
      ...prev, notes: [...prev.notes, newNote] 
    }));
    logAction(`Appended log note to Lead profile: "${selectedLead.company}"`);
    setNewNote('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Sales Pipeline</h1>
          <p className="text-xs text-slate-500 font-sans">Track inbound client queries, stage budgets, and assign account leads</p>
        </div>
      </div>

      <div className="admin-card py-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search company, contact name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      {/* Kanban Stages Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
        {statuses.map((stage) => {
          const list = filtered.filter(l => l.status === stage);

          return (
            <div key={stage} className="space-y-3 bg-slate-100 dark:bg-brand-darker/60 border border-brand-borderLight dark:border-brand-slateAccent/20 p-4 rounded-xl min-h-[300px]">
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stage}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-brand-slateAccent px-1.5 py-0.5 rounded-full">{list.length}</span>
              </div>

              <div className="space-y-3">
                {list.map(lead => (
                  <div 
                    key={lead.id} 
                    className="p-3 bg-white dark:bg-brand-slateAccent/20 border border-brand-borderLight dark:border-brand-slateAccent/30 hover:border-brand-primary/20 rounded-lg space-y-3 cursor-pointer shadow-light"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white font-display leading-tight">{lead.company}</h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{lead.contactName}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                      <span className="text-[10px] font-mono text-brand-primary font-bold">{lead.value}</span>
                      
                      <div className="flex items-center space-x-1 text-[9px] text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        <span className="truncate max-w-[60px]">{lead.assignee || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- LEAD DETAILS MODAL DIALOG --- */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedLead(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-brand-darker border border-brand-borderLight dark:border-brand-slateAccent p-6 sm:p-8 rounded-xl z-10 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">{selectedLead.company}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">{selectedLead.contactName} &bull; {selectedLead.email}</span>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              {/* Status and Assignee configs */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Pipeline Stage</label>
                  <select 
                    value={selectedLead.status} 
                    onChange={(e) => handleStatusChange(selectedLead.id, selectedLead.company, e.target.value)}
                    className="admin-input bg-slate-50 dark:bg-brand-darker/60"
                  >
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Account Manager</label>
                  <select 
                    value={selectedLead.assignee} 
                    onChange={(e) => handleAssigneeChange(selectedLead.id, selectedLead.company, e.target.value)}
                    className="admin-input bg-slate-50 dark:bg-brand-darker/60"
                  >
                    <option value="">Select Assignee</option>
                    {usersList.filter(u => u.role !== 'Editor').map(u => (
                      <option key={u.name} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes checklist and entry */}
              <div className="space-y-3 pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Progress Log</h4>
                
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {selectedLead.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-brand-slateAccent/10 rounded text-[11px] text-slate-700 dark:text-slate-400 border border-brand-borderLight dark:border-brand-slateAccent/10 flex items-start gap-2">
                      <Clock size={12} className="text-brand-primary mt-0.5 flex-shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                  {selectedLead.notes.length === 0 && (
                    <span className="text-[11px] text-slate-500 italic block py-2">No activity logged.</span>
                  )}
                </div>

                <form onSubmit={addLeadNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a call, meetings outcomes, next actions..."
                    className="admin-input flex-grow bg-slate-50 dark:bg-brand-darker/60"
                  />
                  <button type="submit" className="btn-primary py-2 flex-shrink-0">Add Note</button>
                </form>
              </div>

              <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40 text-right">
                <span className="text-[10px] text-slate-500 font-semibold">Value: <strong className="text-brand-primary text-xs font-mono">{selectedLead.value}</strong></span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
