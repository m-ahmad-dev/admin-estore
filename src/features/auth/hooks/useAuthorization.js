import { useSelector } from "react-redux";

import {
  isOwner,
  isAdmin,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "../authorization/authorization";

export const useAuthorization = () => {
  const admin = useSelector((state) => state.auth.admin);

  return {
    admin,

    role: admin?.role ?? null,

    isOwner: isOwner(admin),
    isAdmin: isAdmin(admin),

    can: (permission) => hasPermission(admin, permission),
    canAny: (permissions) => hasAnyPermission(admin, permissions),
    canAll: (permissions) => hasAllPermissions(admin, permissions),
  };
};
