import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderStatusStepper from "../components/OrderStatusStepper";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/order/owner");
        setOrders(res.data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-300">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-400">
                    Customer: {order.customerName}
                  </p>
                </div>

                <p className="font-semibold text-emerald-400">
                  ₹ {order.total}
                </p>
              </div>

              <OrderStatusStepper status={order.status} orderId={order._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
