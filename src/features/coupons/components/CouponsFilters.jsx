import { Search, X } from "lucide-react";

const CouponsFilters = ({ filters, onChange, onReset }) => {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.type) ||
    filters.is_active !== "";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              onChange({
                search: event.target.value,
              })
            }
            placeholder="Search coupon code..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <select
          value={filters.type}
          onChange={(event) =>
            onChange({
              type: event.target.value,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="">All Types</option>

          <option value="PERCENTAGE">Percentage</option>

          <option value="FIXED">Fixed</option>
        </select>

        <select
          value={filters.is_active}
          onChange={(event) =>
            onChange({
              is_active: event.target.value,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="">All Statuses</option>

          <option value="true">Active</option>

          <option value="false">Inactive</option>
        </select>

        {hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <X size={16} />
            Reset
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default CouponsFilters;
