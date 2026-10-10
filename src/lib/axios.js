import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  notifySessionExpired,
  setAccessToken,
} from "../features/auth/services/tokenManager";

/**
 * Base URL resolution
 * - Set VITE_API_BASE_URL at BUILD time (Vite inlines it into the bundle).
 *   e.g. https://api.example.com/api/v1   or   /api/v1 (same-origin proxy)
 * - If it is missing we fall back to the same-origin "/api/v1", which is the
 *   recommended production setup (reverse proxy), instead of silently pointing
 *   a production build at localhost.
 */
const resolveBaseURL = () => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!raw) {
    if (!import.meta.env.DEV) {
      console.error(
        "[api] VITE_API_BASE_URL is not set. Falling back to same-origin /api/v1.",
      );
    }
    return "/api/v1";
  }

  return raw.replace(/\/+$/, "");
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  // Required so the browser sends/stores the httpOnly refresh-token cookie.
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints whose 401 means "bad credentials / no session", NOT "token expired".
// They must never trigger the refresh flow.
const AUTH_ENDPOINTS = ["/auth/admin/login", "/auth/admin/logout", "/refresh-token"];

const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/refresh-token")
      .then((response) => {
        const token = response.data?.accessToken;
        const admin = response.data?.admin;

        if (!token) {
          throw new Error("Refresh response did not contain an access token.");
        }

        setAccessToken(token);
        return { accessToken: token, admin };
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;

    if (
      !isUnauthorized ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      // Original error is preserved, e.g. "Invalid email or password" on login.
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      const status = refreshError?.response?.status;

      // Only end the session when the server really rejected the refresh token.
      // A network blip or timeout must not log the admin out.
      if (status === 401 || status === 403) {
        clearAccessToken();
        notifySessionExpired();
      }

      return Promise.reject(error);
    }
  },
);

export default api;
