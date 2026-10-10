export function AdminRoleBadge({ role }) {
  const isOwner = role === "owner";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium border ${
        isOwner
          ? "bg-amber-50 text-amber-700 border-amber-200/80"
          : "bg-slate-100 text-slate-700 border-slate-200/80"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOwner ? "bg-amber-500" : "bg-slate-400"
        }`}
      />
      {isOwner ? "Owner" : "Administrator"}
    </span>
  );
}

function AdminStatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
          : "bg-rose-50 text-rose-700 border-rose-200/80"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default AdminStatusBadge;
