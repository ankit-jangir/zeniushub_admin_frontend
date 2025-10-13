// ✅ Only named exports - Good practice
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 🔧 Async thunk for fetching fitter status (leads search)
export const FitterStatus = createAsyncThunk(
  "leads/search",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/filterleadsstatuscontroller/Hot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // 🔁 Adjust this based on actual backend structure
      return data.data?.updatedData || [];
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
