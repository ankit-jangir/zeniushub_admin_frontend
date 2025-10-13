import { createSlice } from "@reduxjs/toolkit";
import {
  GetTeam,
  Update_Employee,
  Update_Time,
  addTask,
  create_employee,
  fetchActiveEmployees,
  fetchTaskCount,
  get_assigned_task,
  getoneemployee,
  updateEmployee,
  update_Employee_Status,
} from "../Api/TeamApi";

const initialState = {
  Teachers: [],
  tasks: [],
  data: {},
  response: [],
  loading: false,
  error: null,
  Searchemployees: [],
  updateSuccess: false,
  message: "",
  employees: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    searchUser: (state, action) => {
      state.Searchemployees = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      //////Create
      .addCase(create_employee.pending, (state) => {
        state.loading = true;
      })
      .addCase(create_employee.fulfilled, (state, action) => {
        state.loading = false;
        // state.Teachers.push(action.payload);
      })
      .addCase(create_employee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //////Get
      .addCase(GetTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.Teachers = action.payload?.result || [];
      })

      .addCase(GetTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data";
      })

      //DeleteEmployee
      .addCase(update_Employee_Status.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(update_Employee_Status.fulfilled, (state, action) => {
        state.loading = false;
        state.Teachers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(update_Employee_Status.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // see profile of employee by single emp id
      .addCase(getoneemployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getoneemployee.fulfilled, (state, action) => {
        (state.loading = false), (state.profile = action.payload);
      })
      .addCase(getoneemployee.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })

      //Update_time
      .addCase(Update_Time.pending, (state) => {
        state.loading = true;
      })
      .addCase(Update_Time.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.Teachers)) {
          state.Teachers = state.Teachers.map((ele) =>
            ele.id === action.payload.id ? action.payload : ele
          );
        } else {
          state.Teachers = [];
        }
      })
      .addCase(Update_Time.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      //Update_Employee
      .addCase(Update_Employee.pending, (state) => {
        state.loading = true;
        state.error = null; // clear previous errors
      })

      .addCase(Update_Employee.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.Teachers = state.Teachers.map((emp) =>
          emp.id === updated.id ? updated : emp
        );
      })
      .addCase(Update_Employee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // get assign task
      .addCase(get_assigned_task.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_assigned_task.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(get_assigned_task.rejected, (state, action) => {
        state.loading = false;
        state.tasks = [];
        state.error = action.payload;
      })
      // count task assigned
      .addCase(fetchTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.response = action.payload;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.updatedEmployee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.updateSuccess = false;
      });

    builder
      .addCase(fetchActiveEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchActiveEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;
export const { searchEmployee } = teamSlice.actions;
