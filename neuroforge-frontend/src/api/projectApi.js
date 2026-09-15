import client from './client';

export const projectApi = {
  getAll: async () => {
    const response = await client.get('/projects');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/projects/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/projects', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await client.put(`/projects/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/projects/${id}`);
    return response.data;
  },
};

export default projectApi;
