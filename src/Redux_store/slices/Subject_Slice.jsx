import { createSlice } from "@reduxjs/toolkit";
import {
  Add_subject,
  delete_subject,
  fetchSubjectCourses,
  get_subject,
  update_Subject,
} from "../Api/Subject";

const subject_slice = createSlice({
  name: "subj",
  initialState: {
    subjects: [],
    addsub: {},
    loading: false,
    error: null,
    meta: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_subject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_subject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
        state.meta = action.payload.meta;
      })
      .addCase(get_subject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add
      .addCase(Add_subject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Add_subject.fulfilled, (state, action) => {
        state.loading = false;
        state.addsub = action.payload;
      })
      .addCase(Add_subject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update
      .addCase(update_Subject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_Subject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSubject = action.payload;

        console.log("Current subjects:", state.subjects); // Debug

        if (Array.isArray(state.subjects)) {
          const index = state.subjects.findIndex(
            (sub) => sub.id === updatedSubject.id
          );
          if (index !== -1) {
            state.subjects[index] = updatedSubject;
          }
        } else {
          console.error("subjects is not an array:", state.subjects);
        }
      })

      .addCase(update_Subject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Delete subject
      .addCase(delete_subject.pending, (state) => {
        state.loading = true;
      })
      .addCase(delete_subject.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.subjects)) {
          state.subjects = state.subjects.filter(
            (b) => b.id !== action.payload
          );
        } else {
          console.error(
            "Expected subjects to be an array, got:",
            state.subjects
          );
          state.subjects = []; // fallback to avoid crashes
        }
      })
      .addCase(delete_subject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubjectCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjectCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default subject_slice.reducer;
