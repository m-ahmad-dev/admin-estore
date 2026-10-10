import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useOrderMutations } from "../hooks/useOrderMutations";

export const UpdateStatusModal = ({
  orderId,
  currentStatus,
  type,
  options,
  schema,
  onClose,
}) => {
  const {
    updateStatusMutation,
    updatePaymentStatusMutation,
    updateShipmentStatusMutation,
  } = useOrderMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: currentStatus },
  });

  const onSubmit = (data) => {
    const payload = { id: orderId, status: data.status };
    const mutationMap = {
      order: updateStatusMutation,
      payment: updatePaymentStatusMutation,
      shipment: updateShipmentStatusMutation,
    };

    mutationMap[type].mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  const isLoading =
    updateStatusMutation.isPending ||
    updatePaymentStatusMutation.isPending ||
    updateShipmentStatusMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-semibold capitalize">
            Update {type} Status
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
