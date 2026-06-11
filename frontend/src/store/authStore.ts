import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthState = {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      /* ================= LOGIN ================= */
      login: (user, token) => {
        set({ user, token });
      },

      /* ================= LOGOUT ================= */
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",

      /* 🔥 FIX: ensure stable hydration */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),

      /* 🔥 IMPORTANT: avoid undefined state on init */
      skipHydration: false,
    }
  )
);