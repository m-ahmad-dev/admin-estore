import { useAuthorization } from "../hooks/useAuthorization";

export function PermissionGate({
  permission,
  permissions,
  mode = "any",
  fallback = null,
  children,
}) {
  const { can, canAny, canAll } = useAuthorization();

  let allowed = false;

  if (permission) {
    allowed = can(permission);
  } else if (Array.isArray(permissions)) {
    allowed = mode === "all" ? canAll(permissions) : canAny(permissions);
  }

  if (!allowed) {
    return fallback;
  }

  return children;
}

export default PermissionGate;
