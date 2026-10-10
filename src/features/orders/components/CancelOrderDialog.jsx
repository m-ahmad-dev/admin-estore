import { AlertTriangle } from "lucide-react";
import { useOrderMutations } from "../hooks/useOrderMutations";

export const CancelOrderDialog = ({ orderId, orderNumber, onClose }) => {
  const { cancelOrderMutation } = useOrderMutations();

  const handleCancel = () => {
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Cancel Order</h3>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to cancel order{" "}
          <span className="font-semibold text-slate-900">{orderNumber}</span>?
          This releases the reserved inventory and cancels any unfulfilled
          shipment label. Paid card orders must use the separate refund action.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Keep Order
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelOrderMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
          >
            {cancelOrderMutation.isPending
              ? "Cancelling..."
              : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
};
