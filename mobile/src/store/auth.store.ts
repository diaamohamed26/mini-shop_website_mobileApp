import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

// 🌐 SAFE STORAGE (web + mobile)
const storage = {
  setItem: async (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  getItem: async (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  deleteItem: async (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  // 🔐 LOGIN
  login: async (user, token) => {
    try {
      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(user));

      set({
        user,
        token,
        hydrated: true,
      });
    } catch (err) {
      console.log("LOGIN ERROR:", err);
    }
  },

  // 🚪 LOGOUT
  logout: async () => {
    try {
      await storage.deleteItem(TOKEN_KEY);
      await storage.deleteItem(USER_KEY);

      set({
        user: null,
        token: null,
        hydrated: true,
      });
    } catch (err) {
      console.log("LOGOUT ERROR:", err);
    }
  },

  // 🔄 LOAD AUTH ON APP START
  loadAuth: async () => {
    try {
      const [token, user] = await Promise.all([
        storage.getItem(TOKEN_KEY),
        storage.getItem(USER_KEY),
      ]);

      let parsedUser: User | null = null;

      try {
        parsedUser = user ? JSON.parse(user) : null;
      } catch {
        parsedUser = null;
      }

      set({
        token,
        user: parsedUser,
        hydrated: true,
      });
    } catch (err) {
      console.log("LOAD AUTH ERROR:", err);

      set({
        token: null,
        user: null,
        hydrated: true,
      });
    }
  },
}));