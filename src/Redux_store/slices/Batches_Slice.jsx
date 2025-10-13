import { createSlice } from "@reduxjs/toolkit";
import {
  Add_Batches,
  deleteBatch,
  fetchBatchesByCourseId,
  fetchStudents,
  get_Batches,
  search_Batches,
  update_Batches,
  update_time_Batches,
} from "../Api/Batches";
import { act } from "react";

const BatchesSlice = createSlice({
  name: "Batch",
  initialState: {
    Batches: [],
    students: [],
    loading: false,
    error: null,
    searchdata: [],
    batches: [],
  },
  extraReducers: (builder) => {
    builder
      // Get all batches
      .addCase(get_Batches.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_Batches.fulfilled, (state, action) => {
        state.loading = false;
        state.Batches = action.payload;
      })
      .addCase(get_Batches.rejected, (state) => {
        state.loading = false;
        state.error = "Failed  load batches";
      })

      // Get batches by course ID
      .addCase(fetchBatchesByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesByCourseId.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action?.payload;
        // console.log("data slice", action?.payload);
      })
      .addCase(fetchBatchesByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load batches by course ID";
      })

      // Add batches
      .addCase(Add_Batches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Add_Batches.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.Batches)) {
          state.Batches = [];
        }
        state.Batches.push(action.payload);
      })
      .addCase(Add_Batches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add batch";
      })

      // Update time batches
      .addCase(update_time_Batches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_time_Batches.fulfilled, (state, action) => {
        state.loading = false;
        state.Batches = action.payload;
      })
      .addCase(update_time_Batches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update time batches";
      })

      // Update batches
      .addCase(update_Batches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_Batches.fulfilled, (state, action) => {
        const batchObject = action.payload;
        state.Batches = Object.values(batchObject); // ✅ Converts to array
      })

      .addCase(update_Batches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update batch";
      })

      // Search batches
      .addCase(search_Batches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(search_Batches.fulfilled, (state, action) => {
        state.loading = false;
        state.searchdata = action.payload?.data || [];
      })
      .addCase(search_Batches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search failed";
      })

      // Fetch students by batch
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;

        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      })

      //batch delete
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete batch";
      });
  },
});

export default BatchesSlice.reducer;
