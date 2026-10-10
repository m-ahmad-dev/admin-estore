import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantStockSchema } from "../schemas/variant.schema.js";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50";

export default function VariantStockDialog({
  variant,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(variantStockSchema),
    defaultValues: {
      operation: "stock.set",
      stock_quantity: variant?.stock_quantity ?? 0,
      reserved_quantity: variant?.reserved_quantity ?? 0,
      reorder_level: variant?.reorder_level ?? 5,
      quantity: 1,
    },
  });

  const operation = useWatch({ control, name: "operation" });

  useEffect(() => {
    if (!open || !variant) return;
    reset({
      operation: "stock.set",
      stock_quantity: variant.stock_quantity ?? 0,
      reserved_quantity: variant.reserved_quantity ?? 0,
      reorder_level: variant.reorder_level ?? 5,
      quantity: 1,
    });
  }, [open, variant, reset]);

  if (!open || !variant) return null;

  const submitHandler = handleSubmit((values) => {
    if (values.operation === "stock.set") {
      onSubmit({
        operation: "stock.set",
        stock_quantity: Number(values.stock_quantity),
        reserved_quantity: Number(values.reserved_quantity),
        reorder_level: Number(values.reorder_level),
      });
      return;
    }
    onSubmit({
      operation: values.operation,
      quantity: Number(values.quantity),
    });
  });

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manage stock</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {variant.sku || "Variant"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Operation
            </label>
            <select
              disabled={isSubmitting}
              className={inputClassName}
              {...register("operation")}
            >
              <option value="stock.set">Set stock values</option>
              <option value="stock.add">Add stock</option>
              <option value="stock.reduce">Reduce stock</option>
              <option value="stock.reserve">Reserve stock</option>
              <option value="reserved_stock.release">
                Release reserved stock
              </option>
              <option value="reserved_stock.confirm">
                Confirm reserved stock
              </option>
            </select>
          </div>

          {operation === "stock.set" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={isSubmitting}
                  className={inputClassName}
                  {...register("stock_quantity")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Reserved
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={isSubmitting}
                  className={inputClassName}
                  {...register("reserved_quantity")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Reorder
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={isSubmitting}
                  className={inputClassName}
                  {...register("reorder_level")}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                disabled={isSubmitting}
                className={inputClassName}
                {...register("quantity")}
              />
              {errors.quantity && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitHandler}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
