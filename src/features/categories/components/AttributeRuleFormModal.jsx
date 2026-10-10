import { useEffect, useMemo } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  attributeRuleSchema,
  updateAttributeRuleSchema,
  CATEGORY_ATTRIBUTE_TYPES,
} from "../schemas/category.schema.js";

const createDefaults = {
  name: "",
  label: "",
  type: "string",
  required: false,
  options: [],
};

export default function AttributeRuleFormModal({
  open,
  mode = "create",
  attribute = null,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const isEdit = mode === "edit";
  const schema = isEdit ? updateAttributeRuleSchema : attributeRuleSchema;

  const defaultValues = useMemo(() => {
    if (!isEdit || !attribute) return createDefaults;
    return {
      label: attribute.label ?? "",
      type: attribute.type ?? "string",
      required: attribute.required ?? false,
      options: attribute.options ?? [],
    };
  }, [attribute, isEdit]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const attributeType = useWatch({ control, name: "type" });
  const options = useWatch({ control, name: "options" }) ?? [];

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  if (!open) return null;

  const addOption = () => setValue("options", [...options, ""]);
  const removeOption = (index) =>
    setValue(
      "options",
      options.filter((_, i) => i !== index),
    );

  const submit = (values) => {
    const payload = { ...values };
    if (payload.type !== "enum") {
      delete payload.options;
    } else {
      payload.options = payload.options?.map((v) => v.trim()).filter(Boolean);
    }

    if (isEdit) {
      delete payload.name;
      onSubmit({ attributeName: attribute.name, payload });
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close background"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEdit ? "Edit Attribute Rule" : "Add New Attribute"}
            </h2>
            <p className="text-xs text-slate-500">
              Configure product dynamic rules.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4 p-6">
          {!isEdit ? (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Attribute Identifier Key
              </label>
              <input
                {...register("name")}
                placeholder="e.g. screen_size"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Immutable Key
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {attribute?.name}
              </p>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Display Label
            </label>
            <input
              {...register("label")}
              placeholder="e.g. Screen Size"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.label && (
              <p className="mt-1 text-xs text-red-600">
                {errors.label.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Data Type
            </label>
            <select
              {...register("type")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {CATEGORY_ATTRIBUTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="required-check"
              {...register("required")}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="required-check"
              className="text-xs font-medium text-slate-700"
            >
              Required field on product entry
            </label>
          </div>

          {attributeType === "enum" && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Allowed Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Plus size={14} /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {options.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      {...register(`options.${index}`)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {errors.options && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.options.message}
                </p>
              )}
            </div>
          )}

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Attribute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
