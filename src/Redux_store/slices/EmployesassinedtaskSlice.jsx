import { createSlice } from "@reduxjs/toolkit";
import {
  assignSubjectsToEmployee,
  deleteEmployeeAssignment,
  fetchCoursesBySubject,
  getBatchbycourseid,
  getEmployeeBatchSubject,
} from "../Api/Employesassinedtask";

const GetBatchesSlice = createSlice({
  name: "getBatch",
  initialState: {
    getBatch: [],
    subjectCourses: [],
    loading: false,
    error: null,
    success: false,
    assign: null,
    message: ""
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Batches
      .addCase(getBatchbycourseid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatchbycourseid.fulfilled, (state, action) => {
        state.loading = false;
        state.getBatch = action?.payload?.data?.batches || [];
      })
      .addCase(getBatchbycourseid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load batches by course ID";
      })

      // 🔹 Courses by Subject
      .addCase(fetchCoursesBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectCourses = action.payload;
      })
      .addCase(fetchCoursesBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses by subject";
      });

    builder
      .addCase(assignSubjectsToEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(assignSubjectsToEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(assignSubjectsToEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
    builder
      .addCase(getEmployeeBatchSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeBatchSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.assign = action.payload;
      })
      .addCase(getEmployeeBatchSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch";
      });
         builder
      .addCase(deleteEmployeeAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = '';
      })
      .addCase(deleteEmployeeAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteEmployeeAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default GetBatchesSlice.reducer;
