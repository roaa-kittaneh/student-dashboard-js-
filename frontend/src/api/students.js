import { api } from './client';

export const studentsApi = {
  list: (params) => api.get('/students', { params }).then((r) => r.data),
  get: (id) => api.get(`/students/${id}`).then((r) => r.data),
  create: (payload) => api.post('/students', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/students/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/students/${id}`).then((r) => r.data),
  departments: () => api.get('/students/meta/departments').then((r) => r.data),
  stats: () => api.get('/students/meta/stats').then((r) => r.data),
};
