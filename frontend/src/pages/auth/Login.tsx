import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { login } from "../../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await login(form);

      if (!res.success) {
        throw new Error(
          res.message || "Login failed"
        );
      }

      loginStore(res.user, res.token);

      navigate(
        res.user.role === "admin"
          ? "/admin"
          : "/"
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Login
          </h1>

          <p className="text-zinc-400 mt-1">
            Welcome back
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-white"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}