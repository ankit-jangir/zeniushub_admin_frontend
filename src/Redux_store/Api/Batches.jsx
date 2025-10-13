import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Add Batches
export const Add_Batches = createAsyncThunk(
  "Add_Batches",
  async ({data ,token}, { rejectWithValue }) => {
    try {
     console.log(data,"*****************data");
     
      const response = await fetch(`${BASE_URL}/api/v1/batchrouter/addbatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log;

      if (!response.ok) {
        // console.error(" API returned an error:", result);
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      // console.error(" Request failed:", error);
      return rejectWithValue(error);
    }
  }
);



export const CoursebyAdd_Batches = createAsyncThunk(
  "batches/add",
  async ({ batchData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/batchrouter/addbatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(batchData),
      });

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(
          result?.error?.[0]?.message || result?.message || "Failed to add batch"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Request failed",
      });
    }
  }
);

// get api
export const get_Batches = createAsyncThunk(
  "get_Batches",
  async (
    // { searchTerm, page, querystatus, limit }, { rejectWithValue }
    { searchTerm = "", page = 1, querystatus = "All", limit = 10 , token} = {},
    { rejectWithValue }
  ) => {
    try {
      if (querystatus === "All") {
        querystatus = "";
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/searching?BatchesName=${searchTerm}&page=${page}&limit=${limit}&status=${querystatus}`,
        {
          method: "GET",
            headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// get batches by courseId
export const fetchBatchesByCourseId = createAsyncThunk(
  "batch/fetchByCourseId",
  async ({ courseId, token }, { rejectWithValue }) => {
    console.log("id access", courseId);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/getBatchByCourseIdController/${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token added
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

// update time
export const update_time_Batches = createAsyncThunk(
  "batch/updateTimeBatch",
  async (data, { rejectWithValue }) => {
    // Validate inputs
    if (!data?.id || isNaN(data.id)) {
      return rejectWithValue("Invalid batch ID: ID is undefined or not a number");
    }
    if (!data?.token || typeof data.token !== "string") {
      return rejectWithValue("Invalid token: Token is undefined or not a string");
    }
    if (!data?.StartTime || !/^\d{2}:\d{2}:\d{2}$/.test(data.StartTime)) {
      return rejectWithValue("Invalid start time format. Use HH:mm:ss");
    }
    if (!data?.EndTime || !/^\d{2}:\d{2}:\d{2}$/.test(data.EndTime)) {
      return rejectWithValue("Invalid end time format. Use HH:mm:ss");
    }

    try {
      console.log("Updating batch time with data:", data); // Debug log
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/timeupdate?id=${data.id}&start_time=${data.StartTime}&end_time=${data.EndTime}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        return rejectWithValue(
          result?.error?.[0]?.message || result?.message || "Batch time update failed"
        );
      }

      return result.data;
    } catch (error) {
      console.error("API Error:", error); // Debug log
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// update batch
export const update_Batches = createAsyncThunk(
  "batch/updateBatch",
  async ({ payload, token }, { rejectWithValue }) => {
    // Validate inputs
    if (!payload?.id || isNaN(payload.id)) {
      return rejectWithValue("Invalid batch ID: ID is undefined or not a number");
    }
    if (!token || typeof token !== "string") {
      return rejectWithValue("Invalid token: Token is undefined or not a string");
    }
    if (!payload?.batchName) {
      return rejectWithValue("Batch name is required");
    }
    // Validate startTime and endTime if provided
    if (payload?.startTime && !/^\d{2}:\d{2}:\d{2}$/.test(payload.startTime)) {
      return rejectWithValue("Invalid start time format. Use HH:mm:ss");
    }
    if (payload?.endTime && !/^\d{2}:\d{2}:\d{2}$/.test(payload.endTime)) {
      return rejectWithValue("Invalid end time format. Use HH:mm:ss");
    }

    try {
      console.log("Updating batch with payload:", payload, "Token:", token); // Debug log
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/batchupdate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: payload.id,
            batchName: payload.batchName,
            startTime: payload.startTime, // Changed to match UI
            endTime: payload.endTime, // Changed to match UI
            course: payload.course, // Include if required by backend
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        return rejectWithValue(result?.message || "Batch update failed");
      }

      return result.data.lastfinaldata; // Return updated batch data
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

//Search
export const search_Batches = createAsyncThunk(
  "batch/searchBatch",
  async ({batchName, token}, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/v1/batchrouter/searching?BatchesName=${batchName}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          
          Authorization: `Bearer ${token}`,
        
        },
      });
      // console.log(response, "******************** response");

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// get view detail
export const fetchStudents = createAsyncThunk(
  "courseStudents/fetchByCourseId",
  async ({ batchid, Session_id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/coursestudentcontroller/${batchid}?session_id=${Session_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token set here
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch course students");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBatch = createAsyncThunk(
  "batches/deleteById",
  async ({id, token}, { rejectWithValue }) => {
    
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/deletebatchescontroller?id=${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json(); // ✅ fetch JSON first

      if (!response.ok) {
        return rejectWithValue(data); // ✅ now we can safely pass it
      }

      return data; // e.g., { message: "Batch activated successfully." }
    } catch (error) {
      // Ensure consistency by returning the error as an object with 'message'
      return rejectWithValue({ message: error.message });
    }
  }
);

export default {
  Add_Batches,
  get_Batches,
  update_time_Batches,
  update_Batches,
  search_Batches,
  fetchStudents,
  deleteBatch,
};
