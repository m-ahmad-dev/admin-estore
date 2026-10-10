import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Layers3, Loader2, Package, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAllCategories } from "../../categories/hooks/useCategories.js";
import ProductImagesManager from "../images/components/ProductImagesManager.jsx";
import ProductVariantsManager from "../variants/components/ProductVariantsManager.jsx";
import {
  createProductSchema,
  updateProductSchema,
  productDefaultValues,
} from "../schemas/product.schema.js";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClassName = "mb-1.5 block text-sm font-semibold text-slate-700";

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-red-600">{error.message}</p>
  );
}

export default function ProductFormModal({
  open,
  mode = "create",
  product = null,
  onClose,
  onSubmit,
  isSubmitting = false,
  canEditImages = false,
  canDeleteImages = false,
}) {
  const isEdit = mode === "edit";
  const schema = isEdit ? updateProductSchema : createProductSchema;

  // Local state for create mode only
  const [localImages, setLocalImages] = useState([]);
  const [localVariants, setLocalVariants] = useState([]);
  const [prevModalSession, setPrevModalSession] = useState(null);
  const currentModalSession = open ? `${mode}-${product?.id ?? "new"}` : null;

  if (prevModalSession !== currentModalSession) {
    setPrevModalSession(currentModalSession);
    if (mode === "create") {
      setLocalImages([]);
      setLocalVariants([]);
    }
  }

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useAllCategories();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: productDefaultValues,
  });

  const selectedCategoryId = useWatch({
    control,
    name: "category_id",
  });

  const categoryOptions = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  useEffect(() => {
    if (!open) return;
    if (isEdit && product) {
      reset({
        name: product.name ?? "",
        description: product.description ?? "",
        category_id: product.category_id ?? product.category?.id ?? "",
        base_price: product.base_price ?? "",
        is_active: product.is_active ?? true,
      });
      return;
    }
    reset(productDefaultValues);
  }, [open, isEdit, product, reset]);

  if (!open) return null;

  const submitHandler = (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      category_id: values.category_id,
      base_price: Number(values.base_price),
      is_active: values.is_active,
    };

    if (!isEdit) {
      onSubmit({
        ...payload,
        variants: localVariants,
        images: localImages,
      });
      return;
    }
    onSubmit(payload);
  };

  const effectiveProductId = isEdit ? product?.id : null;
  const effectiveCategoryId =
    selectedCategoryId || product?.category_id || product?.category?.id || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={19} />
            </div>
            <div>
              <h2
                id="product-form-title"
                className="text-lg font-bold text-slate-900"
              >
                {isEdit ? "Edit Product" : "Create Product"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? "Update product information, images, and variants."
                  : "Configure product information, images, and variants."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="product-form"
          onSubmit={handleSubmit(submitHandler)}
          className="min-h-0 overflow-y-auto"
        >
          <div className="space-y-8 p-6">
            {/* Basic Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Core information used to identify and display this product.
                </p>
              </div>
              <div className="grid gap-5">
                <div>
                  <label htmlFor="product-name" className={labelClassName}>
                    Product Name <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    placeholder="e.g. Premium Cotton T-Shirt"
                    autoComplete="off"
                    disabled={isSubmitting}
                    className={inputClassName}
                    {...register("name")}
                  />
                  <FieldError error={errors.name} />
                </div>
                <div>
                  <label
                    htmlFor="product-description"
                    className={labelClassName}
                  >
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    rows={5}
                    placeholder="Describe the product..."
                    disabled={isSubmitting}
                    className={`${inputClassName} resize-y`}
                    {...register("description")}
                  />
                  <FieldError error={errors.description} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="product-category"
                      className={labelClassName}
                    >
                      Category <span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      id="product-category"
                      disabled={isSubmitting || categoriesLoading}
                      className={inputClassName}
                      {...register("category_id")}
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select category"}
                      </option>
                      {categoryOptions.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          disabled={!category.is_active}
                        >
                          {category.name}
                          {!category.is_active ? " (Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                    {categoriesError && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        Failed to load categories.
                      </p>
                    )}
                    <FieldError error={errors.category_id} />
                  </div>
                  <div>
                    <label
                      htmlFor="product-base-price"
                      className={labelClassName}
                    >
                      Base Price <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        PKR
                      </span>
                      <input
                        id="product-base-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isSubmitting}
                        className={`${inputClassName} pl-14`}
                        {...register("base_price")}
                      />
                    </div>
                    <FieldError error={errors.base_price} />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(field.value)}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                          disabled={isSubmitting}
                          className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">
                            Active product
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            Active products can be displayed and purchased
                            through the storefront.
                          </span>
                        </span>
                      </label>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Images Manager */}
            <section className="border-t border-slate-200 pt-7">
              <ProductImagesManager
                key={effectiveProductId || `create-images`}
                productId={effectiveProductId}
                mode={mode}
                value={localImages}
                onChange={setLocalImages}
                canEdit={isEdit ? canEditImages : true}
                canDelete={isEdit ? canDeleteImages : true}
                disabled={isSubmitting}
              />
            </section>

            {/* Variants Manager */}
            <section className="border-t border-slate-200 pt-7">
              <ProductVariantsManager
                key={effectiveCategoryId || `create-variants`}
                productId={effectiveProductId}
                categoryId={effectiveCategoryId}
                mode={mode}
                value={localVariants}
                onChange={setLocalVariants}
                canEdit={isEdit ? canEditImages : true}
                canDelete={isEdit ? canDeleteImages : true}
                disabled={isSubmitting}
              />
            </section>

            {!isEdit && (
              <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <Layers3
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-900">
                      Creation requirements
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      Add at least one variant and one image. Exactly one image
                      must be marked as primary.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      Images are uploaded only when you submit the product.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {isEdit && (
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <ImageIcon
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Separate resource management
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Product information, images, and variants are managed
                      separately after the product has been created.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </form>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="inline-flex min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
