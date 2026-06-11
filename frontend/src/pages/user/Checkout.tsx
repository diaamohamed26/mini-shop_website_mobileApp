import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  /* ================= TOTAL ================= */
  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    if (!address || !phone) {
      alert("Please fill all fields");
      return;
    }

    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 FIXED
        },
        body: JSON.stringify({
          items,
          total,
          address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      // success flow
      clearCart();
      navigate("/orders");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Checkout 💳
      </h1>

      {/* ORDER SUMMARY */}
      <div className="bg-zinc-900 p-5 rounded mb-6 border border-white/10">

        <h2 className="font-semibold mb-4">
          Order Summary
        </h2>

        {items.length === 0 ? (
          <p className="text-white/50">
            Your cart is empty
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-white/70"
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
        )}

        <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-green-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-4">

        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-white/10 rounded outline-none"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 bg-zinc-900 border border-white/10 rounded outline-none"
        />

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-white/80 disabled:opacity-50 transition"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}