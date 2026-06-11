import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/ProductDetails"; // 🔥 NEW
import Profile from "../pages/user/Profile";
import Orders from "../pages/user/Orders";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";

/* ================= AUTH ================= */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ================= ADMIN ================= */
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AdminUsers from "../pages/admin/Users";

/* ================= LAYOUTS ================= */
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

/* ================= GUARDS ================= */
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

        {/* 🔥 PRODUCT DETAILS */}
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ================= USER PROTECTED ================= */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* ================= ADMIN REDIRECT ================= */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-white/60 mt-2">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}