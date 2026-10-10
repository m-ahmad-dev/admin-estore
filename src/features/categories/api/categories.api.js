import api from "../../../lib/axios.js";

const ADMIN_CATEGORIES_BASE = "/admin/categories";

export const fetchCategoriesApi = async (params = {}) => {
  const response = await api.get(ADMIN_CATEGORIES_BASE, {
    params: {
      pages: params.pages ?? params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search ? { search: params.search } : {}),
      ...(params.sort ? { sort: params.sort } : {}),
      ...(params.order ? { order: params.order } : {}),
    },
  });
  return response.data;
};

export const fetchCategoryApi = async (categoryId) => {
  const response = await api.get(`${ADMIN_CATEGORIES_BASE}/${categoryId}`);
  return response.data;
};

export const fetchCategoryAttributesApi = async (categoryId) => {
  const response = await api.get(
    `${ADMIN_CATEGORIES_BASE}/${categoryId}/attributes`,
  );
  return response.data;
};

export const createCategoryApi = async (payload) => {
  const response = await api.post(ADMIN_CATEGORIES_BASE, payload);
  return response.data;
};

export const updateCategoryApi = async (categoryId, payload) => {
  const response = await api.patch(
    `${ADMIN_CATEGORIES_BASE}/${categoryId}`,
    payload,
  );
  return response.data;
};

export const deleteCategoryApi = async (categoryId) => {
  const response = await api.delete(`${ADMIN_CATEGORIES_BASE}/${categoryId}`);
  return response.data;
};

export const addCategoryAttributeApi = async (categoryId, payload) => {
  const response = await api.post(
    `${ADMIN_CATEGORIES_BASE}/${categoryId}/attributes`,
    payload,
  );
  return response.data;
};

export const updateCategoryAttributeApi = async (
  categoryId,
  attributeName,
  payload,
) => {
  const response = await api.patch(
    `${ADMIN_CATEGORIES_BASE}/${categoryId}/attributes/${encodeURIComponent(
      attributeName,
    )}`,
    payload,
  );
  return response.data;
};

export const deleteCategoryAttributeApi = async (categoryId, attributeName) => {
  const response = await api.delete(
    `${ADMIN_CATEGORIES_BASE}/${categoryId}/attributes/${encodeURIComponent(
      attributeName,
    )}`,
  );
  return response.data;
};
