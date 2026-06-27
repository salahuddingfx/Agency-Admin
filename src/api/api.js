const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Central API fetch helper
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    throw new Error(data.message || 'Network request failed');
  }

  return data;
}

export const api = {
  // Authentication
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  forgotPassword: (email) => 
    request('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    }),

  resetPassword: (token, password) => 
    request(`/auth/reset-password/admin/${token}`, {
      method: 'PUT',
      body: { password }
    }),

  changePassword: (oldPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: { oldPassword, newPassword }
    }),

  // User Management
  getUsers: () => request('/users'),
  createUser: (userData) => request('/users', { method: 'POST', body: userData }),
  updateUser: (id, userData) => request(`/users/${id}`, { method: 'PUT', body: userData }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Client Profile Management
  getClients: () => request('/clients'),
  createClient: (clientData) => request('/clients', { method: 'POST', body: clientData }),
  updateClient: (id, clientData) => request(`/clients/${id}`, { method: 'PUT', body: clientData }),
  deleteClient: (id) => request(`/clients/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request('/projects'),
  createProject: (projectData) => request('/projects', { method: 'POST', body: projectData }),
  updateProject: (id, projectData) => request(`/projects/${id}`, { method: 'PUT', body: projectData }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: () => request('/invoices'),
  createInvoice: (invoiceData) => request('/invoices', { method: 'POST', body: invoiceData }),
  updateInvoice: (id, invoiceData) => request(`/invoices/${id}`, { method: 'PUT', body: invoiceData }),
  deleteInvoice: (id) => request(`/invoices/${id}`, { method: 'DELETE' }),

  // Support Tickets
  getTickets: () => request('/tickets'),
  updateTicket: (id, ticketData) => request(`/tickets/${id}`, { method: 'PUT', body: ticketData }),
  deleteTicket: (id) => request(`/tickets/${id}`, { method: 'DELETE' }),
  replyToTicket: (id, text) => request(`/tickets/${id}/reply`, { method: 'POST', body: { sender: 'support', text } }),

  // Web CMS (Services, Portfolios, Blogs, Teams, Testimonials, Leads)
  getServices: () => request('/services'),
  createService: (data) => request('/services', { method: 'POST', body: data }),
  updateService: (id, data) => request(`/services/${id}`, { method: 'PUT', body: data }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  getBlogs: () => request('/blogs'),
  createBlog: (data) => request('/blogs', { method: 'POST', body: data }),
  updateBlog: (id, data) => request(`/blogs/${id}`, { method: 'PUT', body: data }),
  deleteBlog: (id) => request(`/blogs/${id}`, { method: 'DELETE' }),

  getLeads: () => request('/leads'),
  createLead: (data) => request('/leads', { method: 'POST', body: data }),
  updateLead: (id, data) => request(`/leads/${id}`, { method: 'PUT', body: data }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),

  // Portfolios
  getPortfolios: () => request('/portfolios'),
  createPortfolio: (data) => request('/portfolios', { method: 'POST', body: data }),
  updatePortfolio: (id, data) => request(`/portfolios/${id}`, { method: 'PUT', body: data }),
  deletePortfolio: (id) => request(`/portfolios/${id}`, { method: 'DELETE' }),

  // Case Studies
  getCaseStudies: () => request('/case-studies'),
  createCaseStudy: (data) => request('/case-studies', { method: 'POST', body: data }),
  updateCaseStudy: (id, data) => request(`/case-studies/${id}`, { method: 'PUT', body: data }),
  deleteCaseStudy: (id) => request(`/case-studies/${id}`, { method: 'DELETE' }),

  // Teams
  getTeams: () => request('/teams'),
  createTeam: (data) => request('/teams', { method: 'POST', body: data }),
  updateTeam: (id, data) => request(`/teams/${id}`, { method: 'PUT', body: data }),
  deleteTeam: (id) => request(`/teams/${id}`, { method: 'DELETE' }),

  // Technologies
  getTechnologies: () => request('/technologies'),
  createTechnology: (data) => request('/technologies', { method: 'POST', body: data }),
  updateTechnology: (id, data) => request(`/technologies/${id}`, { method: 'PUT', body: data }),
  deleteTechnology: (id) => request(`/technologies/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => request('/testimonials'),
  createTestimonial: (data) => request('/testimonials', { method: 'POST', body: data }),
  updateTestimonial: (id, data) => request(`/testimonials/${id}`, { method: 'PUT', body: data }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: 'DELETE' }),

  // Careers
  getCareers: () => request('/careers'),
  createCareer: (data) => request('/careers', { method: 'POST', body: data }),
  updateCareer: (id, data) => request(`/careers/${id}`, { method: 'PUT', body: data }),
  deleteCareer: (id) => request(`/careers/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: () => request('/applications'),
  createApplication: (data) => request('/applications', { method: 'POST', body: data }),
  updateApplication: (id, data) => request(`/applications/${id}`, { method: 'PUT', body: data }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),

  // Contacts (Inbox)
  getContacts: () => request('/contacts'),
  createContact: (data) => request('/contacts', { method: 'POST', body: data }),
  updateContact: (id, data) => request(`/contacts/${id}`, { method: 'PUT', body: data }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: data }),

  // File Upload
  uploadFile: (formData) => request('/upload', { method: 'POST', body: formData })
};
