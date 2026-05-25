import api from './api';

export const orderService = {
  create: async (items: { productId: string; quantity: number }[]) => {
    const { data } = await api.post('/orders', { items });
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get('/orders');
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  getSellerOrders: async () => {
    const { data } = await api.get('/orders/seller');
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
};
