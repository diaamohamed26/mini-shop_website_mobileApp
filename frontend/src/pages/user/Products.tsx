import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../../store/cartStore";

type Product = {
  id: string;
  title: string; // 🔥 changed from name
  price: number;
  image: string;
  category: string;
};

export default function Products() {
  const addToCart = useCartStore((state) => state.addToCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  // ================= FETCH =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();

        const safeProducts: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(safeProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= FILTER + SORT =================
  const filtered = useMemo(() => {
    return products
      .filter((p) =>
        category === "All" ? true : p.category === category
      )
      .filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        return 0;
      });
  }, [products, search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">All Products 🛍️</h1>
        <p className="text-white/60 mt-2">
          Discover and shop premium items
        </p>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 bg-zinc-900 border border-white/10 rounded outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 bg-zinc-900 border border-white/10 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Shoes">Shoes</option>
          <option value="Tech">Tech</option>
          <option value="Accessories">Accessories</option>
          <option value="Gaming">Gaming</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 bg-zinc-900 border border-white/10 rounded"
        >
          <option value="default">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 bg-zinc-900 animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition"
            >
              {/* IMAGE */}
              <img
                src={p.image}
                alt={p.title}
                className="h-52 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-white/50">
                  {p.category}
                </p>

                <h3 className="font-bold text-lg">
                  {p.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-bold">
                    ${p.price}
                  </span>

                  <button
                    onClick={() =>
                      addToCart({
                        id: p.id,
                        name: p.title, // 🔥 map correctly for cart
                        price: p.price,
                        qty: 1,
                      })
                    }
                    className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-white/80"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}