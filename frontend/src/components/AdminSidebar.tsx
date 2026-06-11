import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { api } from "../api/axios";
import { useAuthStore } from "../store/authStore";

type Stats = {
  users: number;
  orders: number;
};

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState<Stats>({ users: 0, orders: 0 });

  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/orders"),
      ]);

      setStats({
        users: usersRes.data?.data?.length || 0,
        orders: ordersRes.data?.data?.length || 0,
      });
    } catch (err) {
      console.log("STATS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-200
     ${
       isActive
         ? "bg-white text-black shadow-md"
         : "text-white/70 hover:bg-white/10 hover:text-white"
     }`;

  return (
    <aside
      className={`h-screen flex flex-col border-r border-white/10 
      bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
      transition-all duration-300 shadow-2xl ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {open && (
          <h1 className="text-lg font-bold text-white tracking-wide">
            ⚡ Admin Panel
          </h1>
        )}

        <button
          onClick={() => setOpen((p) => !p)}
          className="p-2 rounded-xl hover:bg-white/10 transition"
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">

        {/* DASHBOARD */}
        <NavLink to="/admin" end className={linkClass}>
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} />
            {open && "Dashboard"}
          </div>
        </NavLink>

        {/* PRODUCTS */}
        <NavLink to="/admin/products" className={linkClass}>
          <div className="flex items-center gap-3">
            <Package size={20} />
            {open && "Products"}
          </div>
        </NavLink>

        {/* ORDERS */}
        <NavLink to="/admin/orders" className={linkClass}>
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} />
            {open && "Orders"}
          </div>

          {open && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              {stats.orders}
            </span>
          )}
        </NavLink>

        {/* USERS */}
        <NavLink to="/admin/users" className={linkClass}>
          <div className="flex items-center gap-3">
            <Users size={20} />
            {open && "Users"}
          </div>

          {open && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              {stats.users}
            </span>
          )}
        </NavLink>

        
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl
          text-red-400 hover:bg-red-500/10 hover:text-red-300 transition
          ${open ? "justify-start" : "justify-center"}`}
        >
          <LogOut size={20} />
          {open && "Logout"}
        </button>
      </div>
    </aside>
  );
}