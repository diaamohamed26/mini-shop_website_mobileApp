import axios from "axios";
import { getToken } from "../utils/token";

const API = axios.create({
  baseURL: "http://192.168.1.10:5001/api",
  timeout: 10000,
});

API.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    console.log("TOKEN:", token); // 🔥 debug مهم

    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;