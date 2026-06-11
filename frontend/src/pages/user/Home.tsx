import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
};

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedMsg, setAddedMsg] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          "http://localhost:5001/api/products"
        );

        const data = res.data;

        const safeProducts: Product[] =
          Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data)
            ? data
            : [];

        setProducts(safeProducts);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load products"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      qty: 1,
    });

    setAddedMsg(`${product.title} added to cart 🛒`);

    setTimeout(() => {
      setAddedMsg("");
    }, 2000);
  };

  return (
    <div className="w-full bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold">
            Discover Your
            <span className="block text-yellow-400">
              Perfect Style
            </span>
          </h1>

          <p className="text-white/70 mt-4">
            Premium fashion, electronics and accessories.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/products"
              className="bg-white text-black px-8 py-4 rounded-lg font-bold"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="border border-white px-8 py-4 rounded-lg"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* CART FEEDBACK MESSAGE */}
      {addedMsg && (
        <div className="fixed top-20 right-5 bg-green-500 text-black px-4 py-2 rounded-lg shadow-lg z-50">
          {addedMsg}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-400 py-4">
          {error}
        </div>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 py-20">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>

          {/* CART HINT */}
          {cartItems.length > 0 && (
            <div className="text-yellow-400 text-sm">
              🛒 {cartItems.length} items in cart
            </div>
          )}

          <Link
            to="/products"
            className="text-white/60 hover:text-white"
          >
            View All →
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 bg-zinc-900 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-white text-black py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready To Start Shopping?
        </h2>

        <Link
          to="/products"
          className="bg-black text-white px-8 py-4 rounded-lg"
        >
          Explore Products
        </Link>
      </section>
    </div>
  );
}