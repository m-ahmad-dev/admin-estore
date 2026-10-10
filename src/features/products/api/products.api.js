import api from "../../../lib/axios.js";

const ADMIN_PRODUCTS_BASE = "/admin/products";

export const fetchProductsApi = async (params = {}) => {
  const {
    q,
    category,
    min_price,
    max_price,
    sort,
    order,
    cursor,
    include_deleted,
    status,
  } = params;

  const queryParams = {
    limit: params.limit ?? 10,
    ...(q && { q }),
    ...(category && { category }),
    ...(min_price !== undefined && min_price !== "" && { min_price }),
    ...(max_price !== undefined && max_price !== "" && { max_price }),
    ...(sort && { sort }),
    ...(order && { order }),
    ...(cursor && { cursor }),
    ...(include_deleted !== undefined && {
      include_deleted: String(include_deleted),
    }),
    ...(status && { status }),
  };

  const { data } = await api.get(ADMIN_PRODUCTS_BASE, { params: queryParams });
  return data;
};

export const fetchProductApi = async (productId) => {
  const { data } = await api.get(`${ADMIN_PRODUCTS_BASE}/${productId}`);
  return data;
};

export const createProductApi = async (payload) => {
  const { data } = await api.post(ADMIN_PRODUCTS_BASE, payload);
  return data;
};

export const updateProductApi = async (productId, payload) => {
  const { data } = await api.patch(
    `${ADMIN_PRODUCTS_BASE}/${productId}`,
    payload,
  );
  return data;
};

export const deleteProductApi = async (productId) => {
  const { data } = await api.delete(`${ADMIN_PRODUCTS_BASE}/${productId}`);
  return data;
};

export const restoreProductApi = async (productId) => {
  const { data } = await api.patch(
    `${ADMIN_PRODUCTS_BASE}/${productId}/restore`,
  );
  return data;
};

export const permanentlyDeleteProductApi = async (productId) => {
  const { data } = await api.delete(
    `${ADMIN_PRODUCTS_BASE}/${productId}/permanent`,
  );
  return data;
};
