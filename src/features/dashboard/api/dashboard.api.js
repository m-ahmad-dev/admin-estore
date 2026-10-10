import api from "../../../lib/axios";

const DASHBOARD_BASE_URL = "/admin/dashboard";

const normalizePeriod = (period) => period || "today";

/**
 * Fetch the all-time/current dashboard overview.
 *
 * This endpoint does not accept a period query according to the backend.
 */
export const getDashboard = async () => {
  const response = await api.get(DASHBOARD_BASE_URL);

  return response.data;
};

/**
 * Fetch KPI statistics for the selected dashboard period.
 *
 * Supported backend periods:
 * - today
 * - 7d
 * - 30d
 * - last_year
 */
export const getDashboardStats = async ({ period = "today" } = {}) => {
  const response = await api.get(`${DASHBOARD_BASE_URL}/stats`, {
    params: {
      period: normalizePeriod(period),
    },
  });

  return response.data;
};

/**
 * Fetch chart datasets for the selected dashboard period.
 */
export const getDashboardCharts = async ({ period = "today" } = {}) => {
  const response = await api.get(`${DASHBOARD_BASE_URL}/charts`, {
    params: {
      period: normalizePeriod(period),
    },
  });

  return response.data;
};

/**
 * Fetch actionable dashboard alerts.
 *
 * This endpoint is not period-dependent in the backend.
 */
export const getDashboardAlerts = async () => {
  const response = await api.get(`${DASHBOARD_BASE_URL}/alerts`);

  return response.data;
};

/**
 * Fetch the latest dashboard activity.
 *
 * This endpoint is not period-dependent in the backend.
 */
export const getDashboardActivity = async () => {
  const response = await api.get(`${DASHBOARD_BASE_URL}/activity`);

  return response.data;
}