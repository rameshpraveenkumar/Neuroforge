import client from './client';

export const sprintApi = {
  getAll: async () => {
    const response = await client.get('/sprints');
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await client.get(`/sprints/project/${projectId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/sprints/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/sprints', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await client.put(`/sprints/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/sprints/${id}`);
    return response.data;
  },
};

export default sprintApi;
