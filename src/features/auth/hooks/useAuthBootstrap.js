import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "../../../lib/axios";
import {
  setAuthInitializing,
  setCredentials,
  setUnauthenticated,
} from "../authSlice";
import { clearAccessToken } from "../services/tokenManager";
import {
  clearStoredAdmin,
  getStoredAdmin,
  setStoredAdmin,
} from "../services/adminStorage";

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();

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
