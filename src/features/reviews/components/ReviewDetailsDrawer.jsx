import {
  Calendar,
  CheckCircle2,
  Clock3,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  User,
  X,
} from "lucide-react";

import { useReview } from "../hooks/useReview.js";

import ReviewStatusBadge from "./ReviewStatusBadge.jsx";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};

const formatCustomerName = (customer) => {
  if (!customer) {
    return "Unknown customer";
  }

  return (
    [customer.first_name, customer.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown customer"
  );
};

const RatingDisplay = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
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

const InfoRow = ({ icon, label, children }) => {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 p-4">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className="mt-1 text-sm font-medium text-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
};

const ReviewDetailsDrawer = ({ reviewId, open, onClose }) => {
  const { data, isLoading, isFetching, isError } = useReview(reviewId, {
    enabled: open && Boolean(reviewId),
  });

  if (!open || !reviewId) {
    return null;
  }

  const review = data?.review || data?.data?.review;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="truncate text-lg font-semibold text-slate-900">
                Review Details
              </h2>

              {review?.status && <ReviewStatusBadge status={review.status} />}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Full review, customer, product, and order information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading || isFetching ? (
            <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              Loading review details...
            </div>
          ) : isError || !review ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
              <h3 className="font-semibold text-rose-800">
                Unable to load review
              </h3>

              <p className="mt-1 text-sm text-rose-600">
                The review could not be retrieved.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review content */}
              <section>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Review
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {review.title || "Untitled review"}
                      </h3>
                    </div>

                    {review.verified_purchase && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        <ShieldCheck size={14} />
                        Verified purchase
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <RatingDisplay rating={review.rating} />
                  </div>

                  <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Customer */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Customer
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={<User size={18} />} label="Id">
                  <p>{review.customer.id}</p>
                  </InfoRow>

                  <InfoRow icon={<User size={18} />} label="Name">
                    {formatCustomerName(review.customer)}
                  </InfoRow>

                  <InfoRow icon={<Mail size={18} />} label="Email">
                    {review.customer?.email || "—"}
                  </InfoRow>

                </div>
              </section>

              {/* Product */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Product
                </h3>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-4">
                    {review.product?.image ? (
                      <img
                        src={review.product.image}
                        alt={review.product?.name || "Product"}
                        className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                        No image
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {review.product?.name || "Unknown product"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {review.product?.slug || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Product ID: {review.product?.id || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Order
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow
                    icon={<ShoppingBag size={18} />}
                    label="Order Number"
                  >
                    {review.order?.order_number || "—"}
                  </InfoRow>

                  <InfoRow icon={<Package size={18} />} label="Order Status">
                    {review.order?.status || "—"}
                  </InfoRow>

                  <InfoRow icon={<Calendar size={18} />} label="Placed At">
                    {formatDate(review.order?.placed_at)}
                  </InfoRow>

                  <InfoRow icon={<Clock3 size={18} />} label="Review Created">
                    {formatDate(review.created_at)}
                  </InfoRow>
                </div>
              </section>

              {/* Moderation */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Moderation
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={<CheckCircle2 size={18} />} label="Status">
                    <ReviewStatusBadge status={review.status} />
                  </InfoRow>

                  <InfoRow icon={<Calendar size={18} />} label="Approved At">
                    {formatDate(review.approved_at)}
                  </InfoRow>
                </div>

                {review.status === "REJECTED" && (
                  <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                      Rejection reason
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-rose-800">
                      {review.rejection_reason ||
                        "No rejection reason provided."}
                    </p>
                  </div>
                )}
              </section>

              {/* Metadata */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Metadata
                </h3>

                <div className="space-y-3">
                  <InfoRow icon={<Calendar size={18} />} label="Created At">
                    {formatDate(review.created_at)}
                  </InfoRow>

                  <InfoRow icon={<Clock3 size={18} />} label="Updated At">
                    {formatDate(review.updated_at)}
                  </InfoRow>
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ReviewDetailsDrawer;
