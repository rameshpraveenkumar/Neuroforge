import client from './client';

export const analyticsApi = {
  getOverview: async () => {
    const response = await client.get('/analytics/overview');
    return response.data;
  },

  getDoraMetrics: async () => {
    const response = await client.get('/analytics/dora');
    return response.data;
  },
};

export default analyticsApi;
