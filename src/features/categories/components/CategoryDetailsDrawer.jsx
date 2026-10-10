import { useState } from "react";
import { X, Plus, Edit, Trash2, Tag, Calendar, FolderTree } from "lucide-react";
import { toast } from "sonner";

import useCategory from "../hooks/useCategory.js";
import {
  useAddCategoryAttribute,
  useUpdateCategoryAttribute,
  useDeleteCategoryAttribute,
} from "../hooks/useCategoryMutations.js";
import AttributeRuleFormModal from "./AttributeRuleFormModal.jsx";
import { getApiErrorMessage } from "../../../lib/apiError.js";

export default function CategoryDetailsDrawer({
  categoryId,
  open,
  onClose,
  onEdit,
}) {
  const [attrModal, setAttrModal] = useState(null);

  const { category, attributes, isLoading } = useCategory(categoryId, open);

  const addAttrMutation = useAddCategoryAttribute();
  const updateAttrMutation = useUpdateCategoryAttribute();
  const deleteAttrMutation = useDeleteCategoryAttribute();

  if (!open) return null;

  const handleAddAttribute = (payload) => {
    addAttrMutation.mutate(
      { categoryId, payload },
      {
        onSuccess: () => {
          toast.success("Attribute added successfully");
          setAttrModal(null);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to add attribute"));
        },
      },
    );
  };

  const handleUpdateAttribute = ({ attributeName, payload }) => {
    updateAttrMutation.mutate(
      { categoryId, attrName: attributeName, payload },
      {
        onSuccess: () => {
          toast.success("Attribute updated successfully");
          setAttrModal(null);
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, "Failed to update attribute"));
        },
      },
    );
  };

  const handleDeleteAttribute = (attrName) => {
    deleteAttrMutation.mutate(
      { categoryId, attrName },
      {
        onSuccess: () => toast.success("Attribute removed successfully"),
        onError: (err) =>
          toast.error(getApiErrorMessage(err, "Failed to remove attribute")),
      },
    );
  };

  const activeAttribute = attrModal?.attrName
    ? attributes.find((a) => a.name === attrModal.attrName)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Category Details
            </h2>
            <p className="text-xs text-slate-500">
              Attributes & dynamic schema specifications
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/2 rounded bg-slate-100" />
              <div className="h-20 rounded-xl bg-slate-100" />
              <div className="h-40 rounded-xl bg-slate-100" />
            </div>
          </div>
        ) : category ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Overview Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {category.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-500">
                    {category.slug}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(category.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Edit size={14} /> Edit
                </button>
              </div>

              {category.description && (
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-200/60 pt-3">
                <div className="flex items-center gap-1.5">
                  <FolderTree size={14} className="text-slate-400" />
                  Parent:{" "}
                  <span className="font-medium text-slate-800">
                    {category.parent?.name ?? "Root"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  Created:{" "}
                  <span className="font-medium text-slate-800">
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Attributes Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Tag size={16} className="text-indigo-600" />
                  <h4 className="text-sm font-semibold text-slate-900">
                    Required Attribute Rules
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setAttrModal({ mode: "create" })}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Plus size={14} /> Add Rule
                </button>
              </div>

              {attributes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  No custom attributes defined for this category.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {attributes.map((attr) => (
                    <div
                      key={attr.name}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {attr.label}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                            {attr.type}
                          </span>
                          {attr.required && (
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">
                          key: {attr.name}
                        </p>
                        {attr.options && attr.options.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {attr.options.map((opt) => (
                              <span
                                key={opt}
                                className="rounded-md bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setAttrModal({
                              mode: "edit",
                              attrName: attr.name,
                            })
                          }
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttribute(attr.name)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Attribute Modal */}
        <AttributeRuleFormModal
          open={Boolean(attrModal)}
          mode={attrModal?.mode}
          attribute={activeAttribute}
          onClose={() => setAttrModal(null)}
          onSubmit={
            attrModal?.mode === "edit"
              ? handleUpdateAttribute
              : handleAddAttribute
          }
          isSubmitting={
            addAttrMutation.isPending || updateAttrMutation.isPending
          }
        />
      </div>
    </div>
  );
}
