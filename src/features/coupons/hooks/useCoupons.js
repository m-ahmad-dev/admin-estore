import { useQuery } from "@tanstack/react-query";
import { fetchCouponsApi } from "../api/coupons.api.js";

export const couponKeys = {
  all: ["coupons"],
  lists: () => [...couponKeys.all, "list"],
  list: (filters) => [...couponKeys.lists(), filters],
  details: () => [...couponKeys.all, "detail"],
  detail: (id) => [...couponKeys.details(), id],
};

export const useCoupons = (filters = {}) => {
  return useQuery({
    queryKey: couponKeys.list(filters),
    queryFn: () => fetchCouponsApi(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
};
