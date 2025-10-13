import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBatchbycourseid = createAsyncThunk(
  "batch/fetchByCourseId",
  async ({ courseId, token }, { rejectWithValue }) => {
    console.log(courseId, "************************courseId");

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/getBatchByCourseIdController/${courseId}`, {
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch batches"
      );
    }
  }
);

export const fetchCoursesBySubject = createAsyncThunk(
  "coursesBySubject/fetchCoursesBySubject",
  async ({courseId, token}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/subjectcoursesrouter/getallsubcoursecontroller?course_id=${courseId}`,{
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
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch subcourses"
      );
    }
  }
);



export const assignSubjectsToEmployee = createAsyncThunk(
  "employee/assignSubjects",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        let errorMessage = "Failed to assign subjects"; 

        if (errorData.error && Array.isArray(errorData.error) && errorData.error.length > 0) {
          errorMessage = errorData.error[0].message; 
        } else if (errorData.message) {
          errorMessage = errorData.message; 
        }

        return rejectWithValue(errorMessage); 
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);



export const getEmployeeBatchSubject = createAsyncThunk(
  "employee/getEmployeeBatchSubject",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/assignbatchsubject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch employee data"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);



export const deleteEmployeeAssignment = createAsyncThunk(
  'employee/deleteEmployeeAssignment',
  async ({ employee_id, batch_id, subject_id, token }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (employee_id) queryParams.append('employee_id', employee_id);
      if (batch_id) queryParams.append('batch_id', batch_id);
      if (subject_id) queryParams.append('subject_id', subject_id);

      const response = await fetch(`${BASE_URL}/api/v1/employee/assignbatchsubjectdelete?${queryParams.toString()}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export default {
  getBatchbycourseid,
  fetchCoursesBySubject,
};
