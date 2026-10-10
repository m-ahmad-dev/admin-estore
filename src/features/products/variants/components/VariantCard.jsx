import { Edit3, Package, RotateCcw, Trash2 } from "lucide-react";

import { formatVariantAttributes } from "../utils/variantAttributes.js";

export default function VariantCard({
  variant,
  onEdit,
  onDelete,
  onRestore,
  onStock,
  canEdit = false,
  canDelete = false,
  disabled = false,
}) {
  const deleted = Boolean(variant.deleted_at);
  const lowStock = Boolean(variant.low_stock);
  const outOfStock = Number(variant.stock_quantity ?? 0) <= 0;

  return (
    <article
      className={[
        "rounded-2xl border bg-white p-4 shadow-sm",
        deleted ? "border-red-100 bg-red-50/30" : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900">
              {variant.sku || "No SKU"}
            </h4>

            {deleted && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                Deleted
              </span>
            )}

            {!deleted && lowStock && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                Low stock
              </span>
            )}

            {!deleted && outOfStock && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                Out of stock
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {formatVariantAttributes(variant.attributes) || "No attributes"}
          </p>
        </div>

        <Package size={18} className="shrink-0 text-indigo-500" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Price
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            PKR {Number(variant.price ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Weight
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {variant.weight ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Stock
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {variant.stock_quantity ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            Reserved
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {variant.reserved_quantity ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!deleted && canEdit && (
          <>
            <button
              type="button"
              onClick={() => onEdit(variant)}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Edit3 size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onStock(variant)}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
            >
              Stock
            </button>
          </>
        )}

        {deleted && canEdit && (
          <button
            type="button"
            onClick={() => onRestore(variant)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            <RotateCcw size={14} />
            Restore
          </button>
        )}

        {!deleted && canDelete && (
          <button
            type="button"
            onClick={() => onDelete(variant)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
