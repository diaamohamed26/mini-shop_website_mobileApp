import API from "./client";

export const loginApi = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", data);
};