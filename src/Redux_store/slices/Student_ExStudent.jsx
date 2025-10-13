import { createSlice } from "@reduxjs/toolkit";
import GetExStudent from "../Api/Student_ExStudent"; // Import the action creator

const initialState = {
  get_Exstudent: {
    students: [],
    totalRecords: 0, 
  },
  loading: false,
  error: null,
};

const ExstudentSlice = createSlice({
  name: 'Exstudent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetExStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetExStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.get_Exstudent = action.payload; // Save the API response
      })
      .addCase(GetExStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ExstudentSlice.reducer;
