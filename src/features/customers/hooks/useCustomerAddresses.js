import { useQuery } from "@tanstack/react-query";

import { getCustomerAddresses } from "../api/customers.api.js";

import { customerKeys } from "./useCustomers.js";

export const useCustomerAddresses = (customerId, enabled = true) => {
  const query = useQuery({
    queryKey: customerKeys.addresses(customerId),

    queryFn: () => getCustomerAddresses(customerId),

    enabled: Boolean(customerId) && enabled,
  });

  return {
    addresses: query.data?.addresses ?? query.data?.data ?? [],

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
  };
};

export default useCustomerAddresses;
