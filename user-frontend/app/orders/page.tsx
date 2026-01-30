import MyOrders from "@/src/components/orders/MyOrders";
import RequireAuth from "@/src/components/auth/RequireAuth";

export default function OrdersPage() {
  return (
    <RequireAuth>
      <MyOrders />
    </RequireAuth>
  );
}
