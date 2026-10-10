import api from "../../../lib/axios";

export const loginAdmin = async (credentials) => {
  const response = await api.post("/auth/admin/login", credentials);

  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/auth/admin/logout");

  return response.data;
};
