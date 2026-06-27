import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, Eye, Upload, Loader2 } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { api } from '../api/api';

export default function TeamMgmt() {
  const { team, setTeam, logAction } = useAdmin();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [skillsStr, setSkillsStr] = useState(''); // "React:90, Node:85"
  const [avatarUrl, setAvatarUrl] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [uploading, setUploading] = useState(false);

  const filtered = team.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingItem(null);
    setName('');
    setRole('');
    setExperience('');
    setBio('');
    setSkillsStr('');
    setAvatarUrl('');
    setGithub('');
    setLinkedin('');
    setTwitter('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (item) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setExperience(item.experience);
    setBio(item.bio || '');
    setAvatarUrl(item.avatarUrl || '');
    setGithub(item.github || '');
    setLinkedin(item.linkedin || '');
    setTwitter(item.twitter || '');
    
    // Safely serialize skills arrays back to a string for input editing
    let skillsString = '';
    if (Array.isArray(item.skills)) {
      skillsString = item.skills.map(s => `${s.name}:${s.level !== undefined ? s.level : (s.value !== undefined ? s.value : 50)}`).join(', ');
    } else if (typeof item.skills === 'string') {
      skillsString = item.skills;
    }
    
    setSkillsStr(skillsString);
    setDrawerOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.uploadFile(formData);
      if (res.success && res.url) {
        // Cloudinary returns a full https:// URL — use it directly
        setAvatarUrl(res.url);
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const memberData = { name, role, experience, bio, skills: skillsStr, avatarUrl, github, linkedin, twitter };

    if (editingItem) {
      setTeam(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...memberData } : t));
      logAction(`Modified Team Member Profile: ${name}`);
    } else {
      const created = { id: `tm-${Date.now()}`, ...memberData };
      setTeam(prev => [...prev, created]);
      logAction(`Added Team Member: ${name}`);
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id, tmName) => {
    if (confirm(`Remove "${tmName}" from Nextora team?`)) {
      setTeam(prev => prev.filter(t => t.id !== id));
      logAction(`Deleted Team Member: ${tmName}`);
    }
  };

  // Parse skill string into pairs
  const renderSkills = (skills) => {
    if (!skills) return null;
    
    let skillsArray = [];
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(pair => {
        const [name, level] = pair.split(':');
        return { name: name?.trim() || '', level: parseInt(level) || 50 };
      });
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }

    return skillsArray.map((skill, idx) => {
      const skillName = skill.name || skill.label || '';
      const val = skill.level !== undefined ? skill.level : (skill.value !== undefined ? skill.value : 50);
      if (!skillName) return null;
      return (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{skillName}</span>
            <span className="font-semibold text-brand-primary">{val}%</span>
          </div>
          <div className="h-1 bg-slate-100 dark:bg-brand-slateAccent rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary rounded-full" style={{ width: `${val}%` }} />
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Team Directory</h1>
          <p className="text-xs text-slate-500 font-sans">Manage corporate directory listings, technical skills gauges, and experiences</p>
        </div>

        <button 
          onClick={openAddDrawer}
          className="btn-primary flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus size={14} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="admin-card py-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search member name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="admin-card flex flex-col justify-between hover:border-brand-primary/10 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display leading-tight">{item.name}</h3>
                  <span className="text-[10px] text-brand-primary font-semibold tracking-wide block mt-0.5">{item.role}</span>
                </div>
              </div>

              {/* Skills sliders */}
              <div className="space-y-3 pt-3 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Focus Expertise</span>
                <div className="space-y-2.5">
                  {renderSkills(item.skills)}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-brand-borderLight dark:border-brand-slateAccent/40 flex justify-between items-center text-[10px] text-slate-500">
              <span className="font-semibold">{item.experience}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditDrawer(item)}
                  className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-brand-primary rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1 border border-brand-borderLight dark:border-brand-slateAccent text-slate-500 hover:text-red-500 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">No team profiles found.</div>
        )}
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
                    {editingItem ? 'Edit Profile details' : 'Add Team Member'}
                  </h3>
                  <button 
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 border border-brand-borderLight dark:border-brand-slateAccent rounded-full text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs">

                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden border-2 border-brand-slateAccent flex items-center justify-center bg-brand-primary/10 text-brand-primary font-bold text-xl">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center gap-2 cursor-pointer btn-secondary py-2 px-3 w-full justify-center"
                        >
                          {uploading ? (
                            <><Loader2 size={12} className="animate-spin" /><span>Uploading…</span></>
                          ) : (
                            <><Upload size={12} /><span>Upload Photo</span></>
                          )}
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="text-[9px] text-red-400 hover:text-red-600 flex items-center gap-1"
                          >
                            <X size={10} /> Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Amina Al-Masri"
                      className="admin-input"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Corporate Role</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Lead Developer"
                      className="admin-input"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Years of Experience</label>
                    <input
                      type="text"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g., 8+ Years (Ex-Stripe)"
                      className="admin-input"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Short Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief background about this team member…"
                      className="admin-input resize-none"
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-semibold text-slate-500">Skills Indicators</label>
                      <span className="text-[8px] text-slate-500">Format: Name:Percent (comma separated)</span>
                    </div>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="React:95, Node:80, CSS:90"
                      className="admin-input font-mono"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-500">Social Links</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-14 shrink-0">GitHub</span>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="admin-input flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-14 shrink-0">LinkedIn</span>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="admin-input flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-14 shrink-0">Twitter/X</span>
                        <input
                          type="url"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="https://x.com/username"
                          className="admin-input flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="w-1/2 btn-secondary py-2.5">Cancel</button>
                    <button type="submit" className="w-1/2 btn-primary py-2.5">Save Profile</button>
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
