import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";

const defaultCategoryValues = {
  name: "",
  parent_id: "",
  description: "",
  is_active: true,
};

export default function CategoryFormModal({
  open,
  mode = "create",
  category = null,
  categories = [],
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const isEdit = mode === "edit";
  const schema = isEdit ? updateCategorySchema : createCategorySchema;

  const initialValues = useMemo(() => {
    if (!isEdit || !category) return defaultCategoryValues;
    return {
      name: category.name ?? "",
      parent_id: category.parent_id ?? "",
      description: category.description ?? "",
      is_active: category.is_active ?? true,
    };
  }, [category, isEdit]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) reset(initialValues);
  }, [open, initialValues, reset]);

  if (!open) return null;

  const validParentCategories = categories.filter((c) => c.id !== category?.id);

  const handleFormSubmit = (data) => {
    if (isEdit) {
      onSubmit({ categoryId: category.id, payload: data });
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close background"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEdit ? "Edit Category" : "Create New Category"}
            </h2>
            <p className="text-xs text-slate-500">
              Configure category details and parent relations.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 p-6"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Category Name *
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Smart Electronics"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Parent Category
            </label>
            <select
              {...register("parent_id")}
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">None (Root Category)</option>
              {validParentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.parent_id && (
              <p className="mt-1 text-xs text-red-600">
                {errors.parent_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Brief summary of category products..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="category-active-check"
              {...register("is_active")}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="category-active-check"
              className="cursor-pointer text-xs font-semibold text-slate-700"
            >
              Category is active & visible on store
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
