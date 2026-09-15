import client from './client';

export const requirementApi = {
  getAll: async () => {
    const response = await client.get('/requirements');
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await client.get(`/requirements/project/${projectId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/requirements/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/requirements', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await client.put(`/requirements/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/requirements/${id}`);
    return response.data;
  },
};

export default requirementApi;
