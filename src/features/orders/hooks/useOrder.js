import { useQuery } from "@tanstack/react-query";
import { fetchOrderByIdApi } from "../api/orders.api";

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => fetchOrderByIdApi(id),
    enabled: Boolean(id),
  });
};

export default useOrder;
