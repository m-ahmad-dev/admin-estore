import { ArrowDown, ArrowUp, Search, SlidersHorizontal } from "lucide-react";

export default function ProductsToolbar({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  includeDeleted,
  onIncludeDeletedChange,
  sort,
  onSortChange,
  order,
  onToggleOrder,
  limit,
  onLimitChange,
}) {
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <SlidersHorizontal size={14} />
            Filters
          </div>

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(event) => onIncludeDeletedChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Deleted</span>
          </label>

          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="created_at">Created date</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>

          <button
            type="button"
            onClick={onToggleOrder}
            title={`Sort ${order === "asc" ? "descending" : "ascending"}`}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>

          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
