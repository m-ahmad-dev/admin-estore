import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import PermissionGate from "../../auth/components/PermissionGate.jsx";
import { PERMISSIONS } from "../../auth/authorization/permissions.js";

import DashboardAlerts from "../components/DashboardAlerts.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import OrderStatusChart from "../components/OrderStatusChart.jsx";
import OrdersCustomersChart from "../components/OrdersCustomersChart.jsx";
import PaymentMethodsChart from "../components/PaymentMethodsChart.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import RevenueChart from "../components/RevenueChart.jsx";

import { useDashboard } from "../hooks/useDashboard.js";

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 ${className}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-9 w-72 max-w-full" />
        <SkeletonBlock className="h-4 w-136 max-w-full" />

        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-28" />
          <SkeletonBlock className="h-9 w-28" />
          <SkeletonBlock className="h-9 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-28" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SkeletonBlock className="h-80 xl:col-span-7" />
        <SkeletonBlock className="h-80 xl:col-span-5" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SkeletonBlock className="h-80 xl:col-span-5" />
        <SkeletonBlock className="h-80 xl:col-span-7" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SkeletonBlock className="h-96 xl:col-span-5" />
        <SkeletonBlock className="h-96 xl:col-span-7" />
      </div>
    </div>
  );
}

function DashboardError({ onRetry }) {
  return (
    <div className="flex min-h-105 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle size={22} />
        </div>

        <h2 className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          The dashboard could not retrieve its core data. Check your connection
          and try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </div>
  );
}

function DashboardSectionError({ message }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-zinc-200 px-5 dark:border-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}

function DashboardPage() {
  const {
    period,
    setPeriod,
    periods,
    overview,
    stats,
    charts,
    alerts,
    activities,
    isLoading,
    isFetching,
    hasCriticalError,
    errors,
    refetch,
  } = useDashboard();

  useEffect(() => {
    const error =
      errors.overview ??
      errors.charts ??
      errors.stats ??
      errors.alerts ??
      errors.activity;

    if (!error) {
      return;
    }

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Some dashboard data could not be loaded.",
    );
  }, [
    errors.overview,
    errors.charts,
    errors.stats,
    errors.alerts,
    errors.activity,
  ]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Dashboard refreshed.");
    } catch {
      toast.error("Failed to refresh dashboard.");
    }
  };

  if (isLoading && !overview && !charts) {
    return <DashboardSkeleton />;
  }

  if (hasCriticalError && !overview && !charts) {
    return <DashboardError onRetry={handleRefresh} />;
  }

  const periodLabel =
    periods.find((item) => item.value === period)?.label ?? "Today";

  return (
    <PermissionGate permission={PERMISSIONS.DASHBOARD_VIEW}>
      <div className="min-w-0 space-y-6 bg-slate-50/70 pb-10">
        <DashboardHeader
          period={period}
          periods={periods}
          onPeriodChange={setPeriod}
          isFetching={isFetching}
          onRefresh={handleRefresh}
        />

        <DashboardStats
          overview={overview}
          stats={stats}
          periodLabel={periodLabel}
        />

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-7">
            {errors.charts ? (
              <DashboardSectionError message="Revenue data could not be loaded." />
            ) : (
              <RevenueChart data={charts} />
            )}
          </div>

          <div className="min-w-0 xl:col-span-5">
            {errors.charts ? (
              <DashboardSectionError message="Order/customer data could not be loaded." />
            ) : (
              <OrdersCustomersChart data={charts} />
            )}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-5">
            {errors.charts ? (
              <DashboardSectionError message="Payment data could not be loaded." />
            ) : (
              <PaymentMethodsChart data={charts} />
            )}
          </div>

          <div className="min-w-0 xl:col-span-7">
            {errors.charts ? (
              <DashboardSectionError message="Order status data could not be loaded." />
            ) : (
              <OrderStatusChart data={charts} />
            )}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-5">
            {errors.alerts ? (
              <DashboardSectionError message="Alerts could not be loaded." />
            ) : (
              <DashboardAlerts alerts={alerts} />
            )}
          </div>

          <div className="min-w-0 xl:col-span-7">
            {errors.activity ? (
              <DashboardSectionError message="Recent activity could not be loaded." />
            ) : (
              <RecentActivity activities={activities} />
            )}
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}

export default DashboardPage;
