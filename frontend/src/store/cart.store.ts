import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  productId: string;
  title: string;
  priceRwf: number;
  imageUrl?: string;
  quantity: number;
  sellerName: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalRwf: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({ items: get().items.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) =>
        set({ items: get().items.map((i) => i.productId === productId ? { ...i, quantity } : i) }),

      clearCart: () => set({ items: [] }),

      totalRwf: () => get().items.reduce((sum, i) => sum + i.priceRwf * i.quantity, 0),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'kwisoko-cart' },
  ),
);
