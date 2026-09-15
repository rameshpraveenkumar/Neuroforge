import client from './client';

export const bugApi = {
  getAll: async () => {
    const response = await client.get('/bugs');
    return response.data;
  },

  getByTestCase: async (taskId, testNumber) => {
    const response = await client.get(`/bugs/test-case/task/${taskId}/test/${testNumber}`);
    return response.data;
  },

  getByDeveloper: async (developerId) => {
    const response = await client.get(`/bugs/developer/${developerId}`);
    return response.data;
  },

  getById: async (taskId, testNumber, bugNumber) => {
    const response = await client.get(`/bugs/task/${taskId}/test/${testNumber}/bug/${bugNumber}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/bugs', payload);
    return response.data;
  },

  updateStatus: async (taskId, testNumber, bugNumber, status, assignedDeveloperId) => {
    const response = await client.patch(
      `/bugs/task/${taskId}/test/${testNumber}/bug/${bugNumber}/status`,
      { status, assignedDeveloperId }
    );
    return response.data;
  },

  delete: async (taskId, testNumber, bugNumber) => {
    const response = await client.delete(`/bugs/task/${taskId}/test/${testNumber}/bug/${bugNumber}`);
    return response.data;
  },
};

export default bugApi;
