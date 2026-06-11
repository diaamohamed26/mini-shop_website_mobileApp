import axios from "axios";

const BASE_URL = "http://192.168.1.10:5001/api";

export const api = axios.create({
  baseURL: BASE_URL,
});