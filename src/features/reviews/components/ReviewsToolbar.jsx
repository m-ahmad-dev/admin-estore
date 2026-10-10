import { Search, SlidersHorizontal, X } from "lucide-react";

const LIMIT_OPTIONS = [10, 20, 50, 100];

const SELECT_BASE_CLASSES =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const ReviewsToolbar = ({ filters, onChange, onClear }) => {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    filters.rating !== "" ||
    Boolean(filters.product_id) ||
    Boolean(filters.customer_id) ||
    filters.sort !== "created_at" ||
    filters.order !== "desc" ||
    filters.limit !== 20;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Primary filters */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) => onChange("search", event.target.value)}
              placeholder="Search review text, title, or indexed content..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {filters.search && (
              <button
                type="button"
                onClick={() => onChange("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
                value={filters.status}
                onChange={(event) => onChange("status", event.target.value)}
                className={SELECT_BASE_CLASSES}
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <select
              value={filters.rating}
              onChange={(event) => onChange("rating", event.target.value)}
              className={SELECT_BASE_CLASSES}
            >
              <option value="">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>

            <select
              value={filters.sort}
              onChange={(event) => onChange("sort", event.target.value)}
              className={SELECT_BASE_CLASSES}
            >
              <option value="created_at">Newest</option>
              <option value="rating">Rating</option>
              <option value="helpful_count">Helpful votes</option>
            </select>

            <select
              value={filters.order}
              onChange={(event) => onChange("order", event.target.value)}
              className={SELECT_BASE_CLASSES}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <select
              value={filters.limit}
              onChange={(event) =>
                onChange("limit", Number(event.target.value))
              }
              className={SELECT_BASE_CLASSES}
            >
              {LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Show {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced ID filters */}
        <div className="grid gap-3 lg:grid-cols-2">
          <input
            type="text"
            value={filters.product_id}
            onChange={(event) => onChange("product_id", event.target.value)}
            placeholder="Filter by product UUID..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <input
            type="text"
            value={filters.customer_id}
            onChange={(event) => onChange("customer_id", event.target.value)}
            placeholder="Filter by customer UUID..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {hasFilters && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X size={15} />
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsToolbar;
