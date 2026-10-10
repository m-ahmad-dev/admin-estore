import { useEffect } from "react";
import { Loader2, X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import { updateCustomerSchema } from "../schemas/customer.schema.js";
import { useUpdateCustomer } from "../hooks/useCustomerMutations.js";

const EditCustomerModal = ({ customer, open, onClose }) => {
  const mutation = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateCustomerSchema),

    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!open || !customer) {
      return;
    }

    reset({
      firstname: customer.first_name ?? "",

      lastname: customer.last_name ?? "",

      email: customer.email ?? "",

      phone: customer.phone ?? "",
    });
  }, [open, customer, reset]);

  if (!open || !customer) {
    return null;
  }

  const onSubmit = async (values) => {
    try {
      await mutation.mutateAsync({
        customerId: customer.id,

        data: {
          firstname: values.firstname.trim(),

          lastname: values.lastname.trim(),

          email: values.email.trim().toLowerCase(),

          phone: values.phone?.trim() || null,
        },
      });

      toast.success("Customer updated successfully.");

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update customer.",
      );
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.CUSTOMERS_EDIT}>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close edit customer dialog"
          onClick={mutation.isPending ? undefined : onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-customer-title"
          className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2
                id="edit-customer-title"
                className="text-base font-semibold text-slate-900"
              >
                Edit customer
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Update customer profile information.
              </p>
            </div>

            <button
              type="button"
              disabled={mutation.isPending}
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First name */}
              <div>
                <label
                  htmlFor="customer-firstname"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  First name
                </label>

                <input
                  id="customer-firstname"
                  {...register("firstname")}
                  disabled={mutation.isPending}
                  className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
                    errors.firstname
                      ? "border-red-300 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  }`}
                />

                {errors.firstname && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="customer-lastname"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Last name
                </label>

                <input
                  id="customer-lastname"
                  {...register("lastname")}
                  disabled={mutation.isPending}
                  className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
                    errors.lastname
                      ? "border-red-300 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  }`}
                />

                {errors.lastname && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="customer-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="customer-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                disabled={mutation.isPending}
                className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
                  errors.email
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="customer-phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone
              </label>

              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                {...register("phone")}
                disabled={mutation.isPending}
                placeholder="Optional"
                className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition ${
                  errors.phone
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                }`}
              />

              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-5">
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={onClose}
                className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutation.isPending || !isDirty}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {mutation.isPending ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PermissionGate>
  );
};

export default EditCustomerModal;
