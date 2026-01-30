import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

type OrderStatus = "pending" | "preparing" | "out of delivery" | "delivered";

interface ShopOrder {
  _id: string;
  subtotal: number;
  status: OrderStatus;
  shopOrderItems: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}

export default function OwnerOrders() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ================= Fetch Orders ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/order/owner");
        setOrders(res.data || []);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= Update Status ================= */
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/api/order/update-status/${orderId}`, { status });

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0e]">
        <ClipLoader color="#fff" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Orders</h1>

          <Link
            to="/dashboard"
            className="text-sm px-4 py-2 rounded-lg
                       bg-white/10 hover:bg-white/20
                       border border-white/20 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <p className="text-white/60 text-center">No orders yet</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/5 border border-white/10
                           rounded-2xl p-6"
              >
                {/* Top */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-white/60">Order ID</p>
                    <p className="text-sm font-mono">{order._id}</p>
                  </div>

                  <p className="text-sm text-white/60">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-2">
                  {order.shopOrderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹ {item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹ {order.subtotal}</span>
                </div>

                {/* Status Stepper */}
                <div className="mt-6">
                  <OrderStatusStepper
                    status={order.status}
                    disabled={updatingId === order._id}
                    onChange={(s) => updateStatus(order._id, s)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Status Stepper ================= */

function OrderStatusStepper({
  status,
  onChange,
  disabled,
}: {
  status: OrderStatus;
  onChange: (s: OrderStatus) => void;
  disabled?: boolean;
}) {
  const steps: OrderStatus[] = [
    "pending",
    "preparing",
    "out of delivery",
    "delivered",
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {steps.map((step) => {
        const active = step === status;
        return (
          <button
            key={step}
            disabled={disabled || active}
            onClick={() => onChange(step)}
            className={`px-3 py-1 rounded-full text-xs font-medium
              ${
                active
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }
              disabled:opacity-50`}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
}
