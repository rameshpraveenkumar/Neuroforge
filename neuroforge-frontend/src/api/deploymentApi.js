import client from './client';

export const deploymentApi = {
  getAll: async () => {
    const response = await client.get('/deployments');
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await client.get(`/deployments/project/${projectId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/deployments/${id}`);
    return response.data;
  },

  trigger: async (payload) => {
    const response = await client.post('/deployments', payload);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await client.patch(`/deployments/${id}/status?status=${status}`);
    return response.data;
  },
};

export default deploymentApi;
