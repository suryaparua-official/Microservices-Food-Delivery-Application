import { Link } from "react-router-dom";
import { useOwner } from "../context/OwnerContext";
import CreateShop from "./CreateShop";
import MyShop from "./MyShop";
import AddItemForm from "../components/AddItemForm";
import api from "../api/axios";

export default function Dashboard() {
  const { shop, loading } = useOwner();

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0e]">
        <p className="text-sm text-white/70 tracking-wide">
          Loading dashboard...
        </p>
      </div>
    );
  }

  /* ================= No Shop ================= */
  if (!shop) {
    return <CreateShop />;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      {/* ================= RESTAURANT HERO ================= */}
      <div className="relative w-full h-[360px]">
        {/* Background Image */}
        <img
          src={shop.image}
          alt={shop.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-between py-6">
          {/* Top Actions */}
          <div className="flex justify-end gap-3">
            <Link
              to="/edit-restaurant"
              className="px-4 py-2 rounded-lg
                         bg-white/10 hover:bg-white/20
                         border border-white/20
                         text-sm backdrop-blur-md transition"
            >
              Edit Restaurant
            </Link>

            <Link
              to="/orders"
              className="px-4 py-2 rounded-lg
                         bg-rose-500 hover:bg-rose-600
                         text-white text-sm font-medium
                         shadow-lg shadow-rose-500/30 transition"
            >
              View Orders
            </Link>

            <button
              onClick={async () => {
                try {
                  await api.post("/api/auth/signout");
                } finally {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }
              }}
              className="px-4 py-2 rounded-lg
                         bg-white/10 hover:bg-white/20
                         border border-white/20
                         text-sm backdrop-blur-md transition"
            >
              Logout
            </button>
          </div>

          {/* Restaurant Info */}
          <div>
            <h1 className="text-3xl font-semibold tracking-wide">
              {shop.name}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {shop.address}, {shop.city}, {shop.state}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-14">
        {/* -------- Add Item -------- */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Add Menu Item</h2>
          <p className="text-sm text-white/60 mb-6">
            Create food items visible to customers
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <AddItemForm />
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* -------- My Shop -------- */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Restaurant Items</h2>
          <p className="text-sm text-white/60 mb-6">
            Manage items, pricing and images
          </p>

          <MyShop />
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-6 text-center">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Owner Panel
        </p>
      </footer>
    </div>
  );
}
