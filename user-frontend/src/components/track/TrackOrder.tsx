"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ORDER_URL } from "@/src/lib/api";
import { getSocket } from "@/src/lib/socket";

type Order = {
  _id: string;
  restaurantName: string;
  deliveryAddress: {
    text: string;
  };
  deliveryBoy?: {
    name: string;
    phone: string;
  };
};

export default function TrackOrder() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /* ================= Fetch Order ================= */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`${ORDER_URL}/get-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrder(res.data);
      } catch {
        console.error("Order fetch failed");
      }
    };

    fetchOrder();
  }, [orderId]);

  /* ================= Socket Tracking ================= */
  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();

    socket.emit("joinOrderRoom", orderId);

    socket.on("deliveryLocationUpdate", (data) => {
      if (data.orderId === orderId) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    return () => {
      socket.off("deliveryLocationUpdate");
    };
  }, [orderId]);

  if (!order) {
    return <div className="flex justify-center mt-20">Loading order...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <h2 className="text-2xl font-semibold text-center">Track Your Order</h2>

      {/* Order Info */}
      <div className="space-y-2 text-sm">
        <p className="font-medium text-rose-500">{order.restaurantName}</p>
        <p>Delivery Address: {order.deliveryAddress.text}</p>
      </div>

      {/* Delivery Boy */}
      {order.deliveryBoy && (
        <div className="text-sm space-y-1">
          <p className="font-medium text-rose-500">Delivery Partner</p>
          <p>{order.deliveryBoy.name}</p>
          <p>{order.deliveryBoy.phone}</p>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="w-full h-[360px] bg-gray-200 flex items-center justify-center">
        {location ? (
          <div className="text-center text-sm">
            <p>📍 Live Location</p>
            <p>Lat: {location.latitude}</p>
            <p>Lng: {location.longitude}</p>
          </div>
        ) : (
          <p className="text-gray-600">Waiting for live location...</p>
        )}
      </div>
    </div>
  );
}
