// Redux_store/Api/ProtectRoute_api.js
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const CheckToken = createAsyncThunk(
  "CheckToken",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/ping`, {
        method: "GET", // ✅ Change POST to GET
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Invalid token");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Token check failed");
    }
  }
);

