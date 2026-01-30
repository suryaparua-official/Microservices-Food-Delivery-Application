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

export default function AddItemForm() {
  const { setShop } = useOwner();

  const [form, setForm] = useState({
    name: "",
    category: "Snacks",
    foodType: "veg",
    price: "",
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

    if (!image) {
      toast.error("Item image is required");
      return;
    }

    if (!form.name || !form.price) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("foodType", form.foodType);
      formData.append("price", form.price);
      formData.append("image", image);

      const res = await api.post("/api/item/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item added successfully");
      setShop(res.data); // ✅ এখন res আছে

      setForm({
        name: "",
        category: "Snacks",
        foodType: "veg",
        price: "",
      });
      setImage(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-xl font-semibold mb-1">Add New Item</h3>
      <p className="text-sm text-gray-500 mb-4">
        Add food items to your restaurant menu
      </p>

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
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input-light"
          min={0}
          required
        />
        <label htmlFor="add-item-image" className="file-input">
          <span>{image ? image.name : "Choose item image"}</span>

          <input
            id="add-item-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            className="hidden"
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Add Item"}
        </button>
      </form>
    </div>
  );
}
