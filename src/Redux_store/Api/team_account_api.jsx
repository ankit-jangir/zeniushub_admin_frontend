import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// view department api

export const fetch_department_list = createAsyncThunk(
  "salary/fetchDepartmentSalaries",
  async ({token, department, name, limit, page }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        department,
        name,
        limit,
        page,
      });

 const response = await fetch(
  `${BASE_URL}/api/v1/Salary-Department/department-wise-salaries?${queryParams.toString()}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

////Employeeee account Api
export const EmployeeAccount = createAsyncThunk(
  "GetEmployeeAccount",
  async ({ token, search }, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const url = new URL(
        `${BASE_URL}/api/v1/Salary-Department/department-wise-Count?department_name=${search}`
      );

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// grant salary

export const grant_salary = createAsyncThunk(
  "grant/DepartmentSalaries",
  async ({ empId, fromDate, toDate, token }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Salary-Department/salerycreatecontroller?emp_id=${empId}&from_date=${fromDate}&to_date=${toDate}`, {
             headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// add grand salary

export const createSalaryEntry = createAsyncThunk(
  "salary/createSalaryEntry",
  async (
    { emp_id, amount, from_date, to_date, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Salary-Department/salerycreateEmploye?emp_id=${emp_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, from_date, to_date }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.error("API Error:", result);
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      console.error("Request Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// get salary history

export const salaryhistory = createAsyncThunk(
  "history/salaryhistory",
  async ({ empid, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Salary-Department/particularEmployeDetails?emp_id=${empid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", result);
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      console.error("Request Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// get upcomming salary

export const fetchUpcomingSalary = createAsyncThunk(
  "upcomingSalary/fetch",
  async ({ empid, token }) => {
    console.log(empid);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Salary-Department/upcomingsaleryController?employe_id=${empid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default {
  fetch_department_list,
  EmployeeAccount,
  grant_salary,
  createSalaryEntry,
  salaryhistory,
  fetchUpcomingSalary,
};
