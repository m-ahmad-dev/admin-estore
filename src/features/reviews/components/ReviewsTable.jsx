import {
  CheckCircle2,
  Eye,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import ReviewStatusBadge from "./ReviewStatusBadge.jsx";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
};

const formatCustomerName = (customer) => {
  if (!customer) {
    return "Unknown customer";
  }

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unknown customer";
};

const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= Number(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
};

const ReviewsTable = ({
  reviews,
  loading,
  onView,
  onChangeStatus,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading reviews...
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-900">No reviews found</h3>

        <p className="mt-1 text-sm text-slate-500">
          Try changing the filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Review</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Created</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* Review */}
                <td className="max-w-[320px] px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(review.id)}
                    className="block text-left"
                  >
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {review.title || "Untitled review"}
                      </p>

                      {review.verified_purchase && (
                        <span title="Verified purchase" className="shrink-0">
                          <ShieldCheck size={15} className="text-emerald-600" />
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {review.comment || "No comment provided."}
                    </p>
                  </button>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-800">
                      {formatCustomerName(review.customer)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {review.customer?.email || "No email"}
                    </p>
                  </div>
                </td>

                {/* Product */}
                <td className="max-w-60 px-5 py-4">
                  <div className="flex items-center gap-3">
                    {review.product?.image ? (
                      <img
                        src={review.product.image}
                        alt={review.product?.name || "Product"}
                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[10px] font-medium text-slate-400">
                        N/A
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">
                        {review.product?.name || "Unknown product"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {review.product?.slug || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <RatingStars rating={review.rating} />

                    <span className="text-xs font-medium text-slate-500">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <ReviewStatusBadge status={review.status} />
                </td>

                {/* Created */}
                <td className="px-5 py-4 text-xs text-slate-500">
                  {formatDate(review.created_at)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <PermissionGate permission={PERMISSIONS.REVIEWS_VIEW}>
                      <button
                        type="button"
                        onClick={() => onView(review.id)}
                        title="View review"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Eye size={17} />
                      </button>
                    </PermissionGate>

                    <PermissionGate permission={PERMISSIONS.REVIEWS_EDIT}>
                      <button
                        type="button"
                        onClick={() => onChangeStatus(review)}
                        title="Moderate review"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-amber-600"
                      >
                        {review.status === "APPROVED" ? (
                          <CheckCircle2 size={17} />
                        ) : (
                          <Pencil size={17} />
                        )}
                      </button>
                    </PermissionGate>

                    <PermissionGate permission={PERMISSIONS.REVIEWS_DELETE}>
                      <button
                        type="button"
                        onClick={() => onDelete(review)}
                        title="Delete review"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
