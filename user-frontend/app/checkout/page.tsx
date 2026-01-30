import Checkout from "@/src/components/checkout/Checkout";
import RequireAuth from "@/src/components/auth/RequireAuth";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}
