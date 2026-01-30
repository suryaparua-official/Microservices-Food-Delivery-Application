"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* ================= Types ================= */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shopId?: string;
  ownerId?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean; // 👈 return status
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ================= Actions ================= */
  const addToCart = (item: CartItem) => {
    let added = false;

    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);

      // ❌ Already exists → DO NOTHING
      if (exist) return prev;

      // ✅ First time add
      added = true;
      return [...prev, { ...item, quantity: 1 }];
    });

    return added; // 👈 tell UI what happened
  };

  const removeFromCart = (id: string) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const increaseQty = (id: string) =>
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );

  const decreaseQty = (id: string) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i,
      ),
    );

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
