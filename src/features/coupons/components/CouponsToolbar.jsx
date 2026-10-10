import { Search, SlidersHorizontal, X } from "lucide-react";

const LIMIT_OPTIONS = [10, 20, 50, 100];
const SELECT_BASE_CLASSES =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function CouponsToolbar({
  search,
  isActive,
  type,
  limit,
  onSearchChange,
  onActiveChange,
  onTypeChange,
  onLimitChange,
  onClearFilters,
}) {
  const hasFilters =
    Boolean(search) || isActive !== "" || type !== "" || limit !== 10;

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400" />

            <select
              value={isActive}
              onChange={(e) => onActiveChange(e.target.value)}
              className={SELECT_BASE_CLASSES}
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className={SELECT_BASE_CLASSES}
          >
            <option value="">All types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>

          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className={SELECT_BASE_CLASSES}
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                Show {opt}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
