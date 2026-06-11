import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const API = axios.create({
  baseURL: "http://localhost:5001/api/orders",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= TOKEN ================= */
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= GET ORDERS ================= */
export const getOrders = async () => {
  const res = await API.get("/");
  return res.data;
};