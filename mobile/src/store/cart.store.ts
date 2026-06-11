import { create } from "zustand";
import API from "../api/client";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  checkout: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (item) => {
    const exists = get().items.find((i) => i.id === item.id);

    if (exists) {
      set({
        items: get().items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({
        items: [...get().items, { ...item, quantity: 1 }],
      });
    }
  },

  removeFromCart: (id) => {
    set({
      items: get().items.filter((i) => i.id !== id),
    });
  },

  clearCart: () => set({ items: [] }),

  // 🛒 CHECKOUT
  checkout: async () => {
    const items = get().items;

    if (!items.length) return;

    const total = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await API.post("/orders", {
      items,
      total,
    });

    set({ items: [] }); // clear cart after order
  },
}));