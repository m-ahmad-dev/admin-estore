import { useQuery } from "@tanstack/react-query";

import { getCustomerById } from "../api/customers.api.js";
import { customerKeys } from "./useCustomers.js";

export const useCustomer = (customerId, enabled = true) => {
  const query = useQuery({
    queryKey: customerKeys.detail(customerId),

    queryFn: () => getCustomerById(customerId),

    enabled: Boolean(customerId) && enabled,
  });

  return {
    customer: query.data?.customer ?? null,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
  };
};

export default useCustomer;
