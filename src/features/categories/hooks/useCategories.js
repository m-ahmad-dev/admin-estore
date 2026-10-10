import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesApi } from "../api/categories.api.js";

export const categoryKeys = {
  all: ["admin-categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (params = {}) => [...categoryKeys.lists(), params],
  details: () => [...categoryKeys.all, "detail"],
  detail: (categoryId) => [...categoryKeys.details(), categoryId],
  attributes: (categoryId) => [...categoryKeys.all, "attributes", categoryId],
};

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCategoriesApi(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
};

export default useCategories;

export const useAllCategories = () => {
  return useQuery({
    queryKey: [...categoryKeys.all, "all"],
    queryFn: async () => {
      const firstPage = await fetchCategoriesApi({
        pages: 1,
        limit: 50,
        sort: "name",
        order: "asc",
      });

      const firstCategories = firstPage?.categories ?? [];
      const totalPages = firstPage?.pagination?.totalPages ?? 1;

      if (totalPages <= 1) {
        return firstCategories;
      }

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          fetchCategoriesApi({
            pages: index + 2,
            limit: 50,
            sort: "name",
            order: "asc",
          }),
        ),
      );

      return [
        ...firstCategories,
        ...remainingPages.flatMap((response) => response?.categories ?? []),
      ];
    },
    staleTime: 60 * 1000,
  });
};
