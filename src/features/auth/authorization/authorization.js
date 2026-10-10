const OWNER_ROLE = "owner";
const ADMIN_ROLE = "admin";

const normalizePermissions = (permissions) => {
  if (!Array.isArray(permissions)) {
    return [];
  }
  return permissions.filter(
    (permission) => typeof permission === "string" && permission.length > 0,
  );
};

export const isOwner = (admin) => {
  return admin?.role === OWNER_ROLE;
};

export const isAdmin = (admin) => {
  return admin?.role === ADMIN_ROLE;
};

/**
 * Check if the admin has a specific permission.
 * - Owner bypasses all checks.
 * - Wildcard "*" also grants all permissions.
 */
export const hasPermission = (admin, requiredPermission) => {
  if (!admin || !requiredPermission) {
    return false;
  }

  // Owner has unrestricted access.
  if (isOwner(admin)) {
    return true;
  }

  const permissions = normalizePermissions(admin.permissions);

  // Wildcard "*" means all permissions.
  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(requiredPermission);
};

/**
 * Check if the admin has any of the required permissions.
 */
export const hasAnyPermission = (admin, requiredPermissions = []) => {
  if (!admin || !Array.isArray(requiredPermissions)) {
    return false;
  }

  if (isOwner(admin)) {
    return true;
  }

  const permissions = normalizePermissions(admin.permissions);

  if (permissions.includes("*")) {
    return true;
  }

  return requiredPermissions.some((permission) =>
    permissions.includes(permission),
  );
};

/**
 * Check if the admin has all of the required permissions.
 */
export const hasAllPermissions = (admin, requiredPermissions = []) => {
  if (!admin || !Array.isArray(requiredPermissions)) {
    return false;
  }

  if (isOwner(admin)) {
    return true;
  }

  const permissions = normalizePermissions(admin.permissions);

  if (permissions.includes("*")) {
    return true;
  }

  return requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );
};

// Keep backwards-compatible aliases
export const canAccess = hasPermission;
