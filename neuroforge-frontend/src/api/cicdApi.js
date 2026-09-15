import client from './client';

export const cicdApi = {
  getHistory: async () => {
    const response = await client.get('/cicd/history');
    return response.data;
  },

  getById: async (pipelineId) => {
    const response = await client.get(`/cicd/${pipelineId}`);
    return response.data;
  },

  triggerPipeline: async (repositoryId, branch = 'main') => {
    const response = await client.post(`/cicd/run/repository/${repositoryId}?branch=${branch}`);
    return response.data;
  },
};

export default cicdApi;
