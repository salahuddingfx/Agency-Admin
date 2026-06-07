import { createContext, useContext, useState, useEffect } from 'react';

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

const initialTestimonials = [
  { id: 'test-1', name: 'Marcus Aurelius', company: 'Empire Logistics', text: 'Nextora rebuilt our inventory portal. The delivery route efficiency rose 20% in weeks.', stars: 5 }
];

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

  // Auth User Details
  const [auth, setAuth] = useState({
    user: null,
    isLoggedIn: false
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

  const loginUser = (email, role) => {
    setAuth({
      user: { email, role },
      isLoggedIn: true
    });
    // Append log event
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
        setServices,
        portfolio,
        setPortfolio,
        cases,
        setCases,
        blogs,
        setBlogs,
        team,
        setTeam,
        tech,
        setTech,
        testimonials,
        setTestimonials,
        careers,
        setCareers,
        applications,
        setApplications,
        inbox,
        setInbox,
        leads,
        setLeads,
        portalClients,
        setPortalClients,
        usersList,
        setUsersList,
        auditLogs,
        setAuditLogs,
        settings,
        setSettings,
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
