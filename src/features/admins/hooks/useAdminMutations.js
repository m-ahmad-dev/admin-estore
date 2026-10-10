import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdmin,
  updateAdminStatus,
  deleteAdmin,
  updateAdminPermissions,
  assignAdminPermission,
  removeAdminPermission,
} from "../api/admins.api";

import { adminKeys } from "./useAdmins";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.lists(),
      });
    },
  });
};

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminStatus,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.detail(variables.adminId),
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,

    onSuccess: (_, adminId) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: adminKeys.detail(adminId),
      });
    },
  });
};

export const useUpdateAdminPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminPermissions,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.detail(variables.adminId),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.permissions(variables.adminId),
      });
    },
  });
};

export const useAssignAdminPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignAdminPermission,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.detail(variables.adminId),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.permissions(variables.adminId),
      });
    },
  });
};

export const useRemoveAdminPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAdminPermission,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.detail(variables.adminId),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.permissions(variables.adminId),
      });
    },
  });
};
