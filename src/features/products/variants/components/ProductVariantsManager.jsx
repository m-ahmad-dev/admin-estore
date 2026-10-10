import { useMemo, useState } from "react";
import { Loader2, Plus, Layers3 } from "lucide-react";
import { toast } from "sonner";

import { useCategory } from "../../../categories/hooks/useCategory.js";
import useProductVariants from "../hooks/useProductVariants.js";
import {
  useCreateProductVariants,
  useUpdateProductVariant,
  useDeleteProductVariant,
  useRestoreProductVariant,
  useUpdateProductVariantStock,
} from "../hooks/useProductVariantMutations.js";

import VariantForm from "./VariantForm.jsx";
import VariantCard from "./VariantCard.jsx";
import VariantDeleteDialog from "./VariantDeleteDialog.jsx";
import VariantStockDialog from "./VariantStockDialog.jsx";

import { normalizeAttributeRules } from "../utils/variantAttributes.js";
import { getApiErrorMessage } from "../../../../lib/apiError.js";

export default function ProductVariantsManager({
  productId = null,
  categoryId = null,
  mode = "edit",
  value = [],
  onChange,
  canEdit = false,
  canDelete = false,
  disabled = false,
}) {
  const isCreate = mode === "create";

  const {
    attributes = [],
    isLoading: categoryAttributesLoading,
    isError: categoryAttributesError,
  } = useCategory(categoryId, Boolean(categoryId));

  const {
    data: serverVariants = [],
    isLoading: variantsLoading,
    isError: variantsError,
    error: variantsErrorObject,
  } = useProductVariants(productId, {
    enabled: Boolean(productId) && !isCreate,
    params: { include_deleted: true },
  });

  const createMutation = useCreateProductVariants();
  const updateMutation = useUpdateProductVariant();
  const deleteMutation = useDeleteProductVariant();
  const restoreMutation = useRestoreProductVariant();
  const stockMutation = useUpdateProductVariantStock();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingVariant, setEditingVariant] = useState(null);
  const [deletingVariant, setDeletingVariant] = useState(null);
  const [stockVariant, setStockVariant] = useState(null);

  const rules = useMemo(
    () => normalizeAttributeRules(attributes),
    [attributes],
  );
  const variants = isCreate ? value : serverVariants;

  const openCreateVariant = () => {
    setEditingVariant(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditVariant = (variant) => {
    setEditingVariant(variant);
    setFormMode("edit");
    setFormOpen(true);
  };

  const closeVariantForm = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setFormOpen(false);
    setEditingVariant(null);
  };

  const handleVariantSubmit = async (payload) => {
    if (isCreate) {
      // In create mode, we store locally; duplicates are checked.
      const duplicate = value.some(
        (v) =>
          JSON.stringify(v.attributes) === JSON.stringify(payload.attributes),
      );
      if (duplicate) {
        toast.error("A variant with the same attributes already exists.");
        return;
      }
      const localVariant = {
        id: `local-variant-${crypto.randomUUID()}`,
        ...payload,
        deleted_at: null,
        low_stock:
          Number(payload.stock_quantity) <= Number(payload.reorder_level),
      };
      onChange?.([...value, localVariant]);
      setFormOpen(false);
      toast.success("Variant added to product draft");
      return;
    }

    // Edit mode
    if (formMode === "edit") {
      try {
        await updateMutation.mutateAsync({
          productId,
          variantId: editingVariant.id,
          payload,
        });
        toast.success("Variant updated successfully");
        closeVariantForm();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to update variant"));
      }
    } else {
      try {
        await createMutation.mutateAsync({
          productId,
          variants: [payload],
        });
        toast.success("Variant added successfully");
        closeVariantForm();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to add variant"));
      }
    }
  };

  const handleDeleteVariant = async () => {
    if (!deletingVariant) return;
    if (isCreate) {
      onChange?.(value.filter((item) => item.id !== deletingVariant.id));
      setDeletingVariant(null);
      return;
    }
    try {
      await deleteMutation.mutateAsync({
        productId,
        variantId: deletingVariant.id,
      });
      toast.success("Variant deleted successfully");
      setDeletingVariant(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete variant"));
    }
  };

  const handleRestore = async (variant) => {
    try {
      await restoreMutation.mutateAsync({ productId, variantId: variant.id });
      toast.success("Variant restored successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to restore variant"));
    }
  };

  const handleStockSubmit = async (payload) => {
    if (!stockVariant) return;
    try {
      await stockMutation.mutateAsync({
        productId,
        variantId: stockVariant.id,
        payload,
      });
      toast.success("Variant stock updated successfully");
      setStockVariant(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update variant stock"));
    }
  };

  if (!isCreate && variantsLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
        </div>
      </section>
    );
  }

  if (!isCreate && variantsError) {
    return (
      <section className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
        {getApiErrorMessage(
          variantsErrorObject,
          "Failed to load product variants",
        )}
      </section>
    );
  }

  const isAddVariantDisabled =
    disabled ||
    !canEdit ||
    !categoryId ||
    categoryAttributesLoading ||
    createMutation.isPending;

  return (
    <>
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers3 size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Product Variants
              </h3>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage SKU, attributes, pricing, stock, and reorder levels.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateVariant}
            disabled={isAddVariantDisabled}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={15} />
            Add Variant
          </button>
        </div>

        {!categoryId && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Select a category before adding product variants.
          </div>
        )}

        {categoryAttributesError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            Failed to load the selected category's variant attributes.
          </div>
        )}

        {!variants.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <Layers3 size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No variants
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {canEdit
                ? "Click 'Add Variant' to create one."
                : "No variants available."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                onEdit={openEditVariant}
                onDelete={setDeletingVariant}
                onRestore={handleRestore}
                onStock={setStockVariant}
                canEdit={canEdit}
                canDelete={canDelete}
                disabled={
                  disabled ||
                  updateMutation.isPending ||
                  deleteMutation.isPending ||
                  restoreMutation.isPending ||
                  stockMutation.isPending
                }
              />
            ))}
          </div>
        )}
      </section>

      {formOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {formMode === "edit" ? "Edit Variant" : "Add Variant"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Configure the variant details.
              </p>
            </div>
            <div className="p-6">
              <VariantForm
                mode={formMode}
                variant={editingVariant}
                attributeRules={rules}
                disabled={
                  disabled ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                onSubmit={handleVariantSubmit}
                onCancel={closeVariantForm}
              />
            </div>
          </div>
        </div>
      )}

      <VariantDeleteDialog
        variant={deletingVariant}
        open={Boolean(deletingVariant)}
        onClose={() => setDeletingVariant(null)}
        onConfirm={handleDeleteVariant}
        isSubmitting={deleteMutation.isPending}
      />

      <VariantStockDialog
        variant={stockVariant}
        open={Boolean(stockVariant)}
        onClose={() => setStockVariant(null)}
        onSubmit={handleStockSubmit}
        isSubmitting={stockMutation.isPending}
      />
    </>
  );
}
