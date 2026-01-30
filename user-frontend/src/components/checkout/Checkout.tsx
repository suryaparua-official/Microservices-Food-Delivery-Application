"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { api, ORDER_URL, USER_URL } from "@/src/lib/api";
import { createPayment, verifyPayment } from "@/src/lib/payment";

export default function Checkout() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const [location, setLocation] = useState({
    text: "",
    latitude: 0,
    longitude: 0,
  });

  const [loading, setLoading] = useState(false);

  /* ================= Get User Location ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`${USER_URL}/current`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data?.location) {
          setLocation(res.data.location);
        }
      } catch {
        console.error("Failed to fetch user location");
      }
    };

    fetchUser();
  }, []);

  /* ================= Place Order ================= */
  const handlePlaceOrder = async () => {
    if (!cart.length) return;

    if (!location.text) {
      alert("Delivery location is required");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Place order
      const orderRes = await api.post(
        `${ORDER_URL}/place-order`,
        {
          cartItems: cart,
          paymentMethod,
          deliveryAddress: location,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const { orderId } = orderRes.data;

      // 2️⃣ COD flow
      if (paymentMethod === "cod") {
        clearCart();
        router.push("/orders");
        return;
      }

      // 3️⃣ ONLINE flow
      const payment = await createPayment(orderId, totalAmount);

      /**
       * 🔴 Real gateway will open here
       * For now we simulate success
       */
      const fakePaymentId = "PAY_" + Date.now();

      await verifyPayment({
        orderId,
        paymentId: fakePaymentId,
      });

      clearCart();
      router.push("/orders");
    } catch (err) {
      console.error("Order / Payment failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <h2 className="text-2xl font-semibold text-center">Checkout</h2>

      {/* Location */}
      <div>
        <p className="font-medium mb-2">📍 Delivery Location</p>
        <input
          value={location.text}
          readOnly
          className="w-full bg-gray-200 p-3"
        />
      </div>

      {/* Payment */}
      <div>
        <p className="font-medium mb-3">Payment Method</p>
        <div className="flex gap-4">
          {["cod", "online"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method as "cod" | "online")}
              className={`flex-1 p-4 border ${
                paymentMethod === method
                  ? "border-rose-500 bg-rose-50"
                  : "bg-gray-200"
              }`}
            >
              {method === "cod" ? "Cash on Delivery" : "Online Payment"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-200 p-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !cart.length}
          className="bg-rose-500 text-white px-8 py-3"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
