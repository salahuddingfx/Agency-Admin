import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, FileText, FileUp, Send, CheckCircle2, Ticket, X, ClipboardList } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function ClientPortalMgmt() {
  const { portalClients, setPortalClients, logAction } = useAdmin();
  const [selectedClient, setSelectedClient] = useState(portalClients[0] || null);

  // Form states
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('Pending');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [fileName, setFileName] = useState('');
  const [fileCat, setFileCat] = useState('Design');
  const [showFileModal, setShowFileModal] = useState(false);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invoiceAmount.trim()) return;

    // Simulate appending invoice to client statistics
    setPortalClients(prev => prev.map(c => c.id === selectedClient.id ? {
      ...c, invoicesCount: c.invoicesCount + 1
    } : c));
    
    setSelectedClient(prev => ({
      ...prev, invoicesCount: prev.invoicesCount + 1
    }));

    logAction(`Generated invoice for ${selectedClient.company}: ${invoiceAmount} (${invoiceStatus})`);
    setInvoiceAmount('');
    setShowInvoiceModal(false);
  };

  const handleUploadFile = (e) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    logAction(`Uploaded deliverable file "${fileName}" to ${selectedClient.company}'s shared vault`);
    setFileName('');
    setShowFileModal(false);
    alert('File synced to client portal shared vault.');
  };

  const updateProjectMilestone = () => {
    logAction(`Updated project milestone stages for ${selectedClient.company}`);
    alert('Staged project milestones updated.');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Client Portal Settings</h1>
        <p className="text-xs text-slate-500 font-sans">Manage client files vaults, review support tickets logs, and build invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Client List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="admin-card h-[450px] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
                Clients Directory
              </h3>

              <div className="space-y-3">
                {portalClients.map(cli => {
                  const isActive = selectedClient && selectedClient.id === cli.id;
                  return (
                    <div
                      key={cli.id}
                      onClick={() => setSelectedClient(cli)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-brand-primary/10 border-brand-primary/30 text-white' 
                          : 'bg-slate-50 dark:bg-brand-slateAccent/10 border-brand-borderLight dark:border-brand-slateAccent/30 text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-slateAccent/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs">
                          {cli.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white font-display leading-tight">{cli.company}</h4>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{cli.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic text-center">
              Active clients syncing over sitemaps
            </div>
          </div>
        </div>

        {/* Right Side: Manage panel */}
        <div className="lg:col-span-8">
          <div className="admin-card min-h-[450px] flex flex-col justify-between">
            {selectedClient ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">{selectedClient.company}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Active Project: {selectedClient.activeProject}</p>
                  </div>
                  <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2.5 py-1 rounded">
                    {selectedClient.supportStatus}
                  </span>
                </div>

                {/* Operations tools */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-center">
                  
                  {/* Milestones trigger */}
                  <div className="p-5 border border-brand-borderLight dark:border-brand-slateAccent/30 rounded-xl bg-slate-50 dark:bg-brand-slateAccent/10 space-y-4 flex flex-col justify-between items-center">
                    <ClipboardList size={20} className="text-brand-primary" />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Milestone Board</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Staging completed checkmarks</p>
                    </div>
                    <button onClick={updateProjectMilestone} className="btn-secondary py-1 w-full text-[10px]">Update Milestones</button>
                  </div>

                  {/* Invoice trigger */}
                  <div className="p-5 border border-brand-borderLight dark:border-brand-slateAccent/30 rounded-xl bg-slate-50 dark:bg-brand-slateAccent/10 space-y-4 flex flex-col justify-between items-center">
                    <FileText size={20} className="text-brand-primary" />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Invoices Manager</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{selectedClient.invoicesCount} Invoices compiled</p>
                    </div>
                    <button onClick={() => setShowInvoiceModal(true)} className="btn-secondary py-1 w-full text-[10px]">Generate Invoice</button>
                  </div>

                  {/* Files trigger */}
                  <div className="p-5 border border-brand-borderLight dark:border-brand-slateAccent/30 rounded-xl bg-slate-50 dark:bg-brand-slateAccent/10 space-y-4 flex flex-col justify-between items-center">
                    <FileUp size={20} className="text-brand-primary" />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">Deliverables Vault</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Transmit files to client vaults</p>
                    </div>
                    <button onClick={() => setShowFileModal(true)} className="btn-secondary py-1 w-full text-[10px]">Upload Document</button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <User size={32} className="opacity-25 mb-3" />
                <span className="text-xs italic">Select a partner workspace to stage files and invoices.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- INVOICE GENERATOR MODAL --- */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowInvoiceModal(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-brand-darker border border-brand-borderLight dark:border-brand-slateAccent p-6 rounded-xl z-10 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Generate Client Invoice</h3>
                <button onClick={() => setShowInvoiceModal(false)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Invoice Amount</label>
                  <input
                    type="text"
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="e.g., $4,500.00"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Initial Payment Status</label>
                  <select value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)} className="admin-input">
                    <option>Pending</option>
                    <option>Paid</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowInvoiceModal(false)} className="w-1/2 btn-secondary py-2">Cancel</button>
                  <button type="submit" className="w-1/2 btn-primary py-2">Compile Invoice</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FILE TRANSMISSION MODAL --- */}
      <AnimatePresence>
        {showFileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowFileModal(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-brand-darker border border-brand-borderLight dark:border-brand-slateAccent p-6 rounded-xl z-10 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Transmit File to Vault</h3>
                <button onClick={() => setShowFileModal(false)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              <form onSubmit={handleUploadFile} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Filename</label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g., Apex_Layout_Specs_v3.pdf"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">File Category</label>
                  <select value={fileCat} onChange={(e) => setFileCat(e.target.value)} className="admin-input">
                    <option>Design</option>
                    <option>Documentation</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowFileModal(false)} className="w-1/2 btn-secondary py-2">Cancel</button>
                  <button type="submit" className="w-1/2 btn-primary py-2 flex items-center justify-center space-x-1">
                    <FileUp size={12} />
                    <span>Upload Deliverable</span>
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
