import client from './client';

export const testCaseApi = {
  getAll: async () => {
    const response = await client.get('/test-cases');
    return response.data;
  },

  getByTask: async (taskId) => {
    const response = await client.get(`/test-cases/task/${taskId}`);
    return response.data;
  },

  getById: async (taskId, testNumber) => {
    const response = await client.get(`/test-cases/task/${taskId}/test/${testNumber}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/test-cases', payload);
    return response.data;
  },

  update: async (taskId, testNumber, payload) => {
    const response = await client.put(`/test-cases/task/${taskId}/test/${testNumber}`, payload);
    return response.data;
  },

  delete: async (taskId, testNumber) => {
    const response = await client.delete(`/test-cases/task/${taskId}/test/${testNumber}`);
    return response.data;
  },
};

export default testCaseApi;
