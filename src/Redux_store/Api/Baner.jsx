// src/redux/commonApis/getTeam.js (or wherever you keep common API logic)
import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// get banner
export const get_banner_api = createAsyncThunk(
  "get_banner",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/banner/get`, {
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
      // console.log("ff", result);

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// add banner

export const add_banner = createAsyncThunk(
  "add_banner",
  async ({ file, token }, { rejectWithValue }) => {
    try {
      const formdata = new FormData();
      formdata.append("image_path", file);
      const response = await fetch(`${BASE_URL}/api/v1/banner/add`, {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// delete banner

export const delete_banner = createAsyncThunk(
  "del_banner",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/v1/banner/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!responce.ok) {
        const errordata = await responce.json();
        return rejectWithValue(errordata);
      }
      const result = await responce.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "something went wrong ");
    }
  }
);

export default { get_banner_api, delete_banner, add_banner };
