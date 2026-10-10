import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";

import {
  couponSchema,
  defaultCouponValues,
  isoToDatetimeLocal,
  normalizeCouponPayload,
} from "../schemas/coupon.schema.js";
import { useCouponMutations } from "../hooks/useCouponMutations.js";

const CouponFormModal = ({ open, coupon = null, onClose }) => {
  const isEditing = Boolean(coupon);

  const { createCoupon, updateCoupon, isCreating, isUpdating } =
    useCouponMutations();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),

    defaultValues: defaultCouponValues,

    mode: "onBlur",
  });

  const couponType = useWatch({
    control,
    name: "type",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!coupon) {
      reset(defaultCouponValues);
      return;
    }

    reset({
      code: coupon.code ?? "",

      type: coupon.type ?? "PERCENTAGE",

      value: coupon.value ?? "",

      min_order_value: coupon.min_order_value ?? "",

      max_discount: coupon.max_discount ?? "",

      max_uses: coupon.max_uses ?? "",

      is_active: coupon.is_active ?? true,

      starts_at: isoToDatetimeLocal(coupon.starts_at),

      expires_at: isoToDatetimeLocal(coupon.expires_at),
    });
  }, [open, coupon, reset]);

  useEffect(() => {
    if (couponType === "FIXED") {
      setValue("max_discount", "");
    }
  }, [couponType, setValue]);

  if (!open) {
    return null;
  }

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (values) => {
    const payload = normalizeCouponPayload(values);

    if (isEditing) {
      await updateCoupon.mutateAsync({
        couponId: coupon.id,
        payload,
      });
    } else {
      await createCoupon.mutateAsync(payload);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="coupon-form-title"
              className="text-lg font-semibold text-gray-900"
            >
              {isEditing ? "Edit Coupon" : "Create Coupon"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure coupon discount, limits, and validity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Code */}
          <div>
            <label
              htmlFor="coupon-code"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Coupon Code
            </label>

            <input
              id="coupon-code"
              {...register("code")}
              placeholder="SUMMER25"
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="coupon-type"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Discount Type
            </label>

            <select
              id="coupon-type"
              {...register("type")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >
              <option value="PERCENTAGE">Percentage</option>

              <option value="FIXED">Fixed Amount</option>
            </select>

            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Value */}
          <div>
            <label
              htmlFor="coupon-value"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {couponType === "PERCENTAGE"
                ? "Discount Percentage"
                : "Discount Amount"}
            </label>

            <input
              id="coupon-value"
              type="number"
              min={couponType === "PERCENTAGE" ? "1" : "0.01"}
              max={couponType === "PERCENTAGE" ? "100" : undefined}
              step={couponType === "PERCENTAGE" ? "1" : "0.01"}
              {...register("value", {
                setValueAs: (value) => {
                  if (value === "") return undefined;

                  return Number(value);
                },
              })}
              placeholder={couponType === "PERCENTAGE" ? "10" : "500"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

            {errors.value && (
              <p className="mt-1 text-sm text-red-600">
                {errors.value.message}
              </p>
            )}
          </div>

          {/* Max discount */}
          {couponType === "PERCENTAGE" && (
            <div>
              <label
                htmlFor="coupon-max-discount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Maximum Discount
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="coupon-max-discount"
                type="number"
                min="0.01"
                step="0.01"
                {...register("max_discount", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                placeholder="1000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />

              {errors.max_discount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.max_discount.message}
                </p>
              )}
            </div>
          )}

          {/* Minimum order */}
          <div>
            <label
              htmlFor="coupon-min-order"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Minimum Order Value
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </label>

            <input
              id="coupon-min-order"
              type="number"
              min="0"
              step="0.01"
              {...register("min_order_value", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

            {errors.min_order_value && (
              <p className="mt-1 text-sm text-red-600">
                {errors.min_order_value.message}
              </p>
            )}
          </div>

          {/* Max uses */}
          <div>
            <label
              htmlFor="coupon-max-uses"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Maximum Uses
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </label>

            <input
              id="coupon-max-uses"
              type="number"
              min="1"
              step="1"
              {...register("max_uses", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              placeholder="Unlimited"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

            {errors.max_uses && (
              <p className="mt-1 text-sm text-red-600">
                {errors.max_uses.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="coupon-starts-at"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Starts At
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="coupon-starts-at"
                type="datetime-local"
                {...register("starts_at")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />

              {errors.starts_at && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.starts_at.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="coupon-expires-at"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Expires At
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="coupon-expires-at"
                type="datetime-local"
                {...register("expires_at")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />

              {errors.expires_at && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expires_at.message}
                </p>
              )}
            </div>
          </div>

          {/* Active */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />

                <span>
                  <span className="block text-sm font-medium text-gray-700">
                    Active coupon
                  </span>

                  <span className="block text-xs text-gray-500">
                    Customers can use this coupon when active.
                  </span>
                </span>
              </label>
            )}
          />

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}

              {isEditing ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
