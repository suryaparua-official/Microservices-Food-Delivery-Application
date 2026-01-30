"use client";

import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";
import { useCart } from "@/src/context/CartContext";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RESTAURANT_URL, ITEM_URL, api } from "@/src/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ================= CART ================= */
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((t, i) => t + i.quantity, 0);

  /* ================= AUTH ================= */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  /* ================= UI ================= */
  const [open, setOpen] = useState(false);

  /* ================= SEARCH ================= */
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] = useState<
    { type: "restaurant" | "item"; name: string }[]
  >([]);

  /* ================= Sync from URL ================= */
  useEffect(() => {
    setCity(searchParams.get("city") || "");
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  /* ================= Auth check ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setUserName(localStorage.getItem("userName") || "");
  }, [pathname]);

  /* ================= Outside click ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {
    if (pathname !== "/") return;

    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      if (query) params.set("q", query);

      router.push(params.toString() ? `/?${params}` : "/");
    }, 400);

    return () => clearTimeout(t);
  }, [city, query, pathname]);

  /* ================= SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!city || !query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const [r, i] = await Promise.all([
          api.get(`${RESTAURANT_URL}/get-by-city/${city}`),
          api.get(`${ITEM_URL}/by-city/${city}`),
        ]);

        const q = query.toLowerCase();

        const rSug = r.data
          .filter((r: any) => r.name.toLowerCase().includes(q))
          .slice(0, 4)
          .map((r: any) => ({ type: "restaurant", name: r.name }));

        const iSug = i.data
          .filter((i: any) => i.name.toLowerCase().includes(q))
          .slice(0, 4)
          .map((i: any) => ({ type: "item", name: i.name }));

        setSuggestions([...rSug, ...iSug]);
      } catch {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, city]);

  /* ================= Actions ================= */
  const handleClear = () => {
    setCity("");
    setQuery("");
    setSuggestions([]);
    router.push("/");
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await res.json();
      const detectedCity =
        data.address.city || data.address.town || data.address.state || "";
      if (detectedCity) setCity(detectedCity);
    });
  };

  const handleAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
    router.push("/login");
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LEFT */}
        <div className="nav-left">
          <Link href="/" className="brand">
            Zomato
          </Link>
        </div>

        {/* MIDDLE */}
        <div className="nav-middle">
          <Image
            onClick={handleCurrentLocation}
            src="/icons/location.png"
            alt=""
            width={18}
            height={18}
          />

          <input
            placeholder="Select your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {city && <button onClick={handleClear}>✕</button>}
          <span className="divider">|</span>
          <div className="search-wrapper">
            <input
              placeholder="Search food or restaurant"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query && <button onClick={handleClear}>✕</button>}

            {suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="search-item"
                    onClick={() => setQuery(s.name)}
                  >
                    <small>{s.type}</small> {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <Link
            href="/cart"
            className={`nav-link cart-link ${
              pathname === "/cart" ? "active" : ""
            }`}
          >
            <Image
              onClick={handleCurrentLocation}
              src="/icons/Cart.png"
              alt=""
              width={28}
              height={28}
            />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link
            href="/orders"
            className={`nav-link ${pathname === "/orders" ? "active" : ""}`}
          >
            My Orders
          </Link>

          <div className="user-wrapper" ref={dropdownRef}>
            <Image
              src="/icons/user.png"
              alt="User"
              width={30}
              height={30}
              className="user-icon"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className="user-dropdown">
                {isLoggedIn && (
                  <p className="user-name">{userName || "User"}</p>
                )}
                <button onClick={handleAction}>
                  {isLoggedIn ? "Logout" : "Login"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
