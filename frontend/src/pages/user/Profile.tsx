import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { Edit3, Save, LogOut } from "lucide-react";

export default function Profile() {
  const { token, user, login, logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.user;

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        email: data.email || "",
      });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout(); // 🔥 auto logout if token invalid
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:5001/api/auth/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data.user;

      // 🔥 update global state (important)
      login(updatedUser, token!);

      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-12 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg"
        >
          <Edit3 size={16} />
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* CARD */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">

        {/* NAME */}
        <div>
          <p className="text-white/50 text-sm">Name</p>
          {editing ? (
            <input
              className="w-full p-3 bg-zinc-800 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          ) : (
            <p>{form.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-white/50 text-sm">Email</p>
          {editing ? (
            <input
              className="w-full p-3 bg-zinc-800 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          ) : (
            <p>{form.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <p className="text-white/50 text-sm">Phone</p>
          {editing ? (
            <input
              className="w-full p-3 bg-zinc-800 rounded"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          ) : (
            <p>{form.phone || "Not set"}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <p className="text-white/50 text-sm">Address</p>
          {editing ? (
            <input
              className="w-full p-3 bg-zinc-800 rounded"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          ) : (
            <p>{form.address || "Not set"}</p>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-6">

        {editing && (
          <button
            onClick={updateProfile}
            disabled={saving}
            className="flex-1 bg-green-500 text-black font-bold py-3 rounded-lg"
          >
            <Save size={16} className="inline mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex-1 bg-red-600 py-3 rounded-lg"
        >
          <LogOut size={16} className="inline mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}