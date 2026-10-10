import api from "../../../lib/axios.js";

const COUPONS_BASE_URL = "/admin/coupons";

const assertCouponId = (couponId) => {
  if (!couponId) {
    throw new Error("Coupon ID is required.");
  }
};

/**
 * Fetch coupons with cursor-based pagination and filters.
 */
export const fetchCouponsApi = async ({
  cursor,
  search,
  is_active,
  type,
  limit = 10,
} = {}) => {
  const params = {
    limit,
    ...(cursor && { cursor }),
    ...(search?.trim() && { search: search.trim() }),
    ...(is_active !== undefined && is_active !== "" && { is_active }),
    ...(type && { type }),
  };

  const { data } = await api.get(COUPONS_BASE_URL, { params });
  return data;
};

/**
 * Fetch a single coupon.
 */
export const fetchCouponApi = async (couponId) => {
  assertCouponId(couponId);

  const { data } = await api.get(`${COUPONS_BASE_URL}/${couponId}`);
  return data;
};

/**
 * Create a coupon.
 */
export const createCouponApi = async (payload) => {
  const { data } = await api.post(COUPONS_BASE_URL, payload);
  return data;
};

/**
 * Update a coupon.
 */
export const updateCouponApi = async ({ couponId, payload }) => {
  assertCouponId(couponId);

  const { data } = await api.patch(`${COUPONS_BASE_URL}/${couponId}`, payload);
  return data;
};

export default {
  fetchCouponsApi,
  fetchCouponApi,
  createCouponApi,
  updateCouponApi,
};
