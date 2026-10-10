import { useQuery } from "@tanstack/react-query";
import {
  fetchCategoryApi,
  fetchCategoryAttributesApi,
} from "../api/categories.api.js";
import { categoryKeys } from "./useCategories.js";

export const useCategory = (categoryId, enabled = true) => {
  const categoryQuery = useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => fetchCategoryApi(categoryId),
    enabled: Boolean(categoryId) && enabled,
  });

  const attributesQuery = useQuery({
    queryKey: categoryKeys.attributes(categoryId),
    queryFn: () => fetchCategoryAttributesApi(categoryId),
    enabled: Boolean(categoryId) && enabled,
  });

  return {
    category: categoryQuery.data?.category ?? null,
    attributes: attributesQuery.data?.attributes ?? [],

    isLoading: categoryQuery.isLoading || attributesQuery.isLoading,
    isFetching: categoryQuery.isFetching || attributesQuery.isFetching,
    isError: categoryQuery.isError || attributesQuery.isError,

    categoryError: categoryQuery.error,
    attributesError: attributesQuery.error,

    refetch: async () => {
      await Promise.all([categoryQuery.refetch(), attributesQuery.refetch()]);
    },
  };
};

export default useCategory;
