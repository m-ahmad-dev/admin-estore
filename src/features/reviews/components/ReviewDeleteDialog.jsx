import { AlertTriangle, Trash2, X } from "lucide-react";

import { useReviewMutations } from "../hooks/useReviewMutations.js";

const ReviewDeleteDialog = ({ review, open, onClose }) => {
  const { deleteReview } = useReviewMutations();

  if (!open || !review) {
    return null;
  }

  const handleDelete = () => {
    deleteReview.mutate(review.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (deleteReview.isPending ? null : onClose())}
      />

      <div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start gap-4 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Delete review?
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    This action permanently removes the review from the system.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleteReview.isPending}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {review.title || "Untitled review"}
                </p>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {review.comment || "No comment provided."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteReview.isPending}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteReview.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />

              {deleteReview.isPending ? "Deleting..." : "Delete Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDeleteDialog;
