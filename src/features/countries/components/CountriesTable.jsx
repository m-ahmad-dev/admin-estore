// src/features/countries/components/CountriesTable.jsx
import { useState } from "react";
import CountryStatusBadge from "./CountryStatusBadge";
import { useAuthorization } from "../../auth/hooks/useAuthorization";
import { useToggleCountryStatus } from "../hooks/useCountryMutations";
import PERMISSIONS from "../../auth/authorization/permissions";

const CountriesTable = ({ countries = [], isLoading }) => {
  const { can } = useAuthorization(); // ✅ use "can" instead of "hasPermission"
  const canEdit = can(PERMISSIONS.COUNTRIES_EDIT);
  const toggleStatus = useToggleCountryStatus();
  const [togglingId, setTogglingId] = useState(null);

  const handleToggle = (country) => {
    if (!canEdit) return;

    const newStatus = !country.is_active;
    const action = newStatus ? "activate" : "deactivate";
    const confirmMsg = `Are you sure you want to ${action} "${country.name}"?`;

    if (window.confirm(confirmMsg)) {
      setTogglingId(country.id);
      toggleStatus.mutate(
        { id: country.id, is_active: newStatus },
        {
          onSettled: () => setTogglingId(null),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading countries…</div>
    );
  }

  if (!countries.length) {
    return (
      <div className="text-center py-8 text-gray-500">No countries found.</div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flag
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ISO2
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ISO3
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            {canEdit && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Toggle
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {countries.map((country) => (
            <tr key={country.id}>
              <td className="px-6 py-4 whitespace-nowrap text-lg">
                {country.flag_emoji || "🏳️"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {country.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {country.code.iso2}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {country.code.iso3}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {country.phone_code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {country.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CountryStatusBadge isActive={country.is_active} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(country.updated_at).toLocaleDateString()}
              </td>
              {canEdit && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={country.is_active}
                      onChange={() => handleToggle(country)}
                      disabled={togglingId === country.id}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-2 text-xs text-gray-500">
                      {togglingId === country.id ? "…" : ""}
                    </span>
                  </label>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;
