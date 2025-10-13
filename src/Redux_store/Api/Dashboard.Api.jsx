import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//  Employees API
export const Employesss = createAsyncThunk(
  "getcourse",
  async ({sessionID, token}, { rejectWithValue }) => {

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Desboardservice/getallemployesss?session_id=${sessionID}`,
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
      return result.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// Department API
export const Department = createAsyncThunk(
  "getdepartment",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Desboardservice/Departmentcontroller`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch departments");
      }

      return result.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
// Emi API
export const Emi = createAsyncThunk(
  "getemi",
  async ({sessionID, token}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/Desboardservice/emicontroller?session_id=${sessionID}`,
        {
          method: "GET",
            headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      )
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("🔥 Catch Error:", error);
      return rejectWithValue(error);
    }
  }
);

export const todaysummary = createAsyncThunk(
  "gettodaysummary",
  async (token, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "GET",
          headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      const url = new URL(`${BASE_URL}/api/v1/emi/emis/today-summary`);
      // url.searchParams.append("month", month);
      // url.searchParams.append("year", year);

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch EMI total amounts");
      }
     
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export default { Employesss, Department, Emi,todaysummary };
