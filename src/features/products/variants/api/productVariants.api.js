import api from "../../../../lib/axios.js";

const getBase = (productId) => `/admin/products/${productId}/variants`;

export const fetchProductVariantsApi = async (productId, params = {}) => {
  const response = await api.get(getBase(productId), { params });
  return response.data;
};

export const fetchProductVariantApi = async (productId, variantId) => {
  const response = await api.get(`${getBase(productId)}/${variantId}`);
  return response.data;
};

export const createProductVariantsApi = async (productId, variants) => {
  const response = await api.post(getBase(productId), { variants });
  return response.data;
};

export const updateProductVariantApi = async (
  productId,
  variantId,
  payload,
) => {
  const response = await api.patch(
    `${getBase(productId)}/${variantId}`,
    payload,
  );
  return response.data;
};

export const deleteProductVariantApi = async (productId, variantId) => {
  const response = await api.delete(`${getBase(productId)}/${variantId}`);
  return response.data;
};

export const restoreProductVariantApi = async (productId, variantId) => {
  const response = await api.patch(
    `${getBase(productId)}/${variantId}/restore`,
  );
  return response.data;
};

export const updateProductVariantStockApi = async (
  productId,
  variantId,
  payload,
) => {
  const response = await api.patch(
    `${getBase(productId)}/${variantId}/stock`,
    payload,
  );
  return response.data;
};
