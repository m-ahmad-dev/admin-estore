import {
  X,
  Calendar,
  Clock,
  Hash,
  Percent,
  DollarSign,
  Users,
} from "lucide-react";

import CouponStatusBadge from "./CouponStatusBadge.jsx";

const formatMoney = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toFixed(2);
};

const formatDate = (value) => {
  if (!value) {
    return "Unlimited";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};

const CouponDetailsDrawer = ({ coupon, open, onClose }) => {
  if (!open || !coupon) {
    return null;
  }

  const isPercentage = coupon.type === "PERCENTAGE";

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {coupon.code}
              </h2>

              <CouponStatusBadge isActive={coupon.is_active} />
            </div>

            <p className="mt-1 text-sm text-gray-500">Coupon details</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Hash size={18} />}
              label="Code"
              value={coupon.code}
            />

            <InfoCard
              icon={
                isPercentage ? <Percent size={18} /> : <DollarSign size={18} />
              }
              label="Discount"
              value={
                isPercentage ? `${coupon.value}%` : formatMoney(coupon.value)
              }
            />

            <InfoCard
              icon={<DollarSign size={18} />}
              label="Minimum Order"
              value={formatMoney(coupon.min_order_value)}
            />

            <InfoCard
              icon={<DollarSign size={18} />}
              label="Maximum Discount"
              value={
                isPercentage
                  ? formatMoney(coupon.max_discount)
                  : "Not applicable"
              }
            />

            <InfoCard
              icon={<Users size={18} />}
              label="Usage"
              value={
                coupon.max_uses === null || coupon.max_uses === undefined
                  ? `${coupon.used_count ?? 0} / Unlimited`
                  : `${coupon.used_count ?? 0} / ${coupon.max_uses}`
              }
            />

            <InfoCard
              icon={<Calendar size={18} />}
              label="Starts At"
              value={formatDate(coupon.starts_at)}
            />

            <InfoCard
              icon={<Clock size={18} />}
              label="Expires At"
              value={formatDate(coupon.expires_at)}
            />

            <InfoCard
              icon={<Calendar size={18} />}
              label="Created At"
              value={formatDate(coupon.created_at)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="wrap-break-word text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default CouponDetailsDrawer;
