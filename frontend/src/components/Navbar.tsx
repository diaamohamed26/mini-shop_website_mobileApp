import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const cartItems = useCartStore((s) => s.items);

  const isAdmin = user?.role === "admin";

  // cart animation
  useEffect(() => {
    const handler = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    };

    window.addEventListener("cart:add", handler);
    return () => window.removeEventListener("cart:add", handler);
  }, []);

  return (
    <nav className="bg-zinc-950 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold">
          MiniShop
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className="hover:text-white/70">
            Home
          </NavLink>

          <NavLink to="/products" className="hover:text-white/70">
            Products
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className="hover:text-white/70">
              Admin
            </NavLink>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* CART */}
          <Link to="/cart" className="relative text-xl">
            🛒
            <span
              className={`
                absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full
                transition-all duration-200
                ${flash ? "bg-green-400 scale-125" : "bg-green-500"}
              `}
            >
              {cartItems.length}
            </span>
          </Link>

          {/* PROFILE / AUTH */}
          {user ? (
            <div className="relative">

              {/* Avatar button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full"
              >
                <span className="text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-xs">▼</span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-white/10 text-sm"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-white/10 text-sm"
                  >
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-white/10 text-sm"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-500 text-sm text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-white text-black px-3 py-1 rounded"
            >
              Login
            </Link>
          )}

          {/* MOBILE MENU */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm border-t border-white/10">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
              <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}