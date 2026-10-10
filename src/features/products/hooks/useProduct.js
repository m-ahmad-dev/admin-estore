import { useQuery } from "@tanstack/react-query";

import { fetchProductApi } from "../api/products.api.js";
import { productKeys } from "./useProducts.js";

export const useProduct = (productId, enabled = true) => {
  const query = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => fetchProductApi(productId),
    enabled: Boolean(productId) && enabled,
  });

  return {
    product: query.data?.product ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useProduct;
