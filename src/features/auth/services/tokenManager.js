// In-memory access token (never persisted -> not readable via XSS from storage).
// The long-lived refresh token lives in an httpOnly cookie managed by the server.
let accessToken = null;
let sessionExpiredNotified = false;
const sessionExpiredListeners = new Set();

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
  // A fresh token means a fresh session; allow the next expiry to notify again.
  sessionExpiredNotified = false;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// Lets the HTTP layer (axios) tell the UI layer (Redux/router) that the session
// is dead, without importing the store (avoids circular dependencies).
export const onSessionExpired = (listener) => {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
};

export const notifySessionExpired = () => {
  // Many requests can fail at once; notify only once per session.
  if (sessionExpiredNotified) return;
  sessionExpiredNotified = true;
  sessionExpiredListeners.forEach((listener) => listener());
};
