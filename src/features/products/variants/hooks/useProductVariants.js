import { useQuery } from "@tanstack/react-query";
import { fetchProductVariantsApi } from "../api/productVariants.api.js";

export const productVariantKeys = {
  all: ["product-variants"],
  list: (productId, params = {}) => [
    "product-variants",
    "list",
    productId,
    params,
  ],
  detail: (productId, variantId) => [
    "product-variants",
    "detail",
    productId,
    variantId,
  ],
};

export default function useProductVariants(productId, options = {}) {
  return useQuery({
    queryKey: productVariantKeys.list(productId, options.params ?? {}),
    queryFn: () => fetchProductVariantsApi(productId, options.params ?? {}),
    enabled: Boolean(productId) && options.enabled !== false,
    select: (response) => response?.data ?? response?.variants ?? [],
    staleTime: 30_000,
  });
}
