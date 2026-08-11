const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('urlpulse_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('urlpulse_token', token);
  else localStorage.removeItem('urlpulse_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method: 'POST', body, auth: false }),
  login: (body) => request('/auth/login', { method: 'POST', body, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),
  resetPassword: (token, newPassword) =>
    request('/auth/reset-password', { method: 'POST', body: { token, newPassword }, auth: false }),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token }, auth: false }),
  resendVerification: () => request('/auth/resend-verification', { method: 'POST' }),
  deleteMe: () => request('/auth/me', { method: 'DELETE' }),

  // url jobs
  listJobs: () => request('/urls'),
  getJob: (id) => request(`/urls/${id}`),
  createJob: (body) => request('/urls', { method: 'POST', body }),
  updateJob: (id, body) => request(`/urls/${id}`, { method: 'PUT', body }),
  deleteJob: (id) => request(`/urls/${id}`, { method: 'DELETE' }),
  toggleJob: (id) => request(`/urls/${id}/toggle`, { method: 'PATCH' }),
  getJobLogs: (id, limit = 50) => request(`/urls/${id}/logs?limit=${limit}`),

  // admin
  adminStats: () => request('/admin/stats'),
  adminListUsers: () => request('/admin/users'),
  adminGetUser: (id) => request(`/admin/users/${id}`),
  adminSetPlan: (id, plan) => request(`/admin/users/${id}/plan`, { method: 'PATCH', body: { plan } }),
  adminSetRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
  adminDeactivate: (id) => request(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),
  adminReactivate: (id) => request(`/admin/users/${id}/reactivate`, { method: 'PATCH' }),
  adminDeleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  adminListJobs: () => request('/admin/jobs'),
  adminToggleJob: (id) => request(`/admin/jobs/${id}/toggle`, { method: 'PATCH' }),

  submitContactMessage: (body) => request('/contact', { method: 'POST', body }),
  adminListContactMessages: (status) => request(`/admin/contact-messages${status ? `?status=${status}` : ''}`),
  adminUpdateContactMessageStatus: (id, status) =>
    request(`/admin/contact-messages/${id}/status`, { method: 'PATCH', body: { status } }),
  adminDeleteContactMessage: (id) => request(`/admin/contact-messages/${id}`, { method: 'DELETE' }),
};
