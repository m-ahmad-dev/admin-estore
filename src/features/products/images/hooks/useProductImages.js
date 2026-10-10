import { useQuery } from "@tanstack/react-query";
import { fetchProductImagesApi } from "../api/productImages.api.js";

export const productImageKeys = {
  all: ["product-images"],
  list: (productId) => ["product-images", "list", productId],
};

export default function useProductImages(productId, options = {}) {
  const query = useQuery({
    queryKey: productImageKeys.list(productId),
    queryFn: () => fetchProductImagesApi(productId),
    enabled: Boolean(productId) && (options.enabled ?? true),
  });
  return {
    ...query,
    data: query.data?.data ?? [],
  };
}
