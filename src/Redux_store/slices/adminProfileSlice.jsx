import { createSlice } from "@reduxjs/toolkit";
import { view_admin_profile, change_admin_password, Update_Admin } from "../Api/adminProfile";

const adminProfileSlice = createSlice({
  name: "admin",
  initialState: {
    profile: {},
    loading: false,
    error: null,
    token: null,
    passwordChangeSuccess: null,
    name: "", 
    number: "",
  },
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.passwordChangeSuccess = null;
    }
    , setAdminToken: (state, action) => {
      state.token = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setNumber: (state, action) => {
      state.number = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // View profile
      .addCase(view_admin_profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(view_admin_profile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(view_admin_profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // chnage password 
      .addCase(change_admin_password.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeSuccess = null;
      })
      .addCase(change_admin_password.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.passwordChangeSuccess = "Password updated successfully!";
      })
      .addCase(change_admin_password.rejected, (state, action) => {
        const errorMsg = action.payload || "Password not changed";
        state.loading = false;
        state.error = errorMsg;
      })








      .addCase(Update_Admin.pending, (state) => {
        state.loading = true;
      })
      .addCase(Update_Admin.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(Update_Admin.rejected, (state, action) => {
        state.loading = false;
        // Ensure the error message is available
        state.error =
          action.payload?.message ||
          "An error occurred while updating the admin";
      });
  },
});

export const { resetPasswordState, setAdminToken,setName, setNumber } = adminProfileSlice.actions;
export default adminProfileSlice.reducer;
