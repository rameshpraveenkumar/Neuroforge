import client from './client';

export const auditApi = {
  getAll: async (params) => {
    const response = await client.get('/audit-logs', { params });
    return response.data;
  },
};
