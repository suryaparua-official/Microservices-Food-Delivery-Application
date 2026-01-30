import { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useOwner } from "../context/OwnerContext";
import api from "../api/axios";

const CATEGORIES = [
  "Snacks",
  "Main Course",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "All",
];

export default function EditItemForm({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const { setShop } = useOwner();

  // 🔐 GUARD — very important
  if (!item) return null;

  const [form, setForm] = useState({
    name: item.name || "",
    category: item.category || "Snacks",
    foodType: item.foodType || "veg",
    price: item.price || "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("foodType", form.foodType);
      formData.append("price", String(form.price));
      if (image) formData.append("image", image);

      const res = await api.put(`/api/item/edit/${item._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item updated successfully");
      setShop(res.data);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Edit Item</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Item name"
          value={form.name}
          onChange={handleChange}
          className="input-light"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input-light"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          name="foodType"
          value={form.foodType}
          onChange={handleChange}
          className="input-light"
        >
          <option value="veg">Veg</option>
          <option value="non veg">Non Veg</option>
        </select>

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="input-light"
          required
        />

        <label htmlFor="edit-item-image" className="file-input">
          <span>{image ? image.name : "Change item image (optional)"}</span>

          <input
            id="edit-item-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <ClipLoader size={18} color="#fff" /> : "Update"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
