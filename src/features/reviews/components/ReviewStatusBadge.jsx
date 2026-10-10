const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dotClassName: "bg-amber-500",
  },

  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dotClassName: "bg-emerald-500",
  },

  REJECTED: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dotClassName: "bg-rose-500",
  },
};

const ReviewStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toUpperCase();

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    dotClassName: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />

      {config.label}
    </span>
  );
};

export default ReviewStatusBadge;
