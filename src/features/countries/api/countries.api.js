import axios from '../../../lib/axios';

/**
 * Fetch countries with optional filters
 * @param {Object} params - { search, is_active, order }
 * @returns {Promise} { success, message, meta: { total }, countries: [...] }
 */
export const getCountries = async (params = {}) => {
  const response = await axios.get('/admin/countries', { params });
  return response.data;
};

/**
 * Toggle country active status
 * @param {Object} payload - { id, is_active }
 * @returns {Promise} { success, message, country: {...} }
 */
export const updateCountryStatus = async ({ id, is_active }) => {
  const response = await axios.patch(`/admin/countries/${id}/status`, { is_active });
  return response.data;
};