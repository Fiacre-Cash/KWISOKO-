import api from './api';

export const productService = {
  async getAll(params?: {
    search?: string;
    categoryId?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getOne(id: string) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  async create(data: any) {
    const res = await api.post('/products', data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  async uploadImages(productId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    const res = await api.post(`/uploads/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async toggleFavorite(productId: string) {
    const res = await api.post(`/favorites/${productId}`);
    return res.data;
  },

  async getFavorites() {
    const res = await api.get('/favorites');
    return res.data;
  },
};
