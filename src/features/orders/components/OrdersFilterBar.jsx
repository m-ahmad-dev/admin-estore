import { Search, RotateCcw } from "lucide-react";
import { orderStatusEnum, paymentStatusEnum } from "../schemas/order.schema";

const PAYMENT_METHODS = [
  { label: "Cash on Delivery", value: "CASH_ON_DELIVERY" },
  { label: "Card", value: "CARD" },
];

export const OrdersFilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
      {/* Top Row: Search & Reset */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-70">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search || ""}
            onChange={onFilterChange}
            placeholder="Search order number, customer name, email..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

      {/* Grid Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {/* Order Status */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Order Status
          </label>
          <select
            name="status"
            value={filters.status || ""}
            onChange={onFilterChange}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300 bg-white"
          >
            <option value="">All Statuses</option>
            {orderStatusEnum.options.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Payment Status
          </label>
          <select
            name="payment_status"
            value={filters.payment_status || ""}
            onChange={onFilterChange}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300 bg-white"
          >
            <option value="">All Payment Statuses</option>
            {paymentStatusEnum.options.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Payment Method
          </label>
          <select
            name="payment_method"
            value={filters.payment_method || ""}
            onChange={onFilterChange}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300 bg-white"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="from_date"
            value={filters.from_date || ""}
            onChange={onFilterChange}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="to_date"
            value={filters.to_date || ""}
            onChange={onFilterChange}
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
          />
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Min Amount ($)
          </label>
          <input
            type="number"
            name="min_amount"
            value={filters.min_amount || ""}
            onChange={onFilterChange}
            placeholder="0"
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Max Amount ($)
          </label>
          <input
            type="number"
            name="max_amount"
            value={filters.max_amount || ""}
            onChange={onFilterChange}
            placeholder="1000"
            className="w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none border-slate-300"
          />
        </div>
      </div>
    </div>
  );
};
