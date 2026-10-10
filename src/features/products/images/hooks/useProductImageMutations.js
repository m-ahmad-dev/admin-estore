import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProductImagesApi,
  reorderProductImagesApi,
  updateProductImageApi,
  setProductImagePrimaryApi,
  deleteProductImageApi,
} from "../api/productImages.api.js";
import { productImageKeys } from "./useProductImages.js";

export const useAddProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, images }) =>
      addProductImagesApi(productId, images),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.list(variables.productId),
      });
    },
  });
};

export const useReorderProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageIds }) =>
      reorderProductImagesApi(productId, imageIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.list(variables.productId),
      });
    },
  });
};

export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId, payload }) =>
      updateProductImageApi(productId, imageId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.list(variables.productId),
      });
    },
  });
};

export const useSetProductImagePrimary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }) =>
      setProductImagePrimaryApi(productId, imageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.list(variables.productId),
      });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }) =>
      deleteProductImageApi(productId, imageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productImageKeys.list(variables.productId),
      });
    },
  });
};
