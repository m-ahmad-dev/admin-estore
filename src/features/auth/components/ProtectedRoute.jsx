import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../../../components/ui/PageLoader";

function ProtectedRoute() {
  const location = useLocation();

  const { status } = useAuth();

  if (status === "initializing") {
    return <PageLoader message="Checking your session..." />;
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
