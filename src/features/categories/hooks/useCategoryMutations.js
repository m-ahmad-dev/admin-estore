import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  addCategoryAttributeApi,
  updateCategoryAttributeApi,
  deleteCategoryAttributeApi,
} from "../api/categories.api.js";
import { categoryKeys } from "./useCategories.js";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createCategoryApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }) =>
      updateCategoryApi(categoryId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => deleteCategoryApi(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useAddCategoryAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }) =>
      addCategoryAttributeApi(categoryId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.attributes(variables.categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      });
    },
  });
};

export const useUpdateCategoryAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, attrName, payload }) =>
      updateCategoryAttributeApi(categoryId, attrName, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.attributes(variables.categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      });
    },
  });
};

export const useDeleteCategoryAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, attrName }) =>
      deleteCategoryAttributeApi(categoryId, attrName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.attributes(variables.categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId),
      });
    },
  });
};
