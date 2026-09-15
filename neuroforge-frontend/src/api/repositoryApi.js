import client from './client';

export const repositoryApi = {
  getAll: async () => {
    const response = await client.get('/repositories');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/repositories/${id}`);
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await client.get(`/repositories/project/${projectId}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await client.post('/repositories', payload);
    return response.data;
  },

  addCollaborator: async (repositoryId, userId) => {
    const response = await client.post(`/repositories/${repositoryId}/collaborators/${userId}`);
    return response.data;
  },

  getCommits: async (repositoryId) => {
    const response = await client.get(`/commits/repository/${repositoryId}`);
    return response.data;
  },

  recordCommit: async (payload) => {
    const response = await client.post('/commits', payload);
    return response.data;
  },
};

export default repositoryApi;
