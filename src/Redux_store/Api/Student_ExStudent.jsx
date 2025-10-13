import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * GetExStudent thunk with support for pagination and filtering by name or email.
 * @param {Object} params - Parameters for the API call.
 * @param {number} params.page - Current page number.
 * @param {number} params.pageSize - Number of items per page.
 * @param {string} [params.name] - Optional name to search by.
 * @param {string} [params.email] - Optional email to search by.
 */
export const GetExStudent = createAsyncThunk(
  "GetExStudent",
  async ({getData, token}, { rejectWithValue }) => {
    try {

      const response = await fetch(
        `${BASE_URL}/api/v1/student/inactive-students?sessionId=${getData.sessionid}&name=${getData.name}&page=${getData.page}&pageSize=${getData.pageSize}&email=&contact_no=`,
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
      console.log(result, "get studnet api")
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export default GetExStudent;
