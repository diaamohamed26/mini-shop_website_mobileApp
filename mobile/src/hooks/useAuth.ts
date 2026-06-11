import { useState } from "react";
import { loginService, registerService } from "../services/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginService(email, password);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const user = await registerService(name, email, password);
      return user;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading };
};