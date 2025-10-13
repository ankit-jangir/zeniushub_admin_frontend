import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

//get_admin
export const view_admin_profile = createAsyncThunk(
  "view_admin_profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/profile/view`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const change_admin_password = createAsyncThunk(
  "admin/password/change",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/password/change`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), // ✅ ONLY send data
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//update_admin_profile
export const Update_Admin = createAsyncThunk(
  "Update_Admin",
  async (data, { rejectWithValue }) => {
    // data.data.m_number = Number(data.data.m_number);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/admin/update`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle API errors
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result; // Successful response, return the result
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
