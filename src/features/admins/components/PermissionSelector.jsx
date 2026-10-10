import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

const permissionGroups = [
  { label: "Admin Management", prefix: "ADMINS_" },
  { label: "Dashboard", prefix: "DASHBOARD_" },
  { label: "Products", prefix: "PRODUCTS_" },
  { label: "Categories", prefix: "CATEGORIES_" },
  { label: "Countries", prefix: "COUNTRIES_" },
  { label: "Coupons", prefix: "COUPONS_" },
  { label: "Customers", prefix: "CUSTOMERS_" },
  { label: "Orders", prefix: "ORDERS_" },
  { label: "Reviews", prefix: "REVIEWS_" },
  { label: "Other Permissions", prefix: null },
];

const formatPermission = (permission) => {
  return permission
    .split(".")
    .map((part) =>
      part.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    )
    .join(" ");
};

function PermissionSelector({
  permissions = [],
  permissionEntries = [],
  onChange,
  disabled = false,
}) {
  const [filterText, setFilterText] = useState("");
  const selected = useMemo(() => new Set(permissions), [permissions]);

  const knownPrefixes = useMemo(
    () => permissionGroups.map((g) => g.prefix).filter(Boolean),
    [],
  );

  const togglePermission = (permission) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(permission)) {
      next.delete(permission);
    } else {
      next.add(permission);
    }
    onChange(Array.from(next));
  };

  const selectGroup = (entries) => {
    if (disabled) return;
    const next = new Set(selected);
    const everySelected = entries.every(({ value }) => next.has(value));

    entries.forEach(({ value }) => {
      if (everySelected) {
        next.delete(value);
      } else {
        next.add(value);
      }
    });

    onChange(Array.from(next));
  };

  return (
    <div className="space-y-5">
      {/* Search within permissions */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter permissions list..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
        />
      </div>

      <div className="space-y-6">
        {permissionGroups.map((group) => {
          const entries = permissionEntries.filter((entry) => {
            // Fix categorization logic
            const matchesGroup = group.prefix
              ? entry.key.startsWith(group.prefix)
              : !knownPrefixes.some((p) => entry.key.startsWith(p));

            if (!matchesGroup) return false;
            if (!filterText.trim()) return true;

            const text = filterText.toLowerCase();
            return (
              entry.key.toLowerCase().includes(text) ||
              entry.value.toLowerCase().includes(text)
            );
          });

          if (!entries.length) return null;

          const selectedInGroupCount = entries.filter(({ value }) =>
            selected.has(value),
          ).length;
          const allSelected = selectedInGroupCount === entries.length;

          return (
            <div
              key={group.label}
              className="rounded-xl border border-slate-200/80 bg-slate-50/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {group.label}
                  </h4>
                  <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {selectedInGroupCount}/{entries.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => selectGroup(entries)}
                  disabled={disabled}
                  className="text-xs font-semibold text-slate-600 transition hover:text-slate-900 disabled:opacity-50"
                >
                  {allSelected ? "Deselect Group" : "Select Group"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {entries.map((entry) => {
                  const isSelected = selected.has(entry.value);

                  return (
                    <button
                      key={entry.value}
                      type="button"
                      onClick={() => togglePermission(entry.value)}
                      disabled={disabled}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-slate-900 bg-white shadow-xs ring-1 ring-slate-900/5"
                          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span
                        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </span>

                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-slate-900">
                          {formatPermission(entry.value)}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-500 font-mono">
                          {entry.value}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PermissionSelector;
