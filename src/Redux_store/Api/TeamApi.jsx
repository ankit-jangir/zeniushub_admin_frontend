// src/redux/commonApis/getTeam.js (or wherever you keep common API logic)
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

///Create Employee
export const create_employee = createAsyncThunk(
  "create_employee",
  async ({ data, token }, { rejectWithValue }) => {

    const newData = { ...data, department: JSON.stringify(data.department) };
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//////Get Teacher
export const GetTeam = createAsyncThunk(
  "getTeam",
  async ({ first_name, joining_date,limit, token,page }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/search?first_name=${first_name}&joining_date=${joining_date}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
// employee  profile by id
export const getoneemployee = createAsyncThunk(
  "profile",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/getOne/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//update_Employee_Status

export const update_Employee_Status = createAsyncThunk(
  "update_Employee_Status",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/updateEmployeeStatus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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

//update_time
export const Update_Time = createAsyncThunk(
  "Update_Time",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const { id, ...rest } = data;

      const response = await fetch(
        `${BASE_URL}/api/v1/employee/updateTime/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rest),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to update time. Please try again.",
      });
    }
  }
);

//Update_Employeee
export const Update_Employee = createAsyncThunk(
  "employee/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/update/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// view assign task

export const get_assigned_task = createAsyncThunk(
  "task/get_assigned_task",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      // const response = await fetch(`${BASE_URL}/api/v1/task/assigned/${id}`, {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/task/getbyemployee_id/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned tasks");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// add task

export const addTask = createAsyncThunk(
  "task/addTask",
  async ({ formData, token }, { rejectWithValue }) => {

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/task/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// count assigend task

export const fetchTaskCount = createAsyncThunk(
  "taskCount/fetchTaskCount",
  async ({ employeeId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/task/countbyemployee_id/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task count");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, employeeData, token }, { rejectWithValue }) => {
   
    try {

       const formDataToSend = new FormData();


   Object.entries(employeeData).forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
        if (key === "department") {
          formDataToSend.append(key, JSON.stringify(value)); 
        } else if (key === "image_path") {
          if (
            value instanceof File &&
            value.type.match(/^image\/(jpeg|png|jpg|webp|svg\+xml)$/)
          ) {
            console.log("Image file detected:", value.name); 
            formDataToSend.append("image_path", value);
          } else {
            console.log("No valid image file for image_path"); 
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(`${BASE_URL}/api/v1/employee/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const fetchActiveEmployees = createAsyncThunk(
  'employees/fetchActive',
  async (token, {rejectWithValue}) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/getActiveEmp`, {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default {
  GetTeam,
  create_employee,
  update_Employee_Status,
  Update_Time,
  Update_Employee,
  get_assigned_task,
  fetchTaskCount,
  addTask,
  updateEmployee
};

