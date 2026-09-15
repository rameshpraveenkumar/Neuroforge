import client from './client';

export const documentationApi = {
  getAll: async () => {
    const response = await client.get('/documentation');
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await client.get(`/documentation/project/${projectId}`);
    return response.data;
  },

  getByVersion: async (projectId, version) => {
    const response = await client.get(`/documentation/project/${projectId}/version/${version}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/documentation', payload);
    return response.data;
  },

  update: async (projectId, version, payload) => {
    const response = await client.put(`/documentation/project/${projectId}/version/${version}`, payload);
    return response.data;
  },

  delete: async (projectId, version) => {
    const response = await client.delete(`/documentation/project/${projectId}/version/${version}`);
    return response.data;
  },
};

export default documentationApi;
