import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCouponApi, updateCouponApi } from "../api/coupons.api.js";
import { couponKeys } from "./useCoupons.js";

export const useCouponMutations = () => {
  const queryClient = useQueryClient();

  const createCoupon = useMutation({
    mutationFn: createCouponApi,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: couponKeys.lists(),
      });

      toast.success(response?.message || "Coupon created successfully");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    },
  });

  const updateCoupon = useMutation({
    mutationFn: updateCouponApi,

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: couponKeys.lists(),
      });

      if (variables?.couponId) {
        queryClient.invalidateQueries({
          queryKey: couponKeys.detail(variables.couponId),
        });
      }

      toast.success(response?.message || "Coupon updated successfully");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update coupon");
    },
  });

  return {
    createCoupon,
    updateCoupon,

    isCreating: createCoupon.isPending,
    isUpdating: updateCoupon.isPending,

    isMutating: createCoupon.isPending || updateCoupon.isPending,
  };
};
