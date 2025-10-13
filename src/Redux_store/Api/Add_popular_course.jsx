import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;
// get course
export const get_course = createAsyncThunk(
  "getcourse",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/popularCourses/get-course`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responce.ok) {
        const errordata = responce.json();
        return rejectWithValue(errordata);
      }
      const result = await responce.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// add course
export const add_course = createAsyncThunk(
  "form",
  async ({ formdata, token }, { rejectWithValue }) => {
    console.log(formdata, "*****************************************");
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/popularCourses/add-course`,
        {
          method: "POST",
          body: formdata,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata);
      }

      const result = await responce.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// DELETE Popular Course by ID
export const deletePopularCourse = createAsyncThunk(
  "popularCourses/deletePopularCourse",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://adminv2-api-dev.intellix360.in/api/v1/popularCourses/remove-course/${id}`,
        {
          method: "DELETE",
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
      return data; // success response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export default { get_course, add_course, deletePopularCourse };

// export default { get_course, add_course  }
