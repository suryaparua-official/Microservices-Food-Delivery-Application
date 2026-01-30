import TrackOrder from "@/src/components/track/TrackOrder";
import RequireAuth from "@/src/components/auth/RequireAuth";

export default function TrackOrderPage() {
  return (
    <RequireAuth>
      <TrackOrder />
    </RequireAuth>
  );
}
