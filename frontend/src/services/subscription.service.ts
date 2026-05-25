import api from './api';

export const subscriptionService = {
  subscribe: async (plan: string) => {
    const { data } = await api.post('/subscriptions', { plan });
    return data;
  },

  mySubscriptions: async () => {
    const { data } = await api.get('/subscriptions/my');
    return data;
  },

  activeSubscription: async () => {
    const { data } = await api.get('/subscriptions/active');
    return data;
  },
};
