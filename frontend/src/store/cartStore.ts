import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQty: (id: string) => void;
  increaseQty: (id: string) => void;
  clearCart: () => void;

  getTotal: () => number;
  getCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /* ================= ADD ================= */
      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      /* ================= REMOVE ================= */
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      /* ================= DECREASE ================= */
      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, qty: i.qty - 1 } : i
            )
            .filter((i) => i.qty > 0),
        })),

      /* ================= INCREASE ================= */
      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      /* ================= CLEAR ================= */
      clearCart: () => set({ items: [] }),

      /* ================= TOTAL ================= */
      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        ),

      /* ================= COUNT (NEW 🔥) ================= */
      getCount: () =>
        get().items.reduce((sum, item) => sum + item.qty, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);