import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logoutAdmin } from "../api/auth.api";
import { setUnauthenticated } from "../authSlice";
import { clearAccessToken } from "../services/tokenManager";
import { clearStoredAdmin } from "../services/adminStorage";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSettled: () => {
      clearAccessToken();
      clearStoredAdmin();
      dispatch(setUnauthenticated());
      navigate("/login", { replace: true });
    },
    onSuccess: () => {
      toast.success("Signed out successfully.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Local session cleared.";
      toast.error(message);
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
};
