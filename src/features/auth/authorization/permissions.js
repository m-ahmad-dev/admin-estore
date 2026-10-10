export const PERMISSIONS = Object.freeze({
  // Admin management
  ADMINS_CREATE: "admins.create",
  ADMINS_VIEW: "admins.view",
  ADMINS_EDIT: "admins.edit",
  ADMINS_DEACTIVATE: "admins.deactivate",
  ADMINS_DELETE: "admins.delete",

  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Products
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",

  // Categories
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_EDIT: "categories.edit",
  CATEGORIES_DELETE: "categories.delete",

  // Countries
  COUNTRIES_VIEW: "countries.view",
  COUNTRIES_EDIT: "countries.edit",

  // Coupons
  COUPONS_VIEW: "coupons.view",
  COUPONS_CREATE: "coupons.create",
  COUPONS_EDIT: "coupons.edit",

  // Customers
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_EDIT: "customers.edit",

  // Orders
  ORDERS_VIEW: "orders.view",
  ORDERS_EDIT: "orders.edit",
  ORDERS_UPDATE_STATUS: "orders.update_status",
  ORDERS_CANCEL: "orders.cancel",

  // Reviews
  REVIEWS_VIEW: "reviews.view",
  REVIEWS_EDIT: "reviews.edit",
  REVIEWS_DELETE: "reviews.delete",

  // Product-related permissions used by other admin modules
  TAGS_MANAGE: "tags.manage",

  SHIPMENTS_VIEW: "shipments.view",
  SHIPMENTS_UPDATE: "shipments.update",
});

export default PERMISSIONS;
