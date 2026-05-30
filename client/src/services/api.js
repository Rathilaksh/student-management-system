import axios from 'axios';

const api = axios.create({
  // Use process.env for Jest/node environment. Vite will serve same-origin `/api` in production/dev.
  baseURL: (typeof process !== 'undefined' && process.env.VITE_API_URL) || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const studentService = {
  stats: () => api.get('/students/stats'),
  list: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (payload) => api.post('/students', payload),
  update: (id, payload) => api.put(`/students/${id}`, payload),
  remove: (id) => api.delete(`/students/${id}`)
};

export default api;