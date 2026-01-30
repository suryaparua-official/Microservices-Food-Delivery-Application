import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { ClipLoader } from "react-spinners";
import { useOwner } from "../context/OwnerContext";
import EditItemForm from "../components/EditItemForm";
import { Link } from "react-router-dom";

export default function MyShop() {
  const { shop, setShop } = useOwner();

  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!shop) {
    return <div className="p-8 text-center text-gray-400">Shop not found</div>;
  }

  /* ================= Delete Item ================= */
  const handleDelete = async (itemId: string) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    try {
      setDeletingId(itemId);

      const res = await api.delete(`/api/item/delete/${itemId}`);

      toast.success("Item deleted successfully");
      setShop(res.data);
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      {/* ================= Restaurant Info ================= */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-40 h-40 rounded-xl object-cover shadow-md"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">
              {shop.name}
            </h2>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {shop.address}, {shop.city}, {shop.state}
            </p>

            <span className="inline-block mt-4 px-4 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
              Active Restaurant
            </span>
          </div>
        </div>
      </div>

      {/* ================= Items ================= */}
      <h3 className="text-xl font-semibold text-white mb-5">Items</h3>

      {shop.items.length === 0 ? (
        <p className="text-gray-400">No items added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shop.items.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* Item Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-44 object-cover"
              />

              {/* Item Details */}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h4>

                <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                  {item.category} • {item.foodType}
                </p>

                <p className="mt-2 text-base font-semibold text-emerald-600">
                  ₹ {item.price}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
                  >
                    {deletingId === item._id ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= Edit Item Modal ================= */}
      {editingItem && (
        <EditItemForm item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
