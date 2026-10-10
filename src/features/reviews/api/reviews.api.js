import api from "../../../lib/axios.js";

const REVIEWS_BASE_URL = "/admin/reviews";

const assertReviewId = (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }
};

// Fetch admin reviews with cursor pagination, filters and sorting.
export const fetchReviewsApi = async ({
  cursor,
  limit = 20,
  status,
  rating,
  product_id,
  customer_id,
  search,
  sort = "created_at",
  order = "desc",
} = {}) => {
  const params = {
    limit,
    sort,
    order,
    ...(cursor && { cursor }),
    ...(status && { status }),
    ...(rating !== "" &&
      rating !== null &&
      rating !== undefined && {
        rating,
      }),
    ...(product_id?.trim() && {
      product_id: product_id.trim(),
    }),
    ...(customer_id?.trim() && {
      customer_id: customer_id.trim(),
    }),
    ...(search?.trim() && {
      search: search.trim(),
    }),
  };

  const { data } = await api.get(REVIEWS_BASE_URL, {
    params,
  });

  return data;
};

// Fetch a single review with full details.
export const fetchReviewApi = async (reviewId) => {
  assertReviewId(reviewId);

  const { data } = await api.get(`${REVIEWS_BASE_URL}/${reviewId}`);

  return data;
};

/**
 * Update review moderation status.
 *
 * status:
 * - PENDING
 * - APPROVED
 * - REJECTED
 *
 * rejection_reason is only sent for REJECTED.
 */
export const updateReviewStatusApi = async ({
  reviewId,
  status,
  rejection_reason,
}) => {
  assertReviewId(reviewId);

  const payload = {
    status,
    ...(status === "REJECTED" && {
      rejection_reason: rejection_reason?.trim(),
    }),
  };

  const { data } = await api.patch(
    `${REVIEWS_BASE_URL}/${reviewId}/status`,
    payload,
  );

  return data;
};

// Delete a review as admin.
export const deleteReviewAdminApi = async (reviewId) => {
  assertReviewId(reviewId);

  const { data } = await api.delete(`${REVIEWS_BASE_URL}/${reviewId}`);

  return data;
};

export default {
  fetchReviewsApi,
  fetchReviewApi,
  updateReviewStatusApi,
  deleteReviewAdminApi,
};
