import api from './api';

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  create: async (name: string) => {
    const { data } = await api.post('/categories', { name });
    return data;
  },

  update: async (id: string, name: string) => {
    const { data } = await api.put(`/categories/${id}`, { name });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};
