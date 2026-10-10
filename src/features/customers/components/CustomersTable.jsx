import { Eye } from "lucide-react";
import CustomerStatusBadge from "./CustomerStatusBadge.jsx";

const CustomersTable = ({ customers, onViewCustomer }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-212.5 border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Phone
            </th>

            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Orders
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {customers.map((customer) => {
            const fullName = [customer.first_name, customer.last_name]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={customer.id} className="transition hover:bg-slate-50/60">
                {/* Customer */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {customer.first_name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {fullName || "Unnamed customer"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        ID: {customer.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {customer.email}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {customer.phone || "—"}
                  </span>
                </td>

                {/* Orders */}
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-medium text-slate-700">
                    {customer.total_orders ?? 0}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <CustomerStatusBadge isActive={customer.is_active} />
                </td>

                {/* Action */}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewCustomer(customer.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Eye size={15} />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
