import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, MailOpen, Archive, Send, X, CheckCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function ContactsMgmt() {
  const { inbox, setInbox, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(inbox[0] || null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  const filtered = inbox.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const toggleReadStatus = (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, status: nextStatus } : m));
    if (selectedMsg && selectedMsg.id === msg.id) {
      setSelectedMsg(prev => ({ ...prev, status: nextStatus }));
    }
    logAction(`Marked email from ${msg.name} as ${nextStatus}`);
  };

  const handleArchive = (msg) => {
    setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'archived' } : m));
    setSelectedMsg(null);
    logAction(`Archived message thread from ${msg.name}`);
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setInbox(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, status: 'read', reply: replyText } : m));
    setSelectedMsg(prev => ({ ...prev, status: 'read', reply: replyText }));
    logAction(`Sent response email to ${selectedMsg.name}`);
    setReplyText('');
    setShowReplyModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Inquiry Mailbox</h1>
        <p className="text-xs text-slate-500 font-sans">Review client contact inquiries, generate replies, and flag archive categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Mail list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="admin-card space-y-4 flex flex-col h-[500px]">
            <div className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search sender, subjects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-input pl-10"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-1">
              {filtered.map(msg => {
                const isActive = selectedMsg && selectedMsg.id === msg.id;
                const isUnread = msg.status === 'unread';

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsg(msg)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-brand-primary/10 border-brand-primary/30 text-white' 
                        : 'bg-slate-50 dark:bg-brand-slateAccent/10 border-brand-borderLight dark:border-brand-slateAccent/30 text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-slateAccent/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        )}
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{msg.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-semibold">{msg.id}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate">{msg.subject}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{msg.text}</p>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-500 italic text-xs">Inbox clean. No messages found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Message viewer */}
        <div className="lg:col-span-7">
          <div className="admin-card h-[500px] flex flex-col justify-between">
            {selectedMsg ? (
              <div className="flex flex-col h-full justify-between">
                
                {/* Message header details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">{selectedMsg.subject}</h3>
                      <span className="text-[11px] text-slate-400 mt-1 block">From: <strong>{selectedMsg.name}</strong> ({selectedMsg.email})</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleReadStatus(selectedMsg)} 
                        className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded"
                        title="Toggle read status"
                      >
                        {selectedMsg.status === 'unread' ? <MailOpen size={12} /> : <Mail size={12} />}
                      </button>
                      <button 
                        onClick={() => handleArchive(selectedMsg)} 
                        className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded"
                        title="Archive message"
                      >
                        <Archive size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Inquiry description text */}
                  <div className="bg-slate-50 dark:bg-brand-slateAccent/10 border border-brand-borderLight dark:border-brand-slateAccent/20 p-4 rounded-lg text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
                    {selectedMsg.text}
                  </div>

                  {/* Staged replies visual */}
                  {selectedMsg.reply && (
                    <div className="border-l-2 border-brand-primary pl-4 py-2 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-brand-primary font-bold">Your Response Sent:</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{selectedMsg.reply}</p>
                    </div>
                  )}
                </div>

                {/* Footer Reply tools */}
                {!selectedMsg.reply ? (
                  <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                    <button
                      onClick={() => setShowReplyModal(true)}
                      className="btn-primary w-full py-2.5 flex items-center justify-center space-x-1.5"
                    >
                      <Send size={12} />
                      <span>Compose Response</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 italic text-center py-2 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                    Thread closed. Inquiry response resolved.
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <Mail size={32} className="opacity-25 mb-3" />
                <p className="text-xs italic">Select an inquiry thread from the left menu to display message details.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- QUICK REPLY MODAL DIALOG --- */}
      <AnimatePresence>
        {showReplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowReplyModal(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-brand-darker border border-brand-borderLight dark:border-brand-slateAccent p-6 rounded-xl z-10 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Compose Response Email</h3>
                <button onClick={() => setShowReplyModal(false)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>

              <form onSubmit={submitReply} className="space-y-4 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">To:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{selectedMsg.name} &lt;{selectedMsg.email}&gt;</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Email Body Message</label>
                  <textarea
                    rows={6}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Compose your technical response details here..."
                    className="admin-input resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowReplyModal(false)} className="w-1/2 btn-secondary py-2">Discard</button>
                  <button type="submit" className="w-1/2 btn-primary py-2 flex items-center justify-center space-x-1.5">
                    <Send size={12} />
                    <span>Send Reply</span>
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
