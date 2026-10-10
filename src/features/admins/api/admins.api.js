import api from "../../../lib/axios";

const ADMIN_BASE_URL = "/admin/admins";

export const getAdmins = async () => {
  const response = await api.get(ADMIN_BASE_URL);

  return response.data;
};

export const getAdminById = async (adminId) => {
  const response = await api.get(`${ADMIN_BASE_URL}/${adminId}`);

  return response.data;
};

export const createAdmin = async (payload) => {
  const response = await api.post(ADMIN_BASE_URL, payload);

  return response.data;
};

export const updateAdminStatus = async ({ adminId, status }) => {
  const response = await api.patch(`${ADMIN_BASE_URL}/${adminId}/status`, {
    status,
  });

  return response.data;
};

export const deleteAdmin = async (adminId) => {
  const response = await api.delete(`${ADMIN_BASE_URL}/${adminId}`);

  return response.data;
};

export const getAdminPermissions = async (adminId) => {
  const response = await api.get(`${ADMIN_BASE_URL}/${adminId}/permissions`);

  return response.data;
};

export const updateAdminPermissions = async ({ adminId, permissions }) => {
  const response = await api.put(`${ADMIN_BASE_URL}/${adminId}/permissions`, {
    permissions,
  });

  return response.data;
};

export const assignAdminPermission = async ({ adminId, permission }) => {
  const response = await api.post(`${ADMIN_BASE_URL}/${adminId}/permissions`, {
    permissions: [permission],
  });

  return response.data;
};

export const removeAdminPermission = async ({ adminId, permission }) => {
  const response = await api.delete(
    `${ADMIN_BASE_URL}/${adminId}/permissions/${encodeURIComponent(
      permission,
    )}`,
  );

  return response.data;
};
