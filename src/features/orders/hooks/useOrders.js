import { useQuery } from "@tanstack/react-query";
import { fetchOrdersApi } from "../api/orders.api";

export const useOrders = (filters = {}) => {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => fetchOrdersApi(filters),
    keepPreviousData: true,
  });
};

export default useOrders;
