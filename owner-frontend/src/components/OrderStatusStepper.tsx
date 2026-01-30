import api from "../api/axios";
import { toast } from "react-toastify";

const STEPS = ["pending", "preparing", "out_for_delivery", "delivered"];

export default function OrderStatusStepper({
  status,
  orderId,
}: {
  status: string;
  orderId: string;
}) {
  const currentIndex = STEPS.indexOf(status);

  const updateStatus = async (nextStatus: string) => {
    try {
      await api.patch(`/api/order/update-status/${orderId}`, {
        status: nextStatus,
      });
      toast.success("Order status updated");
      window.location.reload();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-3">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                ${
                  index <= currentIndex
                    ? "bg-green-500 text-white"
                    : "bg-white/20 text-gray-400"
                }`}
            >
              {index + 1}
            </div>

            {index < STEPS.length - 1 && (
              <div className="w-8 h-[2px] bg-white/20" />
            )}
          </div>
        ))}
      </div>

      {currentIndex < STEPS.length - 1 && (
        <button
          onClick={() => updateStatus(STEPS[currentIndex + 1])}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm"
        >
          Move to {STEPS[currentIndex + 1]}
        </button>
      )}
    </div>
  );
}
