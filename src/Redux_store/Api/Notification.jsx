import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// get course
export const get_notification = createAsyncThunk(
  "getnotify",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/notifactionrouter/getallnotificationcontroller`,
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
// add notify
export const add_notification = createAsyncThunk(
  "addnotify",
  async ({ notificationData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/notifactionrouter/addnotifactioncontroller`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notificationData),
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result.data; // directly returning the data object
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete notify
export const delete_notify = createAsyncThunk(
  "del_banner",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/notifactionrouter/deleteallnotificationcontroller/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata);
      }
      const result = await responce.json();
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "something went wrong ");
    }
  }
);

export default { get_notification, add_notification, delete_notify };
