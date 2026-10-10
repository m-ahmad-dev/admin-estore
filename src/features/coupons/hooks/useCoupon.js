import { useQuery } from "@tanstack/react-query";
import { fetchCouponApi } from "../api/coupons.api.js";
import { couponKeys } from "./useCoupons.js";

export const useCoupon = (couponId, options = {}) => {
  return useQuery({
    queryKey: couponKeys.detail(couponId),
    queryFn: () => fetchCouponApi(couponId),
    enabled: Boolean(couponId) && (options.enabled ?? true),
    staleTime: 30_000,
  });
};
