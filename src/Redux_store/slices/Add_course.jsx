import { createSlice } from "@reduxjs/toolkit";
import {
  get_course,
  add_course,
  deletePopularCourse,
} from "../Api/Add_popular_course";

const course_slice = createSlice({
  name: "courses",
  initialState: {
    course: [], // Ensure course is initialized as an empty array
    loading: false,
    error: null,
    searchdata: [],
  },
  extraReducers: (builder) => {
    builder
      // Get course
      .addCase(get_course.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_course.fulfilled, (state, action) => {
        state.loading = false;

        state.course = action.payload;
      })
      .addCase(get_course.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load courses";
      })

      // Add course
      .addCase(add_course.pending, (state) => {
        state.loading = true;
      })
      .addCase(add_course.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure action.payload is a valid course object before pushing
        if (action.payload && typeof action.payload === "object") {
          state.course = action.payload; // Add new course to the list
        }
      })
      .addCase(add_course.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add course";
      })

      // Delete course
      .addCase(deletePopularCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePopularCourse.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns the updated list of courses after deletion
        // If not, manually filter out the deleted course by its ID
        if (Array.isArray(state.course)) {
          state.course = state.course.filter(
            (course) => course.id !== action.payload.id
          ); // Remove deleted course
        }
      })
      .addCase(deletePopularCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong while deleting the course";
      });
  },
});

export default course_slice.reducer;
