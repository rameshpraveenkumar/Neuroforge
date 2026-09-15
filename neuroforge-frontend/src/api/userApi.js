import client from './client';

export const userApi = {
  getAll: async () => {
    const response = await client.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await client.put(`/users/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await client.delete(`/users/${id}`);
    return response.data;
  },
};

export default userApi;
