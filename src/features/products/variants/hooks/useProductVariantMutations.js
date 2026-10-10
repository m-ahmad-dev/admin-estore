import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductVariantsApi,
  updateProductVariantApi,
  deleteProductVariantApi,
  restoreProductVariantApi,
  updateProductVariantStockApi,
} from "../api/productVariants.api.js";
import { productVariantKeys } from "./useProductVariants.js";

export const useCreateProductVariants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variants }) =>
      createProductVariantsApi(productId, variants),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.list(variables.productId),
      });
    },
  });
};

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, payload }) =>
      updateProductVariantApi(productId, variantId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.list(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.detail(
          variables.productId,
          variables.variantId,
        ),
      });
    },
  });
};

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }) =>
      deleteProductVariantApi(productId, variantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.list(variables.productId),
      });
    },
  });
};

export const useRestoreProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }) =>
      restoreProductVariantApi(productId, variantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.list(variables.productId),
      });
    },
  });
};

export const useUpdateProductVariantStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, payload }) =>
      updateProductVariantStockApi(productId, variantId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.list(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: productVariantKeys.detail(
          variables.productId,
          variables.variantId,
        ),
      });
    },
  });
};
