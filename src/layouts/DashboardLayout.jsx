import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Server, Briefcase, FileText, Newspaper, Code, 
  Users, MessageSquare, Star, UserCheck, TrendingUp, Laptop, 
  Settings, ShieldCheck, FileSpreadsheet, Bell, Sun, Moon, 
  LogOut, Menu, X, ChevronRight, ChevronLeft, Search, AlertCircle
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import Logo from '../components/Logo';

export default function DashboardLayout({ children }) {
  const { theme, toggleTheme, auth, logoutUser, notifications, setNotifications } = useAdmin();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Services', path: '/services', icon: <Server size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Case Studies', path: '/case-studies', icon: <FileText size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Blog', path: '/blog', icon: <Newspaper size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Technologies', path: '/technologies', icon: <Code size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Team', path: '/team', icon: <Users size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Testimonials', path: '/testimonials', icon: <Star size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Careers', path: '/careers', icon: <UserCheck size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Contacts', path: '/contacts', icon: <MessageSquare size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Leads', path: '/leads', icon: <TrendingUp size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Client Portal', path: '/client-portal', icon: <Laptop size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={16} />, roles: ['Super Admin', 'Admin', 'Manager', 'Editor'] },
    { name: 'User Management', path: '/users', icon: <ShieldCheck size={16} />, roles: ['Super Admin', 'Admin'] },
    { name: 'Audit Logs', path: '/logs', icon: <FileSpreadsheet size={16} />, roles: ['Super Admin', 'Admin'] }
  ];

  const hasAccess = (itemRoles) => {
    return itemRoles.includes(auth.user?.role || 'Guest');
  };

  const getBreadcrumb = () => {
    const activeItem = navItems.find(item => item.path === location.pathname);
    return activeItem ? activeItem.name : 'Nextora Admin';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-brand-darker dark:bg-brand-darker border-r border-brand-slateAccent/40 text-slate-400">
      {/* Brand header */}
      <div className="flex items-center justify-between p-6 border-b border-brand-slateAccent/40">
        <Link to="/" className="flex items-center space-x-3">
          <Logo size={28} />
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-[0.2em] font-display text-white">NEXTORA</span>
              <span className="text-[7px] uppercase tracking-[0.25em] text-brand-primary font-medium">ADMIN PANEL</span>
            </div>
          )}
        </Link>
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1 rounded-md border border-brand-slateAccent text-slate-500 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav list */}
      <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const allowed = hasAccess(item.roles);
          
          if (!allowed) return null;

          return (
            <Link
              key={item.name}
              to={item.path}
              title={isSidebarCollapsed ? item.name : ''}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                active
                  ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role Tag Footer */}
      <div className="p-4 border-t border-brand-slateAccent/40 bg-brand-slateAccent/10 text-center text-[10px]">
        {!isSidebarCollapsed ? (
          <div>
            <span className="text-slate-500">Active Role:</span>
            <span className="block font-bold text-brand-primary mt-0.5 uppercase tracking-wider">{auth.user?.role}</span>
          </div>
        ) : (
          <span className="font-bold text-brand-primary">{auth.user?.role.charAt(0)}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darker text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* Sidebar Frame Desktop */}
      <aside 
        className={`hidden lg:block flex-shrink-0 h-screen sticky top-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right Column workspace */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-brand-darker/90 backdrop-blur-md border-b border-brand-borderLight dark:border-brand-slateAccent/40 flex items-center justify-between px-6 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-md border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-md border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Breadcrumb path label */}
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white font-display tracking-wide uppercase">
              {getBreadcrumb()}
            </span>
          </div>

          <div className="flex items-center space-x-3.5 relative">
            
            {/* Dark Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-brand-borderLight dark:border-brand-slateAccent/50 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 border border-brand-borderLight dark:border-brand-slateAccent/50 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all relative"
              >
                <Bell size={14} />
                {notifications.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-brand-dark border border-brand-borderLight dark:border-brand-slateAccent p-4 rounded-lg shadow-xl z-20"
                    >
                      <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent/50 pb-2 mb-3">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">Recent Alerts</span>
                        {notifications.length > 0 && (
                          <button onClick={clearNotifications} className="text-[10px] text-brand-primary font-semibold hover:underline">Clear</button>
                        )}
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="text-[11px] text-slate-600 dark:text-slate-400 border-b border-brand-borderLight dark:border-brand-slateAccent/20 pb-2">
                            <p className="leading-snug">{notif.text}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <span className="text-[11px] text-slate-500 italic block text-center py-4">No new system alerts.</span>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Popover */}
            <div className="relative">
              <button
                onClick={() => setShowProfilePopover(!showProfilePopover)}
                className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs hover:border-brand-primary/80 transition-colors"
              >
                {auth.user?.email.charAt(0).toUpperCase()}
              </button>

              <AnimatePresence>
                {showProfilePopover && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfilePopover(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-brand-dark border border-brand-borderLight dark:border-brand-slateAccent p-4 rounded-lg shadow-xl z-20"
                    >
                      <div className="border-b border-brand-borderLight dark:border-brand-slateAccent/50 pb-3 mb-4">
                        <span className="text-xs font-bold text-slate-800 dark:text-white block truncate">{auth.user?.email}</span>
                        <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block mt-1">{auth.user?.role}</span>
                      </div>
                      <div className="space-y-2">
                        <Link to="/settings" onClick={() => setShowProfilePopover(false)} className="block text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1">Settings Profile</Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-1.5 py-2 border-t border-brand-borderLight dark:border-brand-slateAccent/40 text-left text-xs text-red-500 hover:text-red-400 mt-2 font-semibold"
                        >
                          <LogOut size={12} />
                          <span>Logout Sandbox</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Content body frame */}
        <main className="flex-grow p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
