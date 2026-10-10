import { useQuery } from "@tanstack/react-query";

import { getAdminById, getAdminPermissions } from "../api/admins.api";

import { adminKeys } from "./useAdmins";

export const useAdmin = (adminId, enabled = true) => {
  const adminQuery = useQuery({
    queryKey: adminKeys.detail(adminId),
    queryFn: () => getAdminById(adminId),
    enabled: Boolean(adminId) && enabled,
  });

  const permissionsQuery = useQuery({
    queryKey: adminKeys.permissions(adminId),
    queryFn: () => getAdminPermissions(adminId),
    enabled: Boolean(adminId) && enabled,
  });

  return {
    admin: adminQuery.data?.admin ?? null,

    permissions:
      permissionsQuery.data?.permissions ?? permissionsQuery.data?.data ?? [],

    isLoading: adminQuery.isLoading || permissionsQuery.isLoading,
    isFetching: adminQuery.isFetching || permissionsQuery.isFetching,
    isError: adminQuery.isError || permissionsQuery.isError,

    adminError: adminQuery.error,
    permissionsError: permissionsQuery.error,

    refetch: async () => {
      await Promise.all([adminQuery.refetch(), permissionsQuery.refetch()]);
    },
  };
};
