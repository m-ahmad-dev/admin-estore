import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Plus,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

const formatCurrentDate = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

function DashboardHeader({
  period,
  periods,
  onPeriodChange,
  isFetching,
  onRefresh,
}) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-linear-to from-white via-white to-indigo-50/60 p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Overview
            </span>

            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={13} />
              {formatCurrentDate()}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {getGreeting()}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Here&apos;s what&apos;s happening across your store. Keep track of
            sales, orders, customers and operational activity.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <select
              value={period}
              onChange={(event) => onPeriodChange(event.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-36"
              aria-label="Dashboard date range"
            >
              {periods.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/products"
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
        >
          <Plus size={14} />
          Add product
        </Link>

        <Link
          to="/orders"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ShoppingBag size={14} />
          View orders
        </Link>

        <Link
          to="/reviews"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ClipboardList size={14} />
          Moderate reviews
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;
