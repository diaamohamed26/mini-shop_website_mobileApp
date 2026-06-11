import { useMemo } from "react";
import { useCartStore } from "../../store/cartStore";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, addToCart, removeFromCart, clearCart } =
    useCartStore();

  /* ================= TOTAL ================= */
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [items]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Your Cart 🛒
        </h1>

        <p className="text-white/60 mt-2">
          Review your selected items before checkout
        </p>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="text-center text-white/60 mt-20">
          <p className="text-lg">Your cart is empty</p>

          <Link
            to="/products"
            className="inline-block mt-5 bg-white text-black px-5 py-3 rounded font-bold"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= ITEMS ================= */}
          <div className="md:col-span-2 space-y-4">

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-zinc-900 border border-white/10 p-4 rounded-xl hover:bg-zinc-800 transition"
              >

                {/* INFO */}
                <div>
                  <h3 className="font-bold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-white/60 text-sm mt-1">
                    ${item.price} × {item.qty}
                  </p>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        qty: 1,
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-white text-black rounded"
                  >
                    +
                  </button>

                  <span className="min-w-[20px] text-center">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded"
                  >
                    -
                  </button>

                </div>
              </div>
            ))}

            {/* CLEAR CART */}
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 mt-2 text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl h-fit">

            <h2 className="text-xl font-bold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-white/70 text-sm max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <span>
                    ${item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t border-white/10 mt-5 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-green-400">
                ${total}
              </span>
            </div>

            {/* CHECKOUT */}
            <Link
              to="/checkout"
              className="block mt-5 text-center bg-white text-black py-3 rounded font-bold hover:bg-white/80 transition"
            >
              Checkout
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}