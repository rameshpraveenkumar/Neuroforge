import client from './client';

export const authApi = {
  login: async (usernameOrEmail, password) => {
    const response = await client.post('/auth/login', { usernameOrEmail, password });
    return response.data;
  },

  register: async (payload) => {
    const response = await client.post('/auth/register', payload);
    return response.data;
  },

  demoSwitch: async (role) => {
    const response = await client.post(`/auth/demo-switch?role=${role}`);
    return response.data;
  },

  getDemoPersonas: async () => {
    const response = await client.get('/auth/demo-personas');
    return response.data;
  },

  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },
};
