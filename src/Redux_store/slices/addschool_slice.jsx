import { createSlice } from "@reduxjs/toolkit";
import { addSchoolInfo, get_school, updateSchoolInfo } from "../Api/School_image";

const school_slice = createSlice({
  name: "schools",
  initialState: {
    school: [],
    loading: false,
    error: null,
    searchdata: [],
  },
  extraReducers: (builder) => {
    builder
      // Get School
      .addCase(get_school.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_school.fulfilled, (state, action) => {
        state.loading = false;
        state.school = action.payload;
        state.error = null;
      })
      .addCase(get_school.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch school data.";
      })

      // Update School Info
      .addCase(updateSchoolInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchoolInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.school = action.payload;
        state.error = null;
      })
      .addCase(updateSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to update school info.";
      })



      .addCase(addSchoolInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSchoolInfo.fulfilled, (state, action) => {
        state.loading = false;
        console.log("s", state.school)
        console.log("payloade : ", state.payload)
        if (Array.isArray(state.school)) {
          state.school.push(action.payload); // ✅ works if state.school is array
        } state.error = null;
      })
      .addCase(addSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to add school info.";
      });
  },
});

export default school_slice.reducer;
