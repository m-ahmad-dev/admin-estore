import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useAuthorization } from "../hooks/useAuthorization";
import PageLoader from "../../../components/ui/PageLoader";

function PermissionRoute({ permission }) {
  const location = useLocation();

  const { status } = useAuth();
  const { can } = useAuthorization();

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

  if (!can(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default PermissionRoute;
