import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PageLoader from "../ui/PageLoader";

function RootRedirect() {
  const status = useSelector((state) => state.auth.status);

  if (status === "initializing") {
    return <PageLoader message="Checking your session..." />;
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default RootRedirect;
