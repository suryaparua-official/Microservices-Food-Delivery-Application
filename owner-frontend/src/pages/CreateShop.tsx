import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useOwner } from "../context/OwnerContext";
import api from "../api/axios";

export default function CreateShop({
  mode = "create",
}: {
  mode?: "create" | "edit";
}) {
  const { shop, setShop } = useOwner();

  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= Prefill for Edit ================= */
  useEffect(() => {
    if (mode === "edit" && shop) {
      setForm({
        name: shop.name || "",
        city: shop.city || "",
        state: shop.state || "",
        address: shop.address || "",
      });
    }
  }, [mode, shop]);

  /* ================= Handle Input ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= Handle Submit ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create" && !image) {
      toast.error("Restaurant image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("address", form.address);
      if (image) formData.append("image", image);

      const res = await api.post("/api/restaurant/create-edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShop(res.data);

      toast.success(
        mode === "edit"
          ? "Restaurant updated successfully"
          : "Restaurant created successfully",
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0e] p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-1">
          {mode === "edit" ? "Edit Your Restaurant" : "Create Your Restaurant"}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === "edit"
            ? "Update your restaurant information"
            : "Complete your shop details to start selling"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Restaurant Name"
            value={form.name}
            onChange={handleChange}
            className="input !bg-gray-100 !text-black !placeholder-gray-500"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="input !bg-gray-100 !text-black !placeholder-gray-500"
            required
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="input !bg-gray-100 !text-black !placeholder-gray-500"
            required
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="input !bg-gray-100 !text-black !placeholder-gray-500 h-24 resize-none"
            required
          />

          {/* Image only optional in edit */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : mode === "edit" ? (
              "Update Restaurant"
            ) : (
              "Create Restaurant"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
