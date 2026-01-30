"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ORDER_URL } from "@/src/lib/api";

type Order = {
  _id: string;
  createdAt: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  restaurantName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
};

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`${ORDER_URL}/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-lg">Loading orders...</div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex justify-center mt-20 text-lg">No orders found</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <h2 className="text-2xl font-semibold text-center">My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="bg-gray-200 p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between text-sm">
            <div>
              <p>
                <span className="font-medium">Order:</span> {order._id}
              </p>
              <p className="text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentMethod}
              </p>
              <p className="text-blue-600">Status: {order.status}</p>
            </div>
          </div>

          <hr className="border-gray-400" />

          {/* Body */}
          <div>
            <p className="font-medium mb-3">{order.restaurantName}</p>

            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-400" />

          {/* Footer */}
          <div className="flex justify-between items-center bg-gray-300 px-4 py-3">
            <span className="font-medium">Total: ₹{order.totalAmount}</span>

            <button
              onClick={() => router.push(`/orders/track?orderId=${order._id}`)}
              className="bg-rose-500 text-white px-5 py-2"
            >
              Track Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
