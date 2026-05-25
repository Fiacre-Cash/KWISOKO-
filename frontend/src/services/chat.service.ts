import api from './api';

export const chatService = {
  async getChats() {
    const res = await api.get('/chats');
    return res.data;
  },

  async startChat(sellerId: string) {
    const res = await api.post(`/chats/start/${sellerId}`);
    return res.data;
  },

  async getMessages(chatId: string) {
    const res = await api.get(`/chats/${chatId}/messages`);
    return res.data;
  },

  async sendMessage(chatId: string, content: string) {
    const res = await api.post(`/chats/${chatId}/messages`, { content });
    return res.data;
  },
};
