import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const changestatusLeads = createAsyncThunk(
  "changestatusLeads",
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/api/v1/leadsrouter/changestatusLeadsController`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id,
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update status");
      }

      return { id, status, message: data.message };
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const getallLeads = createAsyncThunk(
  "getLeads",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/searchingleadsController`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Search Failed");
      }

      const result = await response.json();
      return result.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const AddLeads = createAsyncThunk(
  "addLeads",
  async ({payload, token}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/addleadscontroller`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();

      console.log(result, "************************8 result");
      return result.status;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const searchingleads = createAsyncThunk(
  "leads/search",
  async (payload, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ ...payload });

      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/searchingleadsController`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      console.log(result, "***************************resultresult");
      return result.data.updatedData;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getAllAssignto = createAsyncThunk(
  "Leads/getAllAssignto",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.getResponse;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const searchLeads = createAsyncThunk(
  "leads/searchLeads",
  async ({sessionId, token}, { rejectWithValue }) => {
    const { name, session_id, status, page, limit, assign_to } = sessionId;

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/searchingleadsController?name=${name}&status=${status}&limit=${limit}&id=${session_id}&page=${page}&assign_to=${assign_to}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Search Failed");
      }

      const result = await response.json();
      // console.log(result.data.data.data[0].id,"*******************************result");

      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const leadSummaryApi = createAsyncThunk(
  "Leads/leadSummaryApi",
  async (getId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/lead-summary?id=${getId}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const changeAssignLeads = createAsyncThunk(
  "leads/changeAssignLeads",
  async ({ id, assign_to, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/changeAssineTaskLeadscontroller`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, assign_to }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to assign lead");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const ConverttoStudent = createAsyncThunk(
  "leads/convertToStudent",
  async ({payload, token}, { rejectWithValue }) => {
    try {
      // Validate payload
      if (!payload.leadsId) {
        return rejectWithValue("Lead ID is required");
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/leadsrouter/converttostudent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        return rejectWithValue(
          data?.message || "Failed to convert lead to student"
        );
      }

      return data?.data?.updatedData || data;
    } catch (error) {
      console.error("Network or Parsing Error:", error);
      return rejectWithValue(
        error?.message || "An unexpected error occurred during conversion"
      );
    }
  }
);
