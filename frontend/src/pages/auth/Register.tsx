import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!form.name || !form.email || !form.password) {
        throw new Error("All fields are required");
      }

      const res = await register(form);

      if (!res.success) {
        throw new Error(res.message || "Register failed");
      }

      // redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Register failed"
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

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-zinc-400 mt-1">
            Join us and start shopping
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-white"
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-white"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-white"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* LINK */}
        <p className="text-center text-zinc-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white hover:underline"
          >
            Login
          </Link>
        </p>
      </form>

    </div>
  );
}