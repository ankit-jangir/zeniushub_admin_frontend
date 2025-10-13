import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Add subject
export const Add_subject = createAsyncThunk(
  "Add_subject",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      console.log("Sending subject payload:", data);

      const response = await fetch(
        `${BASE_URL}/api/v1/subjectrouter/addsubject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token added
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("API returned an error:", result);
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      console.error("Request failed:", error);
      return rejectWithValue(error.message || error);
    }
  }
);

// get api
export const get_subject = createAsyncThunk(
  "get_subject",
  async ({ page, limit, search , token}, { rejectWithValue }) => {
    try {
      // Prepare search query if it exists
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";

      const response = await fetch(
        `${BASE_URL}/api/v1/subjectrouter/getallsubjectcontroller?page=${page}&limit=${limit}${searchQuery}`,
        {
          method: "GET",
            headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", result);
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      console.error("Request Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// update
export const update_Subject = createAsyncThunk(
  "subject/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/subjectrouter/updatebysubjectnamecontroller`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token set here
          },
          body: JSON.stringify(data),
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

// delete api
export const delete_subject = createAsyncThunk(
  "del_subject",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/subjectrouter/deletesubjectcontroller?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token added
          },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      await response.json(); // We don't need the result
      return id; // ✅ Return id so reducer can remove it from state
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// edit course multiple
export const fetchSubjectCourses = createAsyncThunk(
  "subjectCourses/fetchSubjectCourses",
  async ({ subjectId, token }, { rejectWithValue }) => {
    try {
      console.log("DEBUG: Fetching subject courses for:", subjectId);

      const response = await fetch(
        `${BASE_URL}/api/v1/subjectcoursesrouter/course?subject_id=${subjectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token added
          },
        }
      );

      if (!response.ok) {
        const errordata = await response.json();
        return rejectWithValue(errordata);
      }

      const data = await response.json();
      console.log("DEBUG: API Response:", data);
      return data;
    } catch (error) {
      console.error("DEBUG: Fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export default {
  Add_subject,
  get_subject,
  update_Subject,
  delete_subject,
};
