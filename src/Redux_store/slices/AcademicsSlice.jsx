import { createSlice } from "@reduxjs/toolkit";
import { getAllAcademicsdata } from "../Api/AcademicsApi";


const academicsSlice  = createSlice({
  name: "academics",
  initialState: {
    data: [],
    loading: false,
    error: null,

  },
  extraReducers: (builder) => {
    builder
      // Get data academics
      .addCase(getAllAcademicsdata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAcademicsdata.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(getAllAcademicsdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message 
      })
  },
});

export default academicsSlice.reducer;
