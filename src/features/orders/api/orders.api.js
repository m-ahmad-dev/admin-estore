import axios from "../../../lib/axios.js";

export const fetchOrdersApi = async (params = {}) => {
  const cleanParams = {};

  // URL me sirf wohi parameters jayenge jinme valid non-empty value ho
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      cleanParams[key] = typeof value === "string" ? value.trim() : value;
    }
  });

  const { data } = await axios.get("/admin/orders", { params: cleanParams });
  return data;
};

export const fetchOrderByIdApi = async (id) => {
  const { data } = await axios.get(`/admin/orders/${id}`);
  return data;
};

export const updateOrderStatusApi = async ({ id, status }) => {
  const { data } = await axios.patch(`/admin/orders/${id}/status`, { status });
  return data;
};

export const updateOrderPaymentStatusApi = async ({ id, status }) => {
  const { data } = await axios.patch(`/admin/orders/${id}/payment/status`, {
    status,
  });
  return data;
};

export const updateOrderShipmentStatusApi = async ({ id, status }) => {
  const { data } = await axios.patch(`/admin/orders/${id}/shipment/status`, {
    status,
  });
  return data;
};

export const cancelOrderAdminApi = async (id) => {
  const { data } = await axios.delete(`/admin/orders/${id}/cancel`);
  return data;
};


export const refundOrderApi = async (id) => {
  const { data } = await axios.post(`/admin/orders/${id}/refund`, {});
  return data;
};
