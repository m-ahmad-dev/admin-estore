import { useQuery } from "@tanstack/react-query";

import { fetchReviewsApi } from "../api/reviews.api.js";

export const reviewKeys = {
  all: ["reviews"],

  lists: () => [...reviewKeys.all, "list"],
  list: (filters) => [...reviewKeys.lists(), filters],
  details: () => [...reviewKeys.all, "detail"],
  detail: (reviewId) => [...reviewKeys.details(), reviewId],
};

export const useReviews = (filters = {}) => {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => fetchReviewsApi(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
};

export default useReviews;
