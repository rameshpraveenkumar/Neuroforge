import client from './client';

export const taskApi = {
  getAll: async () => {
    const response = await client.get('/tasks');
    return response.data;
  },

  getBySprint: async (sprintId) => {
    const response = await client.get(`/tasks/sprint/${sprintId}`);
    return response.data;
  },

  getByAssignee: async (userId) => {
    const response = await client.get(`/tasks/assignee/${userId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/tasks', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await client.put(`/tasks/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await client.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskApi;
