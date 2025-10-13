import { createSlice } from "@reduxjs/toolkit";
import {
  fetch_department_list,
  EmployeeAccount,
  grant_salary,
  createSalaryEntry,
  salaryhistory,
  fetchUpcomingSalary,
  // addgrandsalary,
} from "../Api/team_account_api";
import addgrandsalary from "../Api/team_account_api";

const salarySlice = createSlice({
  name: "salary",
  initialState: {
    data: null,
    grandsallary: null,
    entries: [],
    history: null,
    Account: null,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetch_department_list.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch_department_list.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetch_department_list.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //Employeee Account
    builder
      .addCase(EmployeeAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EmployeeAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.Account = action.payload;
      })
      .addCase(EmployeeAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // grant salary
    builder
      .addCase(grant_salary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(grant_salary.fulfilled, (state, action) => {
        state.loading = false;
        state.grandsallary = action.payload;
      })
      .addCase(grant_salary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // add grand sallary
    builder
      .addCase(createSalaryEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalaryEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(createSalaryEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(salaryhistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(salaryhistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(salaryhistory.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });
    builder
      .addCase(fetchUpcomingSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchUpcomingSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default salarySlice.reducer;
