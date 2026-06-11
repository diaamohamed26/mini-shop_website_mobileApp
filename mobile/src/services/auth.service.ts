import { loginApi, registerApi } from "../api/auth.api";
import { saveToken, deleteToken } from "../utils/token";

export const loginService = async (email: string, password: string) => {
  const res = await loginApi({ email, password });

  const token = res?.data?.token;

  if (!token) {
    throw new Error("No token received from backend");
  }

  await saveToken(token);

  return res.data.user;
};

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await registerApi({ name, email, password });

  const token = res?.data?.token;

  if (!token) {
    throw new Error("No token received from backend");
  }

  await saveToken(token);

  return res.data.user;
};

export const logoutService = async () => {
  await deleteToken();
};