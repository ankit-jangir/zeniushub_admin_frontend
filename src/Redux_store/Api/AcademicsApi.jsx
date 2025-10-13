import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getAllAcademicsdata = createAsyncThunk(
  "getAllAcademicsdata",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/Desboardservice/countAcademics`,
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