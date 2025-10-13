// Redux_store/slices/receiptSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { CheckToken } from "../Api/ProtectRoute_api";

const initialState = {
  Token: null,
  loading: false,
  error: null,
  success: false, // ✅ ADD THIS
};

const receiptSlice = createSlice({
  name: 'CheckToken',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CheckToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false; // ✅ Reset on new request
      })
      .addCase(CheckToken.fulfilled, (state, action) => {
        state.loading = false;
        state.Token = action.payload;
        state.success = action.payload.success || false; // ✅ Store `success`
      })
      .addCase(CheckToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});


export default receiptSlice.reducer;
