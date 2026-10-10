import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

import { toast } from "sonner";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import { useUpdateCustomerStatus } from "../hooks/useCustomerMutations.js";

const CustomerStatusDialog = ({ customer, open, onClose }) => {
  const mutation = useUpdateCustomerStatus();

  if (!open || !customer) {
    return null;
  }

  const isActive = customer.is_active;

  const nextStatus = isActive ? "deactive" : "active";

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ");

  const handleConfirm = async () => {
    try {
      await mutation.mutateAsync({
        customerId: customer.id,

        status: nextStatus,
      });

      toast.success(
        isActive
          ? "Customer deactivated successfully."
          : "Customer activated successfully.",
      );

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change customer status.",
      );
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.CUSTOMERS_EDIT}>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close status dialog"
          disabled={mutation.isPending}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Dialog */}
        <div
          role="alertdialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isActive ? (
                  <AlertTriangle size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-slate-900">
                  {isActive ? "Deactivate customer?" : "Activate customer?"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isActive
                    ? `Are you sure you want to deactivate ${fullName || "this customer"}? They will no longer be able to use their account.`
                    : `Are you sure you want to activate ${fullName || "this customer"}?`}
                </p>
              </div>

              <button
                type="button"
                disabled={mutation.isPending}
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={onClose}
                className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={mutation.isPending}
                onClick={handleConfirm}
                className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {mutation.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {mutation.isPending
                  ? "Updating..."
                  : isActive
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  );
};

export default CustomerStatusDialog;
