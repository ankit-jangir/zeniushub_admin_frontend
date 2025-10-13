import { createSlice } from "@reduxjs/toolkit";

import {
  get_course,
  add_course,
  update_course,
  searchCoursesByName,
  view_detail_Batches,
  fetchCoursesByName,
  deleteCourse,
  markCourseActive,
} from "../Api/Academic_course";

const acad_course_slice = createSlice({
  name: "acad_courses",
  initialState: {
    course: [],
    loading: false,
    error: null,
    searchdata: [],
    subjects: [],
    courses: [],
    pagination: {},
  },
  extraReducers: (builder) => {
    builder
      // get course
      .addCase(get_course.pending, (state) => {
        state.loading = true;
      })
      .addCase(get_course.fulfilled, (state, action) => {
        (state.loading = false), (state.course = action.payload);
      })
      .addCase(get_course.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })

      // add
      .addCase(add_course.pending, (state) => {
        state.loading = true;
      })
      .addCase(add_course.fulfilled, (state, action) => {
        state.loading = false;
        // state.course = action.payload
      })
      .addCase(add_course.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })

      // update
      .addCase(update_course.pending, (state) => {
        state.loading = true;
      })
      .addCase(update_course.fulfilled, (state, action) => {
        (state.loading = false), (state.course = action.payload);
      })
      .addCase(update_course.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })

      // search
      .addCase(searchCoursesByName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.course = []; // Optional: clear previous results while loading
      })
      .addCase(searchCoursesByName.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload; // Assuming payload is an array of courses
      })
      .addCase(searchCoursesByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // view batch
      .addCase(view_detail_Batches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(view_detail_Batches.fulfilled, (state, action) => {
        state.loading = false;
        state.Batches = action.payload;
      })
      .addCase(view_detail_Batches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetch course

    builder
      .addCase(fetchCoursesByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByName.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCoursesByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete

      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        const idToDelete = action.payload.id;
        state.courses = state.courses.filter((item) => item.id !== idToDelete);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete course";
      })

      // update active course

      .addCase(markCourseActive.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(markCourseActive.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Course marked as active successfully";

        // Optionally update course status in state
        const updatedCourseId = action.meta.arg;
        const courseIndex = state.courses.findIndex(
          (course) => course.id === updatedCourseId
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex].isActive = true;
        }
      })
      .addCase(markCourseActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark course as active";
      });
  },
});
export default acad_course_slice.reducer;
