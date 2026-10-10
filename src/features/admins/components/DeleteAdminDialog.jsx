import { AlertTriangle, X } from "lucide-react";

function DeleteAdminDialog({ admin, open, isDeleting, onClose, onConfirm }) {
  if (!open || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog background"
        onClick={onClose}
        disabled={isDeleting}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X size={16} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
          <AlertTriangle size={20} />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900">
          Delete Administrator Account?
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-slate-900">{admin.name}</strong>{" "}
          ({admin.email})? This action will permanently remove access and cannot
          be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAdminDialog;
