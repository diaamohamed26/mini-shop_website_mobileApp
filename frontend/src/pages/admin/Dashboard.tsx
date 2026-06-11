import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { api } from "../../api/axios";

type Stats = {
  users: number;
  orders: number;
  revenue: number;
  products: number;
};

type ApiResponse = {
  success: boolean;
  data: Stats;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await api.get<ApiResponse>("/admin/dashboard");

        setStats(res.data.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  /* ================= MOCK CHART DATA ================= */
  const revenueData = [
    { name: "Users", value: stats.users },
    { name: "Orders", value: stats.orders },
    { name: "Products", value: stats.products },
  ];

  const orderData = [
    { name: "Pending", value: 30 },
    { name: "Shipped", value: 50 },
    { name: "Delivered", value: 80 },
  ];

  const COLORS = ["#6366f1", "#22c55e", "#f97316"];

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <span className="text-sm text-gray-400">
          Overview & Analytics
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Users" value={stats.users} />
        <Card title="Orders" value={stats.orders} />
        <Card title="Revenue" value={`$${stats.revenue}`} />
        <Card title="Products" value={stats.products} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LINE CHART */}
        <div className="bg-zinc-900 p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">
            System Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-zinc-900 p-5 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">
            Orders Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {orderData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* ================= CARD ================= */
function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl hover:bg-zinc-800 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}