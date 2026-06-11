import { useEffect, useState } from "react";
import { api } from "../../api/axios";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/users");

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("USERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-zinc-900 p-4 rounded-xl border border-white/10"
            >
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-white/60">{user.email}</p>
              <p className="text-sm mt-1">Role: {user.role}</p>

              <button
                onClick={() => handleDelete(user.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}