import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
let token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_URL;
//create_Session
export const addSession = createAsyncThunk(
  "ession/add",
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/session/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//fetch_Session
export const fetchSessions = createAsyncThunk(
  "session/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/v1/session/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata.message || "Failed to fetch sessions");
      }

      const result = await responce.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSessions = createAsyncThunk(
  "session/fetchSessions",
  async ({ page = 1, session_year = "", limit = 10 }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        page,
        session_year,
        limit,
      }).toString();

      const response = await fetch(`${BASE_URL}/api/v1/session/get?${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sessions");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultSession = createAsyncThunk(
  "session/setDefaultSession",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/session/defaultset`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchSessionCount = createAsyncThunk(
  "sessionCount/fetchSessionCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/session/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json(); // <-- Yahan response ko JSON mein convert karo

      return data; // <-- Ab data return karo
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
