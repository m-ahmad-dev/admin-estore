const STORAGE_KEY = "estore_admin_session";

export const getStoredAdmin = () => {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const setStoredAdmin = (admin) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
};

export const clearStoredAdmin = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};
