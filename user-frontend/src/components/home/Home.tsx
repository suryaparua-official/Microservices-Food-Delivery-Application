"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { RESTAURANT_URL, ITEM_URL, api } from "@/src/lib/api";
import { useCart } from "@/src/context/CartContext";
import "./home.css";

/* ================= Types ================= */
type Restaurant = {
  _id: string;
  shopId: string;
  name: string;
  image: string;
  isOpen?: boolean; // realtime via socket
};

type Item = {
  _id: string;
  name: string;
  price: number;
  image: string;
  shopId: string;
  ownerId: string;
  category?: string;
  rating?: {
    average: number;
    count: number;
  };
};

const CATEGORIES = [
  "All",
  "Pizza",
  "Burgers",
  "Chinese",
  "North Indian",
  "South Indian",
  "Fast Food",
];

export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const city = searchParams.get("city");
  const search = searchParams.get("q")?.toLowerCase().trim() || "";

  const { addToCart } = useCart();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  // 🚫 Home hidden on restaurant page
  if (pathname.startsWith("/restaurant")) return null;

  /* ================= Fetch city data ================= */
  useEffect(() => {
    if (!city || city.length < 2) {
      setRestaurants([]);
      setItems([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [resRestaurants, resItems] = await Promise.all([
          api.get(`${RESTAURANT_URL}/get-by-city/${city}`),
          api.get(`${ITEM_URL}/by-city/${city}`),
        ]);

        setRestaurants(resRestaurants.data || []);
        setItems(resItems.data || []);
      } catch (err) {
        console.error("Home fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  /* ================= Category + Search filter ================= */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = search
        ? item.name.toLowerCase().includes(search)
        : true;

      const matchCategory =
        activeCategory === "All" ? true : item.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [items, search, activeCategory]);

  /* ================= Add to cart ================= */
  const handleAddToCart = (item: Item) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      shopId: item.shopId,
      ownerId: item.ownerId,
      quantity: 1,
    });

    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= No city ================= */
  if (!city) {
    return (
      <div className="home-container">
        <div className="empty-city">
          <h2 className="empty-title">Enter your delivery location</h2>
          <p className="empty-subtitle">
            Please enter your city or choose your current location.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="home-container">Loading…</div>;
  }

  return (
    <div className="home-container">
      {/* ================= Restaurants ================= */}
      {restaurants.length > 0 && (
        <section className="section">
          <h2 className="section-title">Restaurants in {city}</h2>

          <div className="grid-restaurants">
            {restaurants.map((r) => (
              <Link
                key={r._id}
                href={`/restaurant/${r.shopId || r._id}`}
                className="restaurant-card"
              >
                <img src={r.image} alt={r.name} />
                <div className="restaurant-footer">
                  <p className="restaurant-name">{r.name}</p>
                  <span className={`status ${r.isOpen ? "open" : "closed"}`}>
                    {r.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= Category Filter ================= */}
      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= Dishes ================= */}
      {filteredItems.length > 0 && (
        <section className="section">
          <h2 className="section-title">Recommended Dishes</h2>

          <div className="grid-items">
            {filteredItems.map((item) => (
              <div key={item._id} className="item-card">
                <img src={item.image} alt={item.name} />

                <p className="item-name">{item.name}</p>

                <div className="item-rating">
                  ⭐ {item.rating?.average?.toFixed(1) || "0.0"}
                  <span>({item.rating?.count || 0})</span>
                </div>

                <p className="item-price">₹ {item.price}</p>

                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
