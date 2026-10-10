import { useCallback, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import {
  getDashboard,
  getDashboardActivity,
  getDashboardAlerts,
  getDashboardCharts,
  getDashboardStats,
} from "../api/dashboard.api";

export const DASHBOARD_PERIODS = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
  {
    value: "last_year",
    label: "Last year",
  },
];

const DEFAULT_PERIOD = "today";

const dashboardKeys = {
  all: ["dashboard"],

  overview: () => [...dashboardKeys.all, "overview"],

  stats: (period) => [...dashboardKeys.all, "stats", period],

  charts: (period) => [...dashboardKeys.all, "charts", period],

  alerts: () => [...dashboardKeys.all, "alerts"],

  activity: () => [...dashboardKeys.all, "activity"],
};

export const useDashboard = () => {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  const queries = useQueries({
    queries: [
      {
        queryKey: dashboardKeys.overview(),
        queryFn: getDashboard,
        staleTime: 60_000,
      },

      {
        queryKey: dashboardKeys.stats(period),
        queryFn: () => getDashboardStats({ period }),
        staleTime: 60_000,
      },

      {
        queryKey: dashboardKeys.charts(period),
        queryFn: () => getDashboardCharts({ period }),
        staleTime: 60_000,
      },

      {
        queryKey: dashboardKeys.alerts(),
        queryFn: getDashboardAlerts,
        staleTime: 60_000,
      },

      {
        queryKey: dashboardKeys.activity(),
        queryFn: getDashboardActivity,
        staleTime: 30_000,
      },
    ],
  });

  const [overviewQuery, statsQuery, chartsQuery, alertsQuery, activityQuery] =
    queries;

  const overview = overviewQuery.data?.data ?? null;
  const stats = statsQuery.data?.data ?? null;
  const charts = chartsQuery.data?.data ?? null;
  const alerts = alertsQuery.data?.data?.alerts ?? [];
  const activities = activityQuery.data?.data?.activities ?? [];

  const isInitialLoading = queries.some((query) => query.isLoading);

  const isFetching = queries.some((query) => query.isFetching);

  const hasError = queries.some((query) => query.isError);

  const hasCriticalError = overviewQuery.isError && chartsQuery.isError;

  const errors = useMemo(
    () => ({
      overview: overviewQuery.error,
      stats: statsQuery.error,
      charts: chartsQuery.error,
      alerts: alertsQuery.error,
      activity: activityQuery.error,
    }),
    [
      overviewQuery.error,
      statsQuery.error,
      chartsQuery.error,
      alertsQuery.error,
      activityQuery.error,
    ],
  );

  const refetch = useCallback(
    () => Promise.all(queries.map((query) => query.refetch())),
    [queries],
  );

  return {
    period,
    setPeriod,

    periods: DASHBOARD_PERIODS,

    overview,
    stats,
    charts,
    alerts,
    activities,

    isLoading: isInitialLoading,
    isFetching,

    hasError,
    hasCriticalError,

    errors,

    overviewError: overviewQuery.error,
    statsError: statsQuery.error,
    chartsError: chartsQuery.error,
    alertsError: alertsQuery.error,
    activityError: activityQuery.error,

    refetch,
  };
};

export { dashboardKeys };
