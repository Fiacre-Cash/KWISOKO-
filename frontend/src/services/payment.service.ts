import api from './api';

export const paymentService = {
  initiate: async (orderId: string, method: 'MOMO' | 'CARD' | 'CASH', momoPhone?: string) => {
    const { data } = await api.post(`/payments/initiate/${orderId}`, { method, momoPhone });
    return data;
  },

  getStatus: async (orderId: string) => {
    const { data } = await api.get(`/payments/status/${orderId}`);
    return data;
  },
};
