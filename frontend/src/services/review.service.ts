import api from './api';

export const reviewService = {
  create: async (dto: { productId: string; rating: number; comment?: string }) => {
    const { data } = await api.post('/reviews', dto);
    return data;
  },

  productReviews: async (productId: string) => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
  },
};
