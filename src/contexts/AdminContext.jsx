import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

/* ─── UI Normalizers (Sync structure between server and client) ───── */
function parseSkillsString(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string' && skills.includes(':')) {
    return skills.split(',').map(s => {
      const [name, level] = s.trim().split(':');
      return { name: name?.trim() || '', level: parseInt(level) || 0 };
    });
  }
  return [];
}

function toArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val) return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

function normalizeTeamMembers(members) {
  if (!Array.isArray(members)) return [];
  return members.map(m => ({
    ...m,
    id: m._id || m.id,
    skills: parseSkillsString(m.skills),
    bio: m.bio || '',
    avatarGradient: m.avatarGradient || 'from-brand-primary to-brand-accent',
    avatarUrl: m.avatarUrl || '',
    github: m.github || m.socials?.github || '',
    linkedin: m.linkedin || m.socials?.linkedin || '',
    twitter: m.twitter || m.socials?.twitter || '',
    // Keep backward-compat socials object used by client Team page
    socials: {
      github: m.github || m.socials?.github || '#',
      linkedin: m.linkedin || m.socials?.linkedin || '#',
      twitter: m.twitter || m.socials?.twitter || '#',
    },
  }));
}

function normalizeServices(services) {
  if (!Array.isArray(services)) return [];
  return services.map(s => ({
    ...s,
    id: s._id || s.id,
    features: toArr(s.features),
    iconName: s.iconName || s.category || 'Layers',
    slug: s.slug || s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

function normalizePortfolios(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map(p => ({
    ...p,
    id: p._id || p.id,
    services: toArr(p.services),
    summary: p.summary || p.description || '',
    imageColor: p.imageColor || 'from-blue-600 to-cyan-500',
  }));
}

function normalizeCaseStudies(studies) {
  if (!Array.isArray(studies)) return [];
  return studies.map(s => ({
    ...s,
    id: s._id || s.id,
    stats: Array.isArray(s.stats) ? s.stats : [
      { label: 'Problem', value: s.problem ? '1 identified' : 'N/A' },
      { label: 'Solution', value: s.solution ? 'Delivered' : 'Pending' },
      { label: 'Result', value: s.result || 'In progress' },
    ],
    category: s.category || 'Custom Software',
    summary: s.summary || s.problem || '',
    coverColor: s.coverColor || 'from-blue-600 to-indigo-700',
  }));
}

function normalizeCareers(careers) {
  if (!Array.isArray(careers)) return [];
  return careers.map(c => ({
    ...c,
    id: c._id || c.id,
    type: c.type || c.department || 'Full-time',
    responsibilities: toArr(c.responsibilities),
    requirements: toArr(c.requirements),
  }));
}

function normalizeTechnologies(techs) {
  if (!Array.isArray(techs)) return [];
  return techs.map(t => ({
    ...t,
    id: t._id || t.id,
  }));
}

function normalizeTestimonials(testimonials) {
  if (!Array.isArray(testimonials)) return [];
  return testimonials.map(t => ({
    ...t,
    id: t._id || t.id,
  }));
}

function normalizeBlogs(blogs) {
  if (!Array.isArray(blogs)) return [];
  return blogs.map(b => ({
    ...b,
    id: b._id || b.id,
    tags: toArr(b.tags),
    summary: b.summary || b.excerpt || '',
  }));
}

const AdminContext = createContext();

// Mock Initial Databases
const initialServices = [
  { id: 'srv-1', title: 'Web Development', category: 'Engineering', metric: '99.9% Uptime SLA', status: 'Published', shortDesc: 'Stunning, high-performance web applications built with modern frameworks.' },
  { id: 'srv-2', title: 'Mobile App Development', category: 'Engineering', metric: '4.8+ Avg Rating', status: 'Published', shortDesc: 'Native and cross-platform mobile apps with frictionless user journeys.' },
  { id: 'srv-3', title: 'Custom Software Development', category: 'Engineering', metric: '100% Tailored Workflows', status: 'Published', shortDesc: 'Bespoke software solutions tailored to solve complex business problems.' },
  { id: 'srv-4', title: 'ERP & CRM Systems', category: 'Operations', metric: '40% Speed Increase', status: 'Draft', shortDesc: 'Unified platforms to manage enterprise resources and customer relationships.' }
];

const initialPortfolio = [
  { id: 'proj-1', title: 'Apex E-Commerce Ecosystem', category: 'Web Development', client: 'Apex Retail International', featured: true, imageColor: 'from-blue-600 to-cyan-500' },
  { id: 'proj-2', title: 'Velo Logistics Mobile App', category: 'Mobile App Development', client: 'Velo Delivery Inc.', featured: true, imageColor: 'from-sky-500 to-indigo-600' },
  { id: 'proj-3', title: 'Omni CRM & Supply Chain', category: 'ERP & CRM Systems', client: 'Omni Manufacturing LLC', featured: false, imageColor: 'from-purple-600 to-blue-500' }
];

const initialCaseStudies = [
  { id: 'case-1', title: 'Re-Architecting Apex Monolith', client: 'Apex Retail', status: 'Published', problem: 'Apex faced high server costs and slow checkouts.', solution: 'Built React/Vite headless checkout frontends.', result: 'Page loads dropped to 0.8s, saving 60% server costs.' }
];

const initialBlogs = [
  { id: 'post-1', title: 'Why Headless React Frontends are Dominating', author: 'Sarah Jenkins', category: 'Web Development', status: 'Published', metaTitle: 'Headless E-Commerce in 2026', metaDesc: 'Learn why static frontends convert better.' }
];

const initialTeam = [
  { id: 'tm-1', name: 'Sarah Jenkins', role: 'CEO & Principal Architect', experience: '12+ Years', skills: 'React:98,Cloud:92' },
  { id: 'tm-2', name: 'David Carter', role: 'VP of Engineering', experience: '9 Years', skills: 'Node:94,Docker:88' }
];

const initialTech = [
  { id: 'tech-1', name: 'React', category: 'Frontend', desc: 'Component UI rendering.' },
  { id: 'tech-2', name: 'Node.js', category: 'Backend', desc: 'Javascript server runtime.' },
  { id: 'tech-3', name: 'Docker', category: 'Infrastructure', desc: 'Environment containerization.' }
];

const initialTestimonials = [];

const initialCareers = [
  { id: 'job-1', title: 'Senior Frontend Engineer (React/Tailwind)', department: 'Engineering', status: 'Open', salary: '$110,000 - $140,000' },
  { id: 'job-2', title: 'Product & UI/UX Designer', department: 'Design', status: 'Open', salary: '$90,000 - $115,000' }
];

const initialApplications = [
  { id: 'app-1', name: 'Emma Watson', email: 'emma@watson.dev', roleApplied: 'Senior Frontend Engineer (React/Tailwind)', status: 'Pending', fileUrl: 'https://resume.watson.dev/cv.pdf' },
  { id: 'app-2', name: 'Bruce Wayne', email: 'bruce@waynecorp.com', roleApplied: 'Product & UI/UX Designer', status: 'Screened', fileUrl: 'https://batcave.org/wayne_resume.pdf' }
];

const initialInbox = [
  { id: 'msg-1', name: 'Clara Oswald', email: 'clara@tardis.org', subject: 'Custom CRM quote request', text: 'Hi, I would like to build a customer logging panel that syncs with our Salesforce database. What is your average staging timeline?', status: 'unread', reply: '' },
  { id: 'msg-2', name: 'Tony Stark', email: 'tony@starkindustries.com', subject: 'Arc Reactor AI dashboard integration', text: 'I need a fast, React-based dashboard displaying live thermo-output datasets. Let me know if you can sign an NDA today.', status: 'read', reply: 'Hi Tony, we would love to. Our Principal Architect will contact you.' }
];

const initialLeads = [
  { id: 'ld-1', company: 'Stark Industries', contactName: 'Tony Stark', email: 'tony@stark.com', value: '$75,000', status: 'Proposal', assignee: 'Sarah Jenkins', notes: ['NDA signed', 'Awaiting thermal mockups'] },
  { id: 'ld-2', company: 'Wayne Enterprises', contactName: 'Lucius Fox', email: 'lucius@wayne.com', value: '$45,000', status: 'New', assignee: 'David Carter', notes: ['Referred by Bruce'] }
];

const initialPortalClients = [
  { id: 'cli-1', name: 'Alex Rivera', company: 'Apex Retail International', activeProject: 'Apex Headless E-Commerce Upgrade', invoicesCount: 3, supportStatus: '1 Open Ticket' }
];

const initialUsersList = [
  { id: 'usr-1', name: 'Salah Uddin Kader', email: 'info.salahuddinkader@gmail.com', role: 'Super Admin', status: 'Active' },
  { id: 'usr-2', name: 'David Carter', email: 'david@nextora.tech', role: 'Admin', status: 'Active' },
  { id: 'usr-3', name: 'Amina Al-Masri', email: 'amina@nextora.tech', role: 'Manager', status: 'Active' },
  { id: 'usr-4', name: 'Junior Editor', email: 'editor@nextora.tech', role: 'Editor', status: 'Active' }
];

const initialAuditLogs = [
  { id: 'log-1', timestamp: '2026-06-05 18:30:12', user: 'info.salahuddinkader@gmail.com', action: 'Login Approved', ip: '192.168.1.42', role: 'Super Admin' },
  { id: 'log-2', timestamp: '2026-06-05 19:12:44', user: 'editor@nextora.tech', action: 'Draft Blog Created: E-Commerce Trends', ip: '192.168.1.105', role: 'Editor' }
];

const initialSettings = {
  siteName: 'Nextora Studio',
  logoText: 'NEXTORA',
  faviconSvg: 'N Logo',
  footerText: 'Where Ideas Take Shape. All rights reserved.',
  socialTwitter: 'https://twitter.com/nextorastudio',
  socialLinkedin: 'https://linkedin.com/company/nextorastudio',
  socialGithub: 'https://github.com/nextorastudio',
  globalSeoTitle: 'Nextora Studio | Where Ideas Take Shape',
  globalSeoDesc: 'Nextora Studio builds premium websites, mobile applications, software, POS systems, and CRM/ERP solutions.',
  globalSchema: '{"@context": "https://schema.org", "@type": "Organization", "name": "Nextora Studio"}'
};

export function AdminProvider({ children }) {
  // Theme Manager
  const [theme, setTheme] = useState(() => localStorage.getItem('admin-theme') || 'dark');

  // Auth User Details (Auto-resolve state on initial mount from localStorage)
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      try {
        return {
          user: JSON.parse(userStr),
          isLoggedIn: true
        };
      } catch {
        return { user: null, isLoggedIn: false };
      }
    }
    return { user: null, isLoggedIn: false };
  });

  // Database states
  const [services, setServices] = useState(initialServices);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [cases, setCases] = useState(initialCaseStudies);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [team, setTeam] = useState(initialTeam);
  const [tech, setTech] = useState(initialTech);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [careers, setCareers] = useState(initialCareers);
  const [applications, setApplications] = useState(initialApplications);
  const [inbox, setInbox] = useState(initialInbox);
  const [leads, setLeads] = useState(initialLeads);
  const [portalClients, setPortalClients] = useState(initialPortalClients);
  const [usersList, setUsersList] = useState(initialUsersList);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [settings, setSettings] = useState(initialSettings);

  // App notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New lead Stark Industries entered pipeline', read: false, time: '10m ago' },
    { id: 2, text: 'New career application from Emma Watson', read: false, time: '1h ago' }
  ]);

  // Load all DB collections from backend API on login/mount
  useEffect(() => {
    if (!auth.isLoggedIn || localStorage.getItem('adminToken') === 'mock-sandbox-token') {
      return;
    }

    const loadData = async () => {
      try {
        const [
          srvRes,
          portRes,
          caseRes,
          blogRes,
          teamRes,
          techRes,
          testRes,
          careerRes,
          appRes,
          leadRes,
          clientRes,
          userRes,
          contactRes,
          settingsRes
        ] = await Promise.all([
          api.getServices().catch(() => ({ success: false, data: [] })),
          api.getPortfolios().catch(() => ({ success: false, data: [] })),
          api.getCaseStudies().catch(() => ({ success: false, data: [] })),
          api.getBlogs().catch(() => ({ success: false, data: [] })),
          api.getTeams().catch(() => ({ success: false, data: [] })),
          api.getTechnologies().catch(() => ({ success: false, data: [] })),
          api.getTestimonials().catch(() => ({ success: false, data: [] })),
          api.getCareers().catch(() => ({ success: false, data: [] })),
          api.getApplications().catch(() => ({ success: false, data: [] })),
          api.getLeads().catch(() => ({ success: false, data: [] })),
          api.getClients().catch(() => ({ success: false, data: [] })),
          api.getUsers().catch(() => ({ success: false, data: [] })),
          api.getContacts().catch(() => ({ success: false, data: [] })),
          api.getSettings().catch(() => ({ success: false, data: initialSettings }))
        ]);

        if (srvRes.success && srvRes.data?.length > 0) setServices(normalizeServices(srvRes.data));
        if (portRes.success && portRes.data?.length > 0) setPortfolio(normalizePortfolios(portRes.data));
        if (caseRes.success && caseRes.data?.length > 0) setCases(normalizeCaseStudies(caseRes.data));
        if (blogRes.success && blogRes.data?.length > 0) setBlogs(normalizeBlogs(blogRes.data));
        if (teamRes.success && teamRes.data?.length > 0) setTeam(normalizeTeamMembers(teamRes.data));
        if (techRes.success && techRes.data?.length > 0) setTech(normalizeTechnologies(techRes.data));
        if (testRes.success && testRes.data?.length > 0) setTestimonials(normalizeTestimonials(testRes.data));
        if (careerRes.success && careerRes.data?.length > 0) setCareers(normalizeCareers(careerRes.data));
        if (appRes.success && appRes.data?.length > 0) setApplications(appRes.data.map(a => ({ ...a, id: a._id || a.id })));
        if (leadRes.success && leadRes.data?.length > 0) setLeads(leadRes.data.map(l => ({ ...l, id: l._id || l.id })));
        if (clientRes.success && clientRes.data?.length > 0) setPortalClients(clientRes.data.map(c => ({ ...c, id: c._id || c.id })));
        if (userRes.success && userRes.data?.length > 0) setUsersList(userRes.data.map(u => ({ ...u, id: u._id || u.id })));
        if (contactRes.success && contactRes.data?.length > 0) setInbox(contactRes.data.map(m => ({ ...m, id: m._id || m.id })));
        if (settingsRes.success && settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to load backend databases:', err);
      }
    };

    loadData();
  }, [auth.isLoggedIn]);

  // Intercept setter wrapper to auto-sync CRUD modifications to MongoDB API
  const makeSyncSetter = (state, setState, type, apiMethods) => {
    return async (value) => {
      let nextState;
      if (typeof value === 'function') {
        nextState = value(state);
      } else {
        nextState = value;
      }

      setState(nextState);

      if (!auth.isLoggedIn || localStorage.getItem('adminToken') === 'mock-sandbox-token') {
        return;
      }

      try {
        const currentMap = new Map(state.map(item => [item.id || item._id, item]));
        const nextMap = new Map(nextState.map(item => [item.id || item._id, item]));

        // 1. Delete items that were removed
        for (const [id, item] of currentMap.entries()) {
          if (!nextMap.has(id)) {
            if (id && !id.toString().includes('-')) {
              await apiMethods.delete(id);
            }
          }
        }

        // 2. Create or Update items
        for (const [id, item] of nextMap.entries()) {
          if (!currentMap.has(id)) {
            const apiData = { ...item };
            delete apiData.id;
            delete apiData._id;
            const res = await apiMethods.create(apiData);
            if (res.success && (res.data?._id || res.data?.id)) {
              const realId = res.data._id || res.data.id;
              setState(prev => prev.map(x => x.id === id ? { ...x, id: realId, _id: realId } : x));
            }
          } else {
            const currentItem = currentMap.get(id);
            if (JSON.stringify(currentItem) !== JSON.stringify(item)) {
              const apiData = { ...item };
              delete apiData.id;
              delete apiData._id;
              if (id && !id.toString().includes('-')) {
                await apiMethods.update(id, apiData);
              }
            }
          }
        }
      } catch (err) {
        console.error(`Sync error on ${type}:`, err);
      }
    };
  };

  const setServicesWithSync = makeSyncSetter(services, setServices, 'services', {
    create: api.createService,
    update: api.updateService,
    delete: api.deleteService
  });

  const setPortfolioWithSync = makeSyncSetter(portfolio, setPortfolio, 'portfolio', {
    create: api.createPortfolio,
    update: api.updatePortfolio,
    delete: api.deletePortfolio
  });

  const setCasesWithSync = makeSyncSetter(cases, setCases, 'cases', {
    create: api.createCaseStudy,
    update: api.updateCaseStudy,
    delete: api.deleteCaseStudy
  });

  const setBlogsWithSync = makeSyncSetter(blogs, setBlogs, 'blogs', {
    create: api.createBlog,
    update: api.updateBlog,
    delete: api.deleteBlog
  });

  const setTeamWithSync = makeSyncSetter(team, setTeam, 'team', {
    create: api.createTeam,
    update: api.updateTeam,
    delete: api.deleteTeam
  });

  const setTechWithSync = makeSyncSetter(tech, setTech, 'tech', {
    create: api.createTechnology,
    update: api.updateTechnology,
    delete: api.deleteTechnology
  });

  const setTestimonialsWithSync = makeSyncSetter(testimonials, setTestimonials, 'testimonials', {
    create: api.createTestimonial,
    update: api.updateTestimonial,
    delete: api.deleteTestimonial
  });

  const setCareersWithSync = makeSyncSetter(careers, setCareers, 'careers', {
    create: api.createCareer,
    update: api.updateCareer,
    delete: api.deleteCareer
  });

  const setApplicationsWithSync = makeSyncSetter(applications, setApplications, 'applications', {
    create: api.createApplication,
    update: api.updateApplication,
    delete: api.deleteApplication
  });

  const setInboxWithSync = makeSyncSetter(inbox, setInbox, 'inbox', {
    create: api.createContact,
    update: api.updateContact,
    delete: api.deleteContact
  });

  const setLeadsWithSync = makeSyncSetter(leads, setLeads, 'leads', {
    create: api.createLead,
    update: api.updateLead,
    delete: api.deleteLead
  });

  const setPortalClientsWithSync = makeSyncSetter(portalClients, setPortalClients, 'portalClients', {
    create: api.createClient,
    update: api.updateClient,
    delete: api.deleteClient
  });

  const setUsersListWithSync = makeSyncSetter(usersList, setUsersList, 'usersList', {
    create: api.createUser,
    update: api.updateUser,
    delete: api.deleteUser
  });

  // Sync theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  // Log audit action Helper
  const logAction = (actionText) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: auth.user?.email || 'System / Unauth',
      action: actionText,
      ip: '127.0.0.1 (LocalHost)',
      role: auth.user?.role || 'Guest'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const loginUser = (email, role, token) => {
    const user = { email, role };
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAuth({
      user,
      isLoggedIn: true
    });
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: email,
      action: `User Authenticated as ${role}`,
      ip: '127.0.0.1 (LocalHost)',
      role: role
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const logoutUser = () => {
    logAction('User Logged Out');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAuth({ user: null, isLoggedIn: false });
  };

  return (
    <AdminContext.Provider
      value={{
        theme,
        toggleTheme,
        auth,
        loginUser,
        logoutUser,
        services,
        setServices: setServicesWithSync,
        portfolio,
        setPortfolio: setPortfolioWithSync,
        cases,
        setCases: setCasesWithSync,
        blogs,
        setBlogs: setBlogsWithSync,
        team,
        setTeam: setTeamWithSync,
        tech,
        setTech: setTechWithSync,
        testimonials,
        setTestimonials: setTestimonialsWithSync,
        careers,
        setCareers: setCareersWithSync,
        applications,
        setApplications: setApplicationsWithSync,
        inbox,
        setInbox: setInboxWithSync,
        leads,
        setLeads: setLeadsWithSync,
        portalClients,
        setPortalClients: setPortalClientsWithSync,
        usersList,
        setUsersList: setUsersListWithSync,
        auditLogs,
        setAuditLogs,
        settings,
        setSettings: async (val) => {
          setSettings(val);
          if (auth.isLoggedIn && localStorage.getItem('adminToken') !== 'mock-sandbox-token') {
            try {
              await api.updateSettings(val);
            } catch (err) {
              console.error('Settings sync error:', err);
            }
          }
        },
        notifications,
        setNotifications,
        logAction
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
