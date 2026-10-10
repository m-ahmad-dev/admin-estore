import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import VariantAttributesFields from "./VariantAttributesFields.jsx";

import {
  variantCreateSchema,
  variantUpdateSchema,
  variantDefaultValues,
} from "../schemas/variant.schema.js";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50";

const labelClassName = "mb-1.5 block text-sm font-semibold text-slate-700";

/* ================================================================
   HELPERS
================================================================ */

const formatAttributeValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

/* ================================================================
   COMPONENT
================================================================ */

export default function VariantForm({
  mode = "create",
  variant = null,
  attributeRules = [],
  disabled = false,
  onSubmit,
  onCancel,
}) {
  const isEdit = mode === "edit";

  /*
   * IMPORTANT:
   *
   * Create and update are two different forms.
   *
   * We therefore give React Hook Form the exact default
   * values for the current mode.
   */

  const createDefaultValues = variantDefaultValues;

  const updateDefaultValues = {
    sku: "",
    price: "",
    weight: "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? variantUpdateSchema : variantCreateSchema),

    /*
     * Keep this enabled so fields that disappear from
     * the DOM are removed from RHF state.
     */
    shouldUnregister: true,

    defaultValues: isEdit ? updateDefaultValues : createDefaultValues,
  });

  /* ================================================================
     RESET FORM WHEN VARIANT / MODE CHANGES
  ================================================================ */

  useEffect(() => {
    if (isEdit) {
      /*
       * CRITICAL:
       *
       * Do NOT pass `variant.attributes`.
       * Do NOT pass stock fields.
       *
       * The backend update endpoint only accepts:
       * sku, price, weight.
       */
      reset({
        sku: variant?.sku ?? "",

        price:
          variant?.price !== null && variant?.price !== undefined
            ? String(variant.price)
            : "",

        weight:
          variant?.weight !== null && variant?.weight !== undefined
            ? String(variant.weight)
            : "",
      });

      return;
    }

    reset(createDefaultValues);
  }, [isEdit, variant, reset, createDefaultValues]);

  /* ================================================================
     SUBMIT
  ================================================================ */

  const submitHandler = (values) => {
    console.log("[VariantForm] Validated values:", values);

    /* ------------------------------------------------------------
       UPDATE
    ------------------------------------------------------------ */

    if (isEdit) {
      /*
       * Explicitly construct the update payload.
       *
       * This prevents accidental fields from being sent.
       */
      const payload = {};

      if (values.sku !== undefined && values.sku !== null) {
        const sku = values.sku.trim();

        if (sku !== "") {
          payload.sku = sku;
        }
      }

      if (
        values.price !== undefined &&
        values.price !== null &&
        values.price !== ""
      ) {
        payload.price = Number(values.price);
      }

      if (
        values.weight !== undefined &&
        values.weight !== null &&
        values.weight !== ""
      ) {
        payload.weight = Number(values.weight);
      }

      console.log("[VariantForm] Update payload:", payload);

      onSubmit?.(payload);

      return;
    }

    /* ------------------------------------------------------------
       CREATE
    ------------------------------------------------------------ */

    const payload = {
      attributes: values.attributes,

      sku: values.sku?.trim() || undefined,

      price: Number(values.price),

      weight: Number(values.weight),

      stock_quantity: Number(values.stock_quantity),

      reserved_quantity: Number(values.reserved_quantity),

      reorder_level: Number(values.reorder_level),
    };

    console.log("[VariantForm] Create payload:", payload);

    onSubmit?.(payload);
  };

  /* ================================================================
     INVALID SUBMIT
  ================================================================ */

  const handleInvalidSubmit = (validationErrors) => {
    console.error("[VariantForm] Validation failed:", validationErrors);

    console.error(
      "[VariantForm] Validation error details:",
      JSON.stringify(validationErrors, null, 2),
    );
  };

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="space-y-6">
      {/* ============================================================
          ATTRIBUTES
      ============================================================ */}

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Attributes Selection
          </h3>

          {isEdit && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Variant attributes cannot be changed after the variant is created.
            </p>
          )}
        </div>

        {/* ----------------------------------------------------------
            CREATE
        ---------------------------------------------------------- */}

        {!isEdit && (
          <>
            <VariantAttributesFields
              control={control}
              rules={attributeRules}
              disabled={disabled}
            />

            {errors.attributes && (
              <p className="text-xs font-medium text-red-600">
                {errors.attributes.message}
              </p>
            )}
          </>
        )}

        {/* ----------------------------------------------------------
            EDIT - READ ONLY ATTRIBUTES
        ---------------------------------------------------------- */}

        {isEdit && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            {variant?.attributes &&
            Object.keys(variant.attributes).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(variant.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {key}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatAttributeValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No attributes assigned.</p>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
          PRICING & IDENTIFIERS
      ============================================================ */}

      <div className="space-y-4 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Pricing & Identifiers
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* SKU */}

          <div>
            <label className={labelClassName}>SKU</label>

            <input
              type="text"
              placeholder="e.g. TSHIRT-BLK-L"
              disabled={disabled}
              className={inputClassName}
              {...register("sku")}
            />

            {errors.sku && (
              <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>
            )}
          </div>

          {/* PRICE */}

          <div>
            <label className={labelClassName}>
              Price <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              disabled={disabled}
              className={inputClassName}
              {...register("price")}
            />

            {errors.price && (
              <p className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* WEIGHT */}

          <div>
            <label className={labelClassName}>
              Weight (kg) <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              disabled={disabled}
              className={inputClassName}
              {...register("weight")}
            />

            {errors.weight && (
              <p className="mt-1 text-xs text-red-600">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          INVENTORY - CREATE ONLY
      ============================================================ */}

      {!isEdit && (
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Inventory Rules
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* INITIAL STOCK */}

            <div>
              <label className={labelClassName}>Initial Stock</label>

              <input
                type="number"
                min="0"
                step="1"
                disabled={disabled}
                className={inputClassName}
                {...register("stock_quantity")}
              />

              {errors.stock_quantity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.stock_quantity.message}
                </p>
              )}
            </div>

            {/* RESERVED */}

            <div>
              <label className={labelClassName}>Reserved Quantity</label>

              <input
                type="number"
                min="0"
                step="1"
                disabled={disabled}
                className={inputClassName}
                {...register("reserved_quantity")}
              />

              {errors.reserved_quantity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.reserved_quantity.message}
                </p>
              )}
            </div>

            {/* REORDER */}

            <div>
              <label className={labelClassName}>Reorder Alert Threshold</label>

              <input
                type="number"
                min="0"
                step="1"
                disabled={disabled}
                className={inputClassName}
                {...register("reorder_level")}
              />

              {errors.reorder_level && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.reorder_level.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          ACTIONS
      ============================================================ */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit(submitHandler, handleInvalidSubmit)}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled && <Loader2 size={16} className="animate-spin" />}

          {isEdit ? "Update Variant" : "Save Variant"}
        </button>
      </div>
    </div>
  );
}
