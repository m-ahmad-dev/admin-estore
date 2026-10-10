import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCustomers } from "../api/customers.api.js";

export const customerKeys = {
  all: ["customers"],

  lists: () => [...customerKeys.all, "list"],

  list: (params) => [...customerKeys.lists(), params],

  details: () => [...customerKeys.all, "detail"],

  detail: (id) => [...customerKeys.details(), id],

  addresses: (id) => [...customerKeys.all, "addresses", id],
};

export const useCustomers = (params) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => getCustomers(params),
    placeholderData: keepPreviousData,
  });
};

export default useCustomers;
