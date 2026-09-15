import client from './client';

export const aiApi = {
  getAssistants: async () => {
    const response = await client.get('/ai/assistants');
    return response.data;
  },

  getSuggestionsByAssistant: async (aiId) => {
    const response = await client.get(`/ai/suggestions/assistant/${aiId}`);
    return response.data;
  },

  generate: async (payload) => {
    const response = await client.post('/ai/generate', payload);
    return response.data;
  },
};

export default aiApi;
