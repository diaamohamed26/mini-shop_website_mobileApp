const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg">
            Mini Shop 🛒
          </h2>

          <p className="text-white/50 text-sm mt-1">
            Built with React + Node + Supabase
          </p>
        </div>

        {/* LINKS */}
        <div className="flex gap-6 text-sm text-white/60">
          <a href="/" className="hover:text-white">
            Home
          </a>

          <a href="/products" className="hover:text-white">
            Products
          </a>

          <a href="/cart" className="hover:text-white">
            Cart
          </a>

          <a href="/orders" className="hover:text-white">
            Orders
          </a>
        </div>

        {/* RIGHT */}
        <div className="text-sm text-white/40">
          © {new Date().getFullYear()} Mini Shop. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;