import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { refreshAccessToken } from "../../../lib/axios";
import {
  setAuthInitializing,
  setCredentials,
  setUnauthenticated,
} from "../authSlice";
import { clearAccessToken, onSessionExpired } from "../services/tokenManager";
import {
  clearStoredAdmin,
  getStoredAdmin,
  setStoredAdmin,
} from "../services/adminStorage";

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();

  // If a request fails and the refresh token is rejected, drop the session so
  // ProtectedRoute sends the admin to /login instead of leaving a broken UI
  // where every route returns 401.
  useEffect(() => {
    return onSessionExpired(() => {
      clearAccessToken();
      clearStoredAdmin();
      dispatch(setUnauthenticated());
      toast.error("Your session has expired. Please sign in again.");
    });
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      dispatch(setAuthInitializing());

      try {
        const { admin: refreshedAdmin } = await refreshAccessToken();

        if (cancelled) return;

        const activeAdmin = refreshedAdmin || getStoredAdmin();

        if (activeAdmin) {
          setStoredAdmin(activeAdmin);
          dispatch(setCredentials(activeAdmin));
          return;
        }

        clearAccessToken();
        clearStoredAdmin();
        dispatch(setUnauthenticated());
      } catch {
        if (cancelled) return;
        clearAccessToken();
        clearStoredAdmin();
        dispatch(setUnauthenticated());
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
};
