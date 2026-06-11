import { useEffect, useMemo, useState } from "react";
import { getOrders } from "../../api/order.api";
import { useAuthStore } from "../../store/authStore";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: OrderItem[];
  total_price: number;
  created_at: string;
};

export default function Orders() {
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          setError("Please login to view your orders");
          setLoading(false);
          return;
        }

        const res = await getOrders();

        // 🔥 backend returns: { success, data }
        setOrders(res?.data ?? []);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load orders";

        if (err?.response?.status === 401) {
          setError("Unauthorized - please login again");
        } else {
          setError(message);
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ================= SORT ================= */
  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [orders]);

  /* ================= STATUS STYLE ================= */
  const statusStyle = (status: Order["status"]) => {
    const base =
      "text-xs px-3 py-1 rounded-full capitalize border";

    switch (status) {
      case "pending":
        return `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/30`;
      case "processing":
        return `${base} bg-blue-500/10 text-blue-400 border-blue-500/30`;
      case "shipped":
        return `${base} bg-purple-500/10 text-purple-400 border-purple-500/30`;
      case "delivered":
        return `${base} bg-green-500/10 text-green-400 border-green-500/30`;
      default:
        return `${base} bg-white/10 text-white border-white/10`;
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-10">
        My Orders
      </h1>

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-400 mb-6">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-zinc-900 animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && sortedOrders.length === 0 && (
        <div className="text-center text-white/50 py-20">
          No orders found 🛒
        </div>
      )}

      {/* ORDERS */}
      <div className="space-y-6">
        {!loading &&
          !error &&
          sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold">
                    Order #{order.id}
                  </h2>

                  <p className="text-white/40 text-sm">
                    {new Date(order.created_at).toDateString()}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <span className={statusStyle(order.status)}>
                    {order.status}
                  </span>

                  <div className="text-green-400 font-bold">
                    ${Number(order.total_price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-4 border-t border-white/10 pt-3 space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm text-white/60"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>

                    <span>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}