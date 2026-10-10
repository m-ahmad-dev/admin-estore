import axios from "../../../lib/axios.js";

/**
 * Get paginated customers.
 *
 * Backend expects:
 * pages
 * limit
 * search
 * sort
 * order
 */
export const getCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
  sort = "created_at",
  order = "asc",
} = {}) => {
  const params = {
    pages: page,
    limit,
    sort,
    order,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const { data } = await axios.get("/admin/customers", {
    params,
  });

  return data;
};

/**
 * Get customer details.
 */
export const getCustomerById = async (customerId) => {
  const { data } = await axios.get(`/admin/customers/${customerId}`);

  return data;
};

/**
 * Update customer profile.
 *
 * Supported:
 * firstname
 * lastname
 * email
 * phone
 */
export const updateCustomer = async (customerId, payload) => {
  const { data } = await axios.patch(`/admin/customers/${customerId}`, payload);

  return data;
};

/**
 * Activate/deactivate customer.
 *
 * Backend values:
 * active
 * deactive
 */
export const updateCustomerStatus = async (customerId, status) => {
  const { data } = await axios.patch(`/admin/customers/${customerId}/status`, {
    status,
  });

  return data;
};

/**
 * Get customer's saved addresses.
 */
export const getCustomerAddresses = async (customerId) => {
  const { data } = await axios.get(`/admin/customers/${customerId}/addresses`);

  return data;
};
