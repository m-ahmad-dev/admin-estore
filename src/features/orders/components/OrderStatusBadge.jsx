const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  PROCESSING: "bg-indigo-100 text-indigo-800 border-indigo-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-300",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-300",
  UNPAID: "bg-rose-100 text-rose-800 border-rose-300",
};

export const OrderStatusBadge = ({ status }) => {
  const style =
    STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-300";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      {status}
    </span>
  );
};
