import { useEffect, useState } from "react";
import { api } from "../../api/axios";

type Order = {
  id: string;
  items: any[];
  total_price: number;
  status: string;
  created_at: string;
  address?: string;
  phone?: string;
  user_id?: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/orders");

      setOrders(res.data.data ?? []);
    } catch (err) {
      console.error("ORDERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ORDER ================= */
  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/admin/orders/${id}`);

      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Orders Management
      </h1>

      {loading ? (
        <p className="text-white/60">Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-white/10 p-4 rounded-xl"
            >
              {/* ================= HEADER ================= */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">
                    Order #{order.id.slice(0, 6)}
                  </p>

                  <p className="text-white/60 text-sm">
                    Phone: {order.phone || "N/A"}
                  </p>

                  <p className="text-white/60 text-sm">
                    Address: {order.address || "N/A"}
                  </p>

                  <p className="mt-2">
                    Total:{" "}
                    <span className="font-bold text-green-400">
                      ${order.total_price}
                    </span>
                  </p>

                  <p className="text-sm mt-1">
                    Items: {order.items?.length ?? 0}
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="flex flex-col gap-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="bg-zinc-800 p-2 rounded"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* ================= ITEMS PREVIEW ================= */}
              <div className="mt-4 text-sm text-white/70">
                <p className="font-semibold mb-1">Items:</p>

                <div className="space-y-1">
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-zinc-800 p-2 rounded"
                    >
                      <span>
                        {item.name || "Product"}
                      </span>
                      <span>x{item.qty || item.quantity || 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}