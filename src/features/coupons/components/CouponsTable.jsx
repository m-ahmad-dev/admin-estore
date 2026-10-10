import { Eye, Pencil } from "lucide-react";

import CouponStatusBadge from "./CouponStatusBadge.jsx";

const formatDiscount = (coupon) => {
  if (coupon.type === "PERCENTAGE") {
    return `${coupon.value}%`;
  }

  return Number(coupon.value).toFixed(2);
};

const formatDate = (value) => {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
};

const CouponsTable = ({ coupons, loading, onView, onEdit, canEdit = true }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading coupons...
      </div>
    );
  }

  if (!coupons.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h3 className="font-medium text-gray-900">No coupons found</h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your filters or create a new coupon.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Coupon
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Discount
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Usage
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Validity
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(coupon)}
                    className="text-left"
                  >
                    <p className="font-semibold text-gray-900">{coupon.code}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      {coupon.type === "PERCENTAGE"
                        ? "Percentage"
                        : "Fixed amount"}
                    </p>
                  </button>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {formatDiscount(coupon)}
                  </p>

                  {coupon.type === "PERCENTAGE" &&
                    coupon.max_discount !== null &&
                    coupon.max_discount !== undefined && (
                      <p className="mt-1 text-xs text-gray-500">
                        Max {Number(coupon.max_discount).toFixed(2)}
                      </p>
                    )}
                </td>

                <td className="px-5 py-4 text-sm text-gray-700">
                  {coupon.used_count ?? 0}
                  {" / "}
                  {coupon.max_uses ?? "∞"}
                </td>

                <td className="px-5 py-4 text-sm text-gray-700">
                  <div>
                    <span>{formatDate(coupon.starts_at)}</span>

                    <span className="mx-1 text-gray-400">→</span>

                    <span>{formatDate(coupon.expires_at)}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <CouponStatusBadge isActive={coupon.is_active} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(coupon)}
                      title="View coupon"
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Eye size={17} />
                    </button>

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(coupon)}
                        title="Edit coupon"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Pencil size={17} />
                      </button>
                    )}
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

export default CouponsTable;
