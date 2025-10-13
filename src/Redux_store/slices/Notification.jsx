import { createSlice } from "@reduxjs/toolkit";
import {
  add_notification,
  delete_notify,
  get_notification,
} from "../Api/Notification";

const notify_slice = createSlice({
  name: "notify",
  initialState: {
    notii: [],
    delete: {},
    loading: false,
    error: null,
    searchdata: [],
  },
  extraReducers: (builder) => {
    builder
      // get notification
      .addCase(get_notification.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_notification.fulfilled, (state, action) => {
        (state.loading = false), (state.notii = action.payload);
      })
      .addCase(get_notification.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // add noti
      .addCase(add_notification.pending, (state) => {
        state.loading = true;
      })
      .addCase(add_notification.fulfilled, (state, action) => {
        (state.loading = false), (state.notii = action.payload);
      })
      .addCase(add_notification.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      // delete notify
      .addCase(delete_notify.pending, (state) => {
        state.loading = true;
      })
      .addCase(delete_notify.fulfilled, (state, action) => {
        state.loading = false;
        if (state.delete.id === action.payload) {
          state.delete = {}; // or null, depending on your design
        }
      })

      .addCase(delete_notify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default notify_slice.reducer;
