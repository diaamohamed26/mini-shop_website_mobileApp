import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  description?: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);

        setProduct(res.data.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = cart.findIndex(
      (item: any) => item.id === product.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart ✅");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <img
            src={
              product.image ||
              "https://placehold.co/600x600"
            }
            alt={product.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-400">
            Category: {product.category}
          </p>

          <p className="text-2xl text-green-400 font-bold">
            ${product.price}
          </p>

          <p className="text-sm text-gray-400">
            Stock: {product.stock}
          </p>

          <p className="text-gray-300">
            {product.description ||
              "No description available"}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() =>
                setQty((q) => Math.max(1, q - 1))
              }
              className="px-3 py-1 bg-zinc-800 rounded"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 bg-zinc-800 rounded"
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}