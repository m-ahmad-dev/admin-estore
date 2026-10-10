import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteReviewAdminApi,
  updateReviewStatusApi,
} from "../api/reviews.api.js";
import { reviewKeys } from "./useReviews.js";

export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const invalidateReviewQueries = (reviewId) => {
    queryClient.invalidateQueries({
      queryKey: reviewKeys.lists(),
    });

    if (reviewId) {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(reviewId),
      });
    }
  };

  const updateReviewStatus = useMutation({
    mutationFn: updateReviewStatusApi,

    onSuccess: (response, variables) => {
      invalidateReviewQueries(variables?.reviewId);

      toast.success(
        response?.message || "Review status updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Failed to update review status",
      );
    },
  });

  const deleteReview = useMutation({
    mutationFn: deleteReviewAdminApi,

    onSuccess: (response, reviewId) => {
      invalidateReviewQueries(reviewId);

      toast.success(
        response?.message || "Review deleted successfully",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Failed to delete review",
      );
    },
  });

  return {
    updateReviewStatus,
    deleteReview,

    isUpdatingStatus: updateReviewStatus.isPending,
    isDeleting: deleteReview.isPending,

    isMutating:
      updateReviewStatus.isPending || deleteReview.isPending,
  };
};

export default useReviewMutations;