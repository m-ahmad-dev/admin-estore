const CountriesToolbar = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange("search", e.target.value);
  };

  const handleActiveFilterChange = (e) => {
    const val = e.target.value;
    onFilterChange("is_active", val === "" ? undefined : val === "true");
  };

  const handleOrderChange = (e) => {
    onFilterChange("order", e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <div className="flex-1 min-w-50">
        <input
          type="text"
          placeholder="Search by name or code…"
          value={filters.search || ""}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <select
          value={
            filters.is_active === undefined ? "" : String(filters.is_active)
          }
          onChange={handleActiveFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <div>
        <select
          value={filters.order || "asc"}
          onChange={handleOrderChange}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="asc">Name A–Z</option>
          <option value="desc">Name Z–A</option>
        </select>
      </div>
    </div>
  );
};

export default CountriesToolbar;
