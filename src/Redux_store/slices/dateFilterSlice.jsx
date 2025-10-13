// src/redux/slices/dateFilterSlice.js

import { createSlice } from "@reduxjs/toolkit";

const currentDate = new Date();

const initialState = {
  month: String(currentDate.getMonth() + 1),
  year: String(currentDate.getFullYear()),
};

const dateFilterSlice = createSlice({
  name: "dateFilter",
  initialState,
  reducers: {
    setMonth: (state, action) => {
      state.month = action.payload;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const { setMonth, setYear } = dateFilterSlice.actions;
export default dateFilterSlice.reducer;
