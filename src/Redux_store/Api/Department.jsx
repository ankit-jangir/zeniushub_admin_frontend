// src/redux/commonApis/getTeam.js (or wherever you keep common API logic)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { data } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;

////Create Department
export const create_department = createAsyncThunk(
  "create_department",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/adddepartment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Agar backend response me error hai to
        return rejectWithValue(result || { message: "Something went wrong!" });
      }

      return result;
    } catch (error) {
      return rejectWithValue(error?.message || "Unknown error");
    }
  }
);

//////Get Teacher
export const get_Deparment = createAsyncThunk(
  "get_Deparment",
  async ({ searchName = "", token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/getDepartment?name=${encodeURIComponent(
          searchName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(result);
      }

      return Array.isArray(result.data) ? result.data : result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

///Delete_department
export const delete_department = createAsyncThunk(
  "delete_department",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/deleteDepartment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }), // id ko body me bhejna
        }
      );
      const result = await response.json();
      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const view_department_users = createAsyncThunk(
  "department/viewUsers",
  async ({ body, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/filterdata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: body.id }), // <-- yaha body se id nikalni hai
        }
      );

      const data = await response.json();
      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// get grant access control
export const fetchAccessDepartments = createAsyncThunk(
  "department/fetchAccessDepartments",
  async ({ id, token }) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/departmentrouter/getAccessDepartment?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errordata = await response.json();
      return rejectWithValue(errordata);
    }

    const data = await response.json();
    return data;
  }
);

// get available access
export const get_available_Access = createAsyncThunk(
  "/AccessDepartments",
  async ({ id, token }) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/departmentrouter/access-control?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errordata = await response.json();
      return rejectWithValue(errordata);
    }

    const data = await response.json();
    return data;
  }
);

// get All_available access
export const get_all_available_Access = createAsyncThunk(
  "/AccessDepartment",
  async (token) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/departmentrouter/access/control`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errordata = await response.json();
      return rejectWithValue(errordata);
    }

    const data = await response.json();

    return data;
  }
);

// add access
export const assignAccessDepartments = createAsyncThunk(
  "departmentAccess/assignAccessDepartments",
  async ({ id, array, token }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        id,
        array: JSON.stringify(array), // Make sure array is passed as string
      });

      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/accessdepartment?${params}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// update acces control

export const updateAccessDepartment = createAsyncThunk(
  "department/updateAccess",
  async ({ id, accessControlIds, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/departmentrouter/updateAccessDepartment?id=${id}&accessControlIds=${accessControlIds}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessControlIds }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export default {
  create_department: [Function],
  get_Deparment: [Function],
  delete_department: [Function],
  view_department_users: [Function],
  fetchAccessDepartments: [Function],
  get_available_Access: [Function],
  assignAccessDepartments: [Function],
  updateAccessDepartment: [Function],
  get_all_available_Access: [Function],
};
