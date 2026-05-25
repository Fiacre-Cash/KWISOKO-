import api from './api';

export const notificationService = {
  getAll: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/notifications/unread-count');
    return data;
  },

  markRead: async () => {
    const { data } = await api.put('/notifications/mark-read');
    return data;
  },
};
