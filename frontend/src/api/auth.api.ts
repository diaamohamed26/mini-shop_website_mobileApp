import { api } from "./axios";

/* ================= TYPES ================= */
export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token: string;
  user: AuthUser;
};

/* ================= LOGIN ================= */
export const login = async (data: LoginDTO): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);

  const result: AuthResponse = res.data;

  // 🔥 IMPORTANT: save token
  if (result?.token) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
};

/* ================= REGISTER ================= */
export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);

  const result: AuthResponse = res.data;

  // 🔥 optional auto-login after register
  if (result?.token) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
};

/* ================= ME ================= */
export const getMe = async (): Promise<AuthResponse> => {
  const res = await api.get("/auth/me");
  return res.data;
};

/* ================= LOGOUT (NEW) ================= */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};