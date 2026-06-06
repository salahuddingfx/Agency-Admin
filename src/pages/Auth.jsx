import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, RefreshCw, Send, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { toast } from 'sonner';

export default function Auth() {
  const { loginUser, usersList } = useAdmin();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset' | 'change'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please fill out your work email.');
      return;
    }
    // Lookup user in mock user directory to derive role dynamically
    const matchedUser = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const role = matchedUser ? matchedUser.role : 'Super Admin'; // default fallback
    
    loginUser(email, role);
    navigate('/');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMode('reset');
    }, 2000);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setMode('change');
  };

  const handleChangeSubmit = (e) => {
    e.preventDefault();
    toast.success('Password updated successfully. Please login.');
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darker flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Decorative meshes */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-brand-slateAccent/25 border border-brand-borderLight dark:border-brand-slateAccent/30 p-8 rounded-xl shadow-premium dark:shadow-glass z-10"
      >
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center space-x-2.5 mb-3">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" stroke="rgba(24, 183, 245, 0.2)" strokeWidth="3" />
              <path d="M32 68 L32 32 L50 56 L68 32 L68 68" stroke="url(#auth-logo-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="auth-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#18B7F5" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-lg font-bold tracking-[0.25em] font-display text-slate-800 dark:text-white">NEXTORA</span>
          </div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Admin Portal Sandbox</h2>
        </div>

        {/* --- LOGIN MODE --- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block">Work Email</label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nextora.tech"
                  className="admin-input !pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-semibold text-slate-500">Security Password</label>
                <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-brand-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="admin-input !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 mt-4 flex items-center justify-center space-x-1.5">
              <span>Access Dashboard</span>
            </button>
          </form>
        )}

        {/* --- FORGOT PASSWORD MODE --- */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your corporate email. We will simulate sending a verification reset link.
            </p>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block">Work Email</label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nextora.tech"
                  className="admin-input !pl-10"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full btn-primary py-2.5 flex items-center justify-center space-x-1.5" disabled={isSent}>
              {isSent ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{isSent ? 'Delivering...' : 'Send Reset Link'}</span>
            </button>
            
            <button type="button" onClick={() => setMode('login')} className="w-full btn-secondary py-2">Back to Login</button>
          </form>
        )}

        {/* --- RESET CODE MODE --- */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded flex items-start gap-3">
              <CheckCircle size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Reset code delivered! (For testing, enter any 6 digit credentials to bypass).
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="admin-input text-center tracking-[0.5em] text-lg font-bold"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-2.5">Verify Code</button>
            <button type="button" onClick={() => setMode('login')} className="w-full btn-secondary py-2">Cancel</button>
          </form>
        )}

        {/* --- CHANGE PASSWORD MODE --- */}
        {mode === 'change' && (
          <form onSubmit={handleChangeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block">New Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="admin-input !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block">Confirm New Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="admin-input !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-2.5">Update Password</button>
            <button type="button" onClick={() => setMode('login')} className="w-full btn-secondary py-2">Cancel</button>
          </form>
        )}

      </motion.div>
    </div>
  );
}

