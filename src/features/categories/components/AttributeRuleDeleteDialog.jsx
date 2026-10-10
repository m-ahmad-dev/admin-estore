import { AlertTriangle, X } from "lucide-react";

import { PermissionGate } from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

function AttributeRuleDeleteDialog({
  open,
  attribute,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!open || !attribute) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-50 p-2.5 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[--text-primary]">
                Delete attribute?
              </h2>

              <p className="mt-2 text-sm text-[--text-secondary]">
                Delete <strong>{attribute.label}</strong> ({attribute.name})?
              </p>

              <p className="mt-3 text-xs text-amber-700">
                The backend prevents attribute deletion while products are
                assigned to this category.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-lg p-2 hover:bg-[--bg-muted]"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[--border-subtle] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[--border-subtle] px-4 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <PermissionGate permission={PERMISSIONS.CATEGORIES_EDIT}>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete attribute"}
            </button>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}

export default AttributeRuleDeleteDialog;
