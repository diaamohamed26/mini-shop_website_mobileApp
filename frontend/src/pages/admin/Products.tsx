import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string | null;
};

/* ================= IMAGE FIX ================= */
const getImage = (img?: string | null) => {
  if (!img) return "https://placehold.co/400";
  if (img.startsWith("http")) return img;
  return `http://localhost:5001${img}`;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  /* ================= MODALS ================= */
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editing, setEditing] = useState<Product | null>(null);

  /* ================= FORM ================= */
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [cat, setCat] = useState("");
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/products");
      setProducts(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= CREATE ================= */
  const createProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", String(price));
      formData.append("category", cat);
      formData.append("stock", String(stock));

      if (image) formData.append("image", image);

      const res = await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) => [res.data.data, ...prev]);
      setOpenAdd(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UPDATE ================= */
  const updateProduct = async () => {
    if (!editing) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", String(price));
      formData.append("category", cat);
      formData.append("stock", String(stock));

      if (image) formData.append("image", image);

      const res = await api.put(
        `/admin/products/${editing.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id ? res.data.data : p
        )
      );

      setOpenEdit(false);
      setEditing(null);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id: string) => {
    const ok = window.confirm("Delete product?");
    if (!ok) return;

    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCat =
        category === "all"
          ? true
          : p.category === category;

      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  /* ================= RESET ================= */
  const resetForm = () => {
    setTitle("");
    setPrice(0);
    setCat("");
    setStock(0);
    setImage(null);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Products Admin
        </h1>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-600 px-4 py-2 rounded-xl"
        >
          + Add Product
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search..."
          className="flex-1 bg-zinc-900 p-3 rounded-xl"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="bg-zinc-900 p-3 rounded-xl"
        >
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 p-4 rounded-xl"
            >
              <img
                src={getImage(p.image)}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="mt-2 font-bold">
                {p.title}
              </h2>

              <p className="text-green-400">
                ${p.price}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setEditing(p);
                    setTitle(p.title);
                    setPrice(p.price);
                    setCat(p.category);
                    setStock(p.stock);
                    setOpenEdit(true);
                  }}
                  className="flex-1 bg-yellow-600 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(p.id)
                  }
                  className="flex-1 bg-red-600 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {openAdd && (
        <Modal
          title="Add Product"
          onClose={() => setOpenAdd(false)}
        >
          <Form
            {...{
              title,
              setTitle,
              price,
              setPrice,
              cat,
              setCat,
              stock,
              setStock,
              setImage,
              onSubmit: createProduct,
            }}
          />
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {openEdit && (
        <Modal
          title="Edit Product"
          onClose={() => setOpenEdit(false)}
        >
          <Form
            {...{
              title,
              setTitle,
              price,
              setPrice,
              cat,
              setCat,
              stock,
              setStock,
              setImage,
              onSubmit: updateProduct,
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* ================= MODAL ================= */
function Modal({
  title,
  children,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-xl w-[420px]">
        <h2 className="text-xl mb-4">
          {title}
        </h2>

        {children}

        <button
          onClick={onClose}
          className="mt-3 w-full bg-gray-600 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ================= FORM ================= */
function Form({
  title,
  setTitle,
  price,
  setPrice,
  cat,
  setCat,
  stock,
  setStock,
  setImage,
  onSubmit,
}: any) {
  return (
    <div>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="w-full p-2 mb-2 bg-zinc-800 rounded"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(Number(e.target.value))
        }
        className="w-full p-2 mb-2 bg-zinc-800 rounded"
      />

      <input
        placeholder="Category"
        value={cat}
        onChange={(e) =>
          setCat(e.target.value)
        }
        className="w-full p-2 mb-2 bg-zinc-800 rounded"
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) =>
          setStock(Number(e.target.value))
        }
        className="w-full p-2 mb-2 bg-zinc-800 rounded"
      />

      <input
        type="file"
        onChange={(e) =>
          setImage(
            e.target.files?.[0] || null
          )
        }
        className="mb-3"
      />

      <button
        onClick={onSubmit}
        className="w-full bg-blue-600 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}