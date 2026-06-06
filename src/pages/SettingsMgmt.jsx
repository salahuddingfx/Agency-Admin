import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Settings, Sliders, Check, FileCode } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function SettingsMgmt() {
  const { settings, setSettings, logAction } = useAdmin();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'seo'

  // Form states general
  const [siteName, setSiteName] = useState(settings.siteName);
  const [logoText, setLogoText] = useState(settings.logoText);
  const [footerText, setFooterText] = useState(settings.footerText);
  const [socialTwitter, setSocialTwitter] = useState(settings.socialTwitter);
  const [socialLinkedin, setSocialLinkedin] = useState(settings.socialLinkedin);
  const [socialGithub, setSocialGithub] = useState(settings.socialGithub);

  // Form states SEO
  const [globalSeoTitle, setGlobalSeoTitle] = useState(settings.globalSeoTitle);
  const [globalSeoDesc, setGlobalSeoDesc] = useState(settings.globalSeoDesc);
  const [globalSchema, setGlobalSchema] = useState(settings.globalSchema);

  const saveGeneral = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev, siteName, logoText, footerText, socialTwitter, socialLinkedin, socialGithub
    }));
    logAction('Updated site general metadata configurations');
    alert('General settings saved.');
  };

  const saveSeo = (e) => {
    e.preventDefault();
    try {
      // Validate schema format is JSON
      JSON.parse(globalSchema);
      setSettings(prev => ({
        ...prev, globalSeoTitle, globalSeoDesc, globalSchema
      }));
      logAction('Updated site crawler metadata and JSON-LD schema configurations');
      alert('SEO configs saved successfully.');
    } catch (err) {
      alert('Invalid JSON-LD schema markup. Please check syntax brackets.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">System Settings</h1>
        <p className="text-xs text-slate-500 font-sans">Manage global brand tokens, sitemaps configurations, and crawlers schemas</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-brand-borderLight dark:border-brand-slateAccent/40 gap-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'general' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          General Brand Configurations
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'seo' 
              ? 'border-brand-primary text-brand-primary' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          SEO Meta & Schemas
        </button>
      </div>

      <div className="max-w-3xl">
        
        {/* --- GENERAL SETTINGS --- */}
        {activeTab === 'general' && (
          <form onSubmit={saveGeneral} className="admin-card space-y-5 text-xs">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3 mb-4">
              <Sliders size={14} className="text-brand-primary" />
              <span>General Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-slate-500">Website Name</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-slate-500">Logo Wordmark</label>
                <input
                  type="text"
                  required
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-slate-500">Footer Tagline/Copyright</label>
              <input
                type="text"
                required
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Corporate Social links</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-slate-500">Twitter URL</label>
                  <input
                    type="url"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-slate-500">LinkedIn Company URL</label>
                  <input
                    type="url"
                    value={socialLinkedin}
                    onChange={(e) => setSocialLinkedin(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-slate-500">GitHub Organization</label>
                  <input
                    type="url"
                    value={socialGithub}
                    onChange={(e) => setSocialGithub(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40 flex justify-end">
              <button type="submit" className="btn-primary py-2.5">Save Configurations</button>
            </div>
          </form>
        )}

        {/* --- SEO & SCHEMA SETTINGS --- */}
        {activeTab === 'seo' && (
          <form onSubmit={saveSeo} className="admin-card space-y-5 text-xs">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-borderLight dark:border-brand-slateAccent/40 pb-3 mb-4">
              <Globe size={14} className="text-brand-primary" />
              <span>SEO Meta Configurations</span>
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-slate-500">Global Title Template</label>
              <input
                type="text"
                required
                value={globalSeoTitle}
                onChange={(e) => setGlobalSeoTitle(e.target.value)}
                className="admin-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-semibold text-slate-500">Global Description Tag</label>
              <textarea
                rows={3}
                required
                value={globalSeoDesc}
                onChange={(e) => setGlobalSeoDesc(e.target.value)}
                className="admin-input resize-none"
              />
            </div>

            <div className="space-y-2 pt-3 border-t border-brand-borderLight dark:border-brand-slateAccent/40">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <FileCode size={12} className="text-brand-primary" />
                <span>JSON-LD Schema Markup (Structured Data)</span>
              </h4>
              <textarea
                rows={5}
                required
                value={globalSchema}
                onChange={(e) => setGlobalSchema(e.target.value)}
                className="admin-input font-mono resize-none leading-relaxed text-[11px]"
              />
            </div>

            <div className="pt-4 border-t border-brand-borderLight dark:border-brand-slateAccent/40 flex justify-end">
              <button type="submit" className="btn-primary py-2.5">Save SEO Settings</button>
            </div>
          </form>
        )}

      </div>
    </motion.div>
  );
}
