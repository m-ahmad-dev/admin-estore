import { CalendarDays, Mail, Phone, ShoppingBag } from "lucide-react";

import CustomerStatusBadge from "./CustomerStatusBadge.jsx";

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
};

const CustomerProfileCard = ({ customer }) => {
  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
          {customer.first_name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {fullName || "Unnamed customer"}
          </h3>

          <p className="mt-0.5 truncate text-sm text-slate-500">
            {customer.email}
          </p>

          <div className="mt-2">
            <CustomerStatusBadge isActive={customer.is_active} />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ShoppingBag size={16} />

            <span className="text-xs">Total orders</span>
          </div>

          <p className="mt-2 text-lg font-semibold text-slate-900">
            {customer.total_orders ?? 0}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 text-slate-400">
            <CalendarDays size={16} />

            <span className="text-xs">Joined</span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(customer.created_at)}
          </p>
        </div>
      </div>

      {/* Contact information */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Contact information
        </h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail size={17} className="mt-0.5 shrink-0 text-slate-400" />

            <div className="min-w-0">
              <p className="text-xs text-slate-400">Email</p>

              <p className="break-all text-sm text-slate-700">
                {customer.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={17} className="mt-0.5 shrink-0 text-slate-400" />

            <div>
              <p className="text-xs text-slate-400">Phone</p>

              <p className="text-sm text-slate-700">{customer.phone || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileCard;
