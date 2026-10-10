import { ArrowDownAZ, ArrowUpAZ, Search, X } from "lucide-react";

const SORT_OPTIONS = [
  {
    value: "created_at",
    label: "Created date",
  },
  {
    value: "first_name",
    label: "First name",
  },
  {
    value: "last_name",
    label: "Last name",
  },
  {
    value: "email",
    label: "Email",
  },
];

const CustomerFilters = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
}) => {
  const hasSearch = Boolean(search);

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative w-full lg:max-w-sm">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search customers..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

        {hasSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          title={order === "asc" ? "Ascending" : "Descending"}
        >
          {order === "asc" ? (
            <ArrowUpAZ size={17} />
          ) : (
            <ArrowDownAZ size={17} />
          )}

          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
    </div>
  );
};

export default CustomerFilters;
