import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL

export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudentAttendance',
  async ({ enrollmentId, month, year, token }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/v1/attendence/getsinglestudent?month=${month}&year=${year}&enrollmentId=${enrollmentId}`;
      const response = await fetch(url, {
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch attendance');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
