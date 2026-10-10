import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, X } from "lucide-react";

import { useReviewMutations } from "../hooks/useReviewMutations.js";

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
    description: "Return the review to the moderation queue.",
    icon: Clock3,
  },
  {
    value: "APPROVED",
    label: "Approved",
    description: "Publish the review as an approved customer review.",
    icon: CheckCircle2,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    description: "Reject the review and store a moderation reason.",
    icon: AlertTriangle,
  },
];

const ReviewStatusForm = ({ review, onClose }) => {
  const [status, setStatus] = useState(review?.status || "PENDING");
  const [rejectionReason, setRejectionReason] = useState(
    review?.status === "REJECTED" ? review?.rejection_reason || "" : "",
  );
  const [error, setError] = useState("");

  const { updateReviewStatus } = useReviewMutations();

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedReason = rejectionReason.trim();

    if (!status) {
      setError("Please select a status.");
      return;
    }

    if (status === "REJECTED" && !normalizedReason) {
      setError("Rejection reason is required when rejecting a review.");
      return;
    }

    if (status === "REJECTED" && normalizedReason.length > 500) {
      setError("Rejection reason cannot exceed 500 characters.");
      return;
    }

    setError("");

    updateReviewStatus.mutate(
      {
        reviewId: review.id,
        status,
        rejection_reason: normalizedReason,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (updateReviewStatus.isPending ? null : onClose())}
      />

      <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4">
        <form
          onSubmit={handleSubmit}
          className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Update Review Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review:{" "}
                <span className="font-medium text-slate-700">
                  {review.title || "Untitled review"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={updateReviewStatus.isPending}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Review status
              </label>

              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = status === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatus(option.value);
                        setError("");

                        if (option.value !== "REJECTED") {
                          setRejectionReason("");
                        }
                      }}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 rounded-lg p-2 ${
                          selected
                            ? "bg-white text-indigo-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {option.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {status === "REJECTED" && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="rejection_reason"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Rejection reason
                  </label>

                  <span className="text-xs text-slate-400">
                    {rejectionReason.length}/500
                  </span>
                </div>

                <textarea
                  id="rejection_reason"
                  value={rejectionReason}
                  onChange={(event) => {
                    setRejectionReason(event.target.value);
                    setError("");
                  }}
                  rows={5}
                  maxLength={500}
                  placeholder="Explain why this review is being rejected..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={updateReviewStatus.isPending}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateReviewStatus.isPending}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateReviewStatus.isPending ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewStatusModal = ({ review, open, onClose }) => {
  if (!open || !review) {
    return null;
  }

  return <ReviewStatusForm key={review.id} review={review} onClose={onClose} />;
};

export default ReviewStatusModal;
