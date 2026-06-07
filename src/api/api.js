const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Central API fetch helper
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
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
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' })
};
