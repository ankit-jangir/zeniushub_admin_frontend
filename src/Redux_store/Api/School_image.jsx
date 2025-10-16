import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const get_school = createAsyncThunk(
  "get",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/v1/schoolImage/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata);
      }
      const data = await responce.json();
      console.log(data, "data 5555555555555555555555");

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// update school
export const updateSchoolInfo = createAsyncThunk(
  "school",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/schoolImage/update`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update school info");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// add school
export const addSchoolInfo = createAsyncThunk(
  "school/add",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/schoolImage/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add school info");
      }

      const data = await response.json();
      console.log("only console response : ",response)
      console.log("user data : ",response.data)
      console.log(data, "School added successfully");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export default { get_school, updateSchoolInfo, addSchoolInfo };
