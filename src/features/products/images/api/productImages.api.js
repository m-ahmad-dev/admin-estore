import api from "../../../../lib/axios.js";

export const fetchProductImagesApi = async (productId) => {
  const response = await api.get(`/admin/products/${productId}/images`);
  return response.data;
};

export const fetchProductImageApi = async (productId, imageId) => {
  const response = await api.get(
    `/admin/products/${productId}/images/${imageId}`,
  );
  return response.data;
};

export const addProductImagesApi = async (productId, images) => {
  const response = await api.post(`/admin/products/${productId}/images`, {
    images,
  });
  return response.data;
};

export const reorderProductImagesApi = async (productId, imageIds) => {
  const response = await api.patch(
    `/admin/products/${productId}/images/reorder`,
    { imageIds },
  );
  return response.data;
};

export const updateProductImageApi = async (productId, imageId, payload) => {
  const response = await api.patch(
    `/admin/products/${productId}/images/${imageId}`,
    payload,
  );
  return response.data;
};

export const setProductImagePrimaryApi = async (productId, imageId) => {
  const response = await api.patch(
    `/admin/products/${productId}/images/${imageId}/primary`,
  );
  return response.data;
};

export const deleteProductImageApi = async (productId, imageId) => {
  const response = await api.delete(
    `/admin/products/${productId}/images/${imageId}`,
  );
  return response.data;
};
