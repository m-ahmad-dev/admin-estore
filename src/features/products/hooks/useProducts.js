import { useQuery } from "@tanstack/react-query";
import { fetchProductsApi } from "../api/products.api.js";

export const productKeys = {
  all: ["admin-products"],
  lists: () => [...productKeys.all, "list"],
  list: (params = {}) => [...productKeys.lists(), params],
  details: () => [...productKeys.all, "detail"],
  detail: (productId) => [...productKeys.details(), productId],
};

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProductsApi(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
};

export default useProducts;
