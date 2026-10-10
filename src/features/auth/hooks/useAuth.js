import { useSelector } from "react-redux";

export const useAuth = () => {
  const { admin, status, error } = useSelector((state) => state.auth);

  return {
    admin,
    status,
    error,

    isAuthenticated: status === "authenticated",
    isLoading: status === "initializing",
  };
};
