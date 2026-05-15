import { api } from './client';

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: ({ name, email, password }) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
};
