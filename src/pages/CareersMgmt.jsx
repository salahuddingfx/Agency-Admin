import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Eye, ExternalLink } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function CareersMgmt() {
  const { careers, setCareers, applications, setApplications, logAction } = useAdmin();
  
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form states for Jobs
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Open');

  const filteredJobs = careers.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
    j.department.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredApps = applications.filter(a => 
    a.name.toLowerCase().includes(appSearch.toLowerCase()) || 
    a.roleApplied.toLowerCase().includes(appSearch.toLowerCase())
  );

  const openAddJob = () => {
    setEditingJob(null);
    setTitle('');
    setDepartment('Engineering');
    setSalary('');
    setStatus('Open');
    setDrawerOpen(true);
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setDepartment(job.department);
    setSalary(job.salary);
    setStatus(job.status);
    setDrawerOpen(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!title.trim() || !salary.trim()) return;

    if (editingJob) {
      setCareers(prev => prev.map(c => c.id === editingJob.id ? {
        ...c, title, department, salary, status
      } : c));
      logAction(`Modified Job Opening: ${title}`);
    } else {
      const created = {
        id: `job-${Date.now()}`,
        title,
        department,
        salary,
        status
      };
      setCareers(prev => [...prev, created]);
      logAction(`Created Job Opening: ${title}`);
    }
    setDrawerOpen(false);
  };

  const handleDeleteJob = (id, jobTitle) => {
    if (confirm(`Remove position "${jobTitle}"?`)) {
      setCareers(prev => prev.filter(c => c.id !== id));
      logAction(`Deleted Job Position: ${jobTitle}`);
    }
  };

  const handleStatusChange = (appId, name, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    logAction(`Updated Candidate "${name}" status to ${newStatus}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Recruitment Center</h1>
        <p className="text-xs text-slate-500 font-sans">Manage corporate openings, review resumes, and select candidate tracks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Open Job Roles listings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="admin-card space-y-4">
            <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Positions Board</h3>
              <button onClick={openAddJob} className="p-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded flex items-center gap-1 text-[10px] font-bold">
                <Plus size={10} />
                <span>Add Role</span>
              </button>
            </div>

            <div className="relative">
              <Search size={12} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search active roles..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="admin-input pl-8 py-1.5 text-[11px]"
              />
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {filteredJobs.map(job => (
                <div key={job.id} className="p-3 border border-brand-borderLight dark:border-brand-slateAccent/40 rounded-lg bg-slate-50 dark:bg-brand-slateAccent/10 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{job.title}</h4>
                    <span className="text-[9px] text-slate-400 block mt-1">{job.department} &bull; {job.salary}</span>
                  </div>
                  <div className="flex space-x-1.5 flex-shrink-0">
                    <button onClick={() => openEditJob(job)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent hover:text-brand-primary rounded"><Edit2 size={10} /></button>
                    <button onClick={() => handleDeleteJob(job.id, job.title)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent hover:text-red-500 rounded"><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="text-center py-10 text-slate-500 italic text-[11px]">No jobs found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Candidate applications log */}
        <div className="lg:col-span-7 space-y-4">
          <div className="admin-card space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3">
              Candidate Submissions
            </h3>

            <div className="relative">
              <Search size={12} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates names or roles..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="admin-input pl-8 py-1.5 text-[11px]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-borderLight dark:border-brand-slateAccent/40 text-[9px] text-slate-500 uppercase tracking-widest">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Applied Role</th>
                    <th className="pb-2">Resume</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-borderLight dark:divide-brand-slateAccent/10">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 dark:text-white">{app.name}</td>
                      <td className="py-3 text-slate-400">{app.roleApplied}</td>
                      <td className="py-3">
                        <a href={app.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-0.5 text-brand-primary hover:underline">
                          <span>CV</span>
                          <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          app.status === 'Accepted' ? 'bg-green-500/10 text-green-400' :
                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, app.name, e.target.value)}
                          className="bg-slate-100 dark:bg-brand-slateAccent/50 border border-brand-borderLight dark:border-brand-slateAccent text-slate-700 dark:text-white rounded px-1.5 py-0.5 text-[9px] outline-none"
                        >
                          <option>Pending</option>
                          <option>Screened</option>
                          <option>Accepted</option>
                          <option>Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* --- ADD/EDIT JOB DIALOG DRAWER --- */}
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
              className="relative w-full max-w-sm bg-white dark:bg-brand-darker border-l border-brand-borderLight dark:border-brand-slateAccent h-full overflow-y-auto p-6 z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-slateAccent pb-4 mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                    {editingJob ? 'Edit Job specs' : 'Add Open Position'}
                  </h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Job Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Lead Developer"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Department</label>
                      <select value={department} onChange={(e) => setDepartment(e.target.value)} className="admin-input">
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Management</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input">
                        <option>Open</option>
                        <option>Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Salary parameters</label>
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g., $100k - $120k"
                      className="admin-input"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2">Save Role</button>
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
