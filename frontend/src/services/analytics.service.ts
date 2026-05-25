import api from './api';

export const analyticsService = {
  getAdminStats: async () => {
    const { data } = await api.get('/analytics/admin');
    return data;
  },

  getSellerStats: async () => {
    const { data } = await api.get('/analytics/seller');
    return data;
  },
};
