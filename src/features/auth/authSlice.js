import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  status: "initializing",
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuthInitializing: (state) => {
      state.status = "initializing";
      state.error = null;
    },

    setCredentials: (state, action) => {
      state.admin = action.payload;
      state.status = "authenticated";
      state.error = null;
    },

    setUnauthenticated: (state) => {
      state.admin = null;
      state.status = "unauthenticated";
      state.error = null;
    },

    setAuthError: (state, action) => {
      state.status = "unauthenticated";
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthInitializing,
  setCredentials,
  setUnauthenticated,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
