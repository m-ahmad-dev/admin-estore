import { useQuery } from "@tanstack/react-query";

import { fetchReviewApi } from "../api/reviews.api.js";
import { reviewKeys } from "./useReviews.js";

export const useReview = (reviewId, options = {}) => {
  return useQuery({
    queryKey: reviewKeys.detail(reviewId),
    queryFn: () => fetchReviewApi(reviewId),
    enabled: Boolean(reviewId) && (options.enabled ?? true),
    staleTime: 30_000,
  });
};

export default useReview;
