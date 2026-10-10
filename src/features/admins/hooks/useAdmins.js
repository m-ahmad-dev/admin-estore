import { useQuery } from "@tanstack/react-query";

import { getAdmins } from "../api/admins.api";

export const adminKeys = {
  all: ["admins"],

  lists: () => [...adminKeys.all, "list"],

  list: () => [...adminKeys.lists()],

  details: () => [...adminKeys.all, "detail"],

  detail: (adminId) => [...adminKeys.details(), adminId],

  permissions: (adminId) => [...adminKeys.detail(adminId), "permissions"],
};

export const useAdmins = () => {
  const query = useQuery({
    queryKey: adminKeys.list(),
    queryFn: getAdmins,
  });

  return {
    admins: query.data?.admins ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
