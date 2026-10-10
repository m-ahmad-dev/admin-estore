import {
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Crown,
  X,
} from "lucide-react";

import PermissionGate from "../../auth/components/PermissionGate";
import { PERMISSIONS } from "../../auth/authorization/permissions";

function MetricCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
      >
        <Icon size={19} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function AdminsPageHeader({
  metrics = { total: 0, active: 0, inactive: 0, owners: 0 },
  isFetching,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onRefresh,
  onCreate,
}) {
  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || roleFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onStatusFilterChange("all");
    onRoleFilterChange("all");
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ShieldCheck size={15} className="text-slate-700" />
            Administration & Access
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administrators
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage system administrators, update roles, and configure granular
            permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin text-slate-500" : ""}
            />
            Refresh
          </button>

          <PermissionGate permission={PERMISSIONS.ADMINS_CREATE}>
            <button
              type="button"
              onClick={onCreate}
              className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-xs transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <Plus size={16} />
              Create Admin
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <MetricCard
          icon={Users}
          label="Total Admins"
          value={metrics.total}
          colorClass="bg-slate-100 text-slate-700"
        />
        <MetricCard
          icon={UserCheck}
          label="Active Accounts"
          value={metrics.active}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          icon={UserX}
          label="Inactive Accounts"
          value={metrics.inactive}
          colorClass="bg-rose-50 text-rose-600"
        />
        <MetricCard
          icon={Crown}
          label="Owners"
          value={metrics.owners}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="h-9.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-9.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Role Select */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="h-9.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-xs outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owners Only</option>
            <option value="admin">Admins Only</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9.5 items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminsPageHeader;
