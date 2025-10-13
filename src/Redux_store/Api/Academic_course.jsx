import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// get course
export const get_course = createAsyncThunk(
  "getcourse",
  async (token, { rejectWithValue }) => {
    try {
      const responce = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/getallcoursescontroller`,
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

// add course
export const add_course = createAsyncThunk(
  "addcourse",
  async ({ courseData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/addcourse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ token added
          },
          body: JSON.stringify(courseData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add course");
    }
  }
);

// update course
export const update_course = createAsyncThunk(
  "data/update_course",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      console.log(payload, "************************ payload");

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`); // ✅ token added

      const raw = JSON.stringify(payload);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/updatecoursescontroller`, // ✅ use your BASE_URL
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      console.log(result, "****************** result in api");
      return result;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const view_detail_Batches = createAsyncThunk(
  "view_Batche",
  async ({ id, token }, { rejectWithValue }) => {
    
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/batchrouter/getBatchByCourseIdController/${id}`,
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

      return result.datas;
    } catch (error) {
      console.error("Request Failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// search
export const searchCoursesByName = createAsyncThunk(
  "courses/searchByName",
  async ({courseName, token}, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/v1/coursesrouter/Searchbycoursesnamecontroller?course_name=${courseName}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        
          Authorization: `Bearer ${token}`,
        
        },
      });

      const data = await response.json();
      console.log("Course name", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// get subject
export const get_subject = createAsyncThunk(
  "subjects/getAll",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/subjectrouter/getallsubjectcontroller`,
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

export const fetchCoursesByName = createAsyncThunk(
  "courses/fetchByName",
  async (
    { course_name, course_type, status, page, limit, token },
    { rejectWithValue }
  ) => {
    try {
      if (course_type === "All") {
        course_type = "";
      }
      if (status === "All") {
        status = "";
      }
      const response = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/Searchbycoursesnamecontroller?course_name=${course_name}&course_type=${course_type}&status=${status}&page=${page}&limit=${limit}`,
        {  headers: {
          Authorization: `Bearer ${token}`,
        },}
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch courses");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteById",
  async ({ courseId, token }, { rejectWithValue }) => {
    // Validate courseId
    if (!courseId || isNaN(courseId)) {
      return rejectWithValue("Invalid course ID: courseId is undefined or not a number");
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/deletecoursecontroller/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      return { id: courseId, message: data.message };
    } catch (error) {
      return rejectWithValue(error.message || "Error deleting course");
    }
  }
);

//mark active course
export const markCourseActive = createAsyncThunk(
  "courses/markCourseActive",
  async ({ id, token }, { rejectWithValue }) => {
    // Validate inputs
    if (!id || isNaN(id)) {
      return rejectWithValue("Invalid course ID: ID is undefined or not a number");
    }
    if (!token || typeof token !== "string") {
      return rejectWithValue("Invalid token: Token is undefined or not a string");
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/coursesrouter/mark-active?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export default {
  get_course,
  add_course,
  update_course,
  searchCoursesByName,
  get_subject,
  view_detail_Batches,
};

