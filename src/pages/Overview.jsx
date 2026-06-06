import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Server, Briefcase, Newspaper, TrendingUp, Users, UserCheck, ArrowRight, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function Overview() {
  const { services, portfolio, blogs, team, applications, leads, auditLogs } = useAdmin();

  const cards = [
    { name: 'Total Services', value: services.length, path: '/services', color: 'text-brand-primary', bg: 'bg-brand-primary/5', icon: <Server size={18} /> },
    { name: 'Total Projects', value: portfolio.length, path: '/portfolio', color: 'text-brand-secondary', bg: 'bg-brand-secondary/5', icon: <Briefcase size={18} /> },
    { name: 'Total Blogs', value: blogs.length, path: '/blog', color: 'text-brand-accent', bg: 'bg-brand-accent/5', icon: <Newspaper size={18} /> },
    { name: 'Total Leads', value: leads.length, path: '/leads', color: 'text-emerald-500', bg: 'bg-emerald-500/5', icon: <TrendingUp size={18} /> },
    { name: 'Team Members', value: team.length, path: '/team', color: 'text-purple-500', bg: 'bg-purple-500/5', icon: <Users size={18} /> },
    { name: 'Applications', value: applications.length, path: '/careers', color: 'text-amber-500', bg: 'bg-amber-500/5', icon: <UserCheck size={18} /> }
  ];

  // Simulated Analytics Datasets representation
  const weeklyAnalytics = [
    { day: 'Mon', views: 240, leads: 12 },
    { day: 'Tue', views: 320, leads: 18 },
    { day: 'Wed', views: 280, leads: 14 },
    { day: 'Thu', views: 410, leads: 22 },
    { day: 'Fri', views: 380, leads: 19 },
    { day: 'Sat', views: 190, leads: 8 },
    { day: 'Sun', views: 220, leads: 10 }
  ];

  const maxViews = Math.max(...weeklyAnalytics.map(d => d.views));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">System Overview</h1>
        <p className="text-xs text-slate-500">Real-time status configurations for Nextora Studio digital instances</p>
      </div>

      {/* Grid of Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {cards.map((card, idx) => (
          <Link 
            key={card.name} 
            to={card.path}
            className="admin-card hover:border-brand-primary/30 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
              <ChevronRightIcon size={12} className="text-slate-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">{card.name}</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight mt-1 block">
                {card.value}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Analytics Graph representation Left */}
        <div className="lg:col-span-8 admin-card flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center justify-between border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-4 mb-6">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Website Traffic Logs</h3>
                <span className="text-[10px] text-slate-400 block mt-0.5">Visits and inquiry conversion rates</span>
              </div>
              <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-0.5 rounded">
                Weekly Staging Mode
              </span>
            </div>

            {/* Custom SVG Graph mock grid */}
            <div className="h-48 flex items-end justify-between gap-4 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <hr className="border-slate-500 border-dashed" />
                <hr className="border-slate-500 border-dashed" />
                <hr className="border-slate-500 border-dashed" />
              </div>

              {weeklyAnalytics.map((day) => {
                const heightPercent = (day.views / maxViews) * 100;
                return (
                  <div key={day.day} className="flex-grow flex flex-col items-center z-10 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-brand-darker border border-brand-slateAccent/50 p-1.5 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      <span className="block text-white font-bold">{day.views} Views</span>
                      <span className="block text-brand-primary">{day.leads} Inquiries</span>
                    </div>

                    <div 
                      className="w-full sm:w-8 bg-gradient-to-t from-brand-accent to-brand-primary rounded-t-md group-hover:opacity-80 transition-all cursor-pointer shadow-premium" 
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-slate-500 mt-2 font-semibold uppercase">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40 flex items-center justify-between text-[10px] text-slate-500 mt-4">
            <span className="flex items-center gap-1">
              <Eye size={12} className="text-brand-primary" />
              <span>Average Daily Pageviews: 290</span>
            </span>
            <span>Update frequency: 5m</span>
          </div>
        </div>

        {/* Recent Operations log Right */}
        <div className="lg:col-span-4 admin-card flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-4 mb-4">
              Recent Activity Feed
            </h3>
            
            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-[11px] border-b border-brand-borderLight dark:border-brand-slateAccent/20 pb-3 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0 text-[8px] font-bold">
                    {log.role.charAt(0)}
                  </div>
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-snug">{log.action}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">{log.user} &bull; {log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/logs"
            className="w-full py-2 border border-brand-borderLight dark:border-brand-slateAccent/50 rounded text-center text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors mt-4 block"
          >
            Explore audit trail
          </Link>
        </div>

      </div>

    </motion.div>
  );
}

// Simple Helper chevron icon inside file
function ChevronRightIcon({ size, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
