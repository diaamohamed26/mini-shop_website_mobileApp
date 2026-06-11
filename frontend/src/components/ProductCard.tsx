import { Link } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
};

interface Props {
  product: Product;
  onAddToWishlist?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToWishlist }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);

  const handleAddToCart = () => {
    addToCart(product);

    // 🔥 simple notification (optional)
    const event = new CustomEvent("cart:add", {
      detail: product,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="group bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:shadow-lg transition">

      <div className="relative overflow-hidden">

        {onAddToWishlist && (
          <button
            onClick={() => onAddToWishlist(product)}
            className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full text-sm"
          >
            ❤️
          </button>
        )}

        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            onLoad={() => setImgLoaded(true)}
            className={`h-56 w-full object-cover transition duration-500 group-hover:scale-110 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>

        {!imgLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
      </div>

      <div className="p-4 space-y-2">

        <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">
          {product.category}
        </span>

        <h3 className="font-semibold text-white line-clamp-1">
          {product.title}
        </h3>

        <div className="flex items-center justify-between pt-2">

          <span className="text-green-400 font-bold text-lg">
            ${product.price}
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-white text-black px-3 py-1 rounded text-sm font-medium hover:bg-white/80 transition"
          >
            Add
          </button>

        </div>
      </div>
    </div>
  );
}