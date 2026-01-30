"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, ITEM_URL } from "@/src/lib/api";
import { useCart } from "@/src/context/CartContext";
import "./RestaurantMenu.css";
import Image from "next/image";

type Restaurant = {
  _id: string;
  name: string;
  image: string;
  address: string;
  city: string;
  isOpen?: boolean;
};

type Item = {
  _id: string;
  name: string;
  price: number;
  image: string;
  shop: string;
  owner: string;
  rating?: {
    average: number;
    count: number;
  };
};

export default function RestaurantMenu() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, cartItems } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await api.get(`${ITEM_URL}/by-shop/${id}`);
        setRestaurant(res.data.shop);
        setItems(res.data.items || []);
      } catch {
        setError("Restaurant not found");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleAddToCart = (item: Item) => {
    const exists = cartItems.find((c) => c.id === item._id);

    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      shopId: item.shop,
      ownerId: item.owner,
      quantity: 1,
    });

    setToast(exists ? "Item quantity updated" : "Item added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  if (loading) return <div className="rm-loading">Loading restaurant…</div>;
  if (error || !restaurant)
    return <div className="rm-error">Restaurant not found</div>;

  return (
    <div className="rm-container">
      <div className="rm-header">
        <img src={restaurant.image} className="rm-banner" />

        <div className="rm-info">
          <h1 className="rm-title">{restaurant.name}</h1>
          <span
            className={`rm-status ${restaurant.isOpen ? "open" : "closed"}`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
          <p className="rm-address">
            <Image src="/icons/location.png" alt="" width={16} height={16} />
            {restaurant.address}, {restaurant.city}
          </p>
        </div>
      </div>

      <h2 className="rm-menu-title">Menu</h2>

      <div className="rm-grid">
        {items.map((item) => (
          <div key={item._id} className="rm-card">
            <img src={item.image} className="rm-item-image" />
            <div className="rm-card-body">
              <p className="rm-item-name">{item.name}</p>

              <div className="rm-item-rating">
                ⭐ {item.rating?.average?.toFixed(1) || "0.0"}
                <span> ({item.rating?.count || 0})</span>
              </div>

              <div className="rm-card-footer">
                <span className="rm-item-price">₹ {item.price}</span>
                <button
                  className="rm-add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
