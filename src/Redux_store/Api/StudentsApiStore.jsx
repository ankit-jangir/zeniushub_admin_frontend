import { createAsyncThunk } from "@reduxjs/toolkit";
import DateString from "es-abstract/2018/DateString";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getStudents = createAsyncThunk(
  "getStudents",
  async (
    { token,
      limit,
      page,
      name = "",
      session_id,
      course_id = "",
      batch_id = "",
      rt = "false",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        name,
        course_id,
        batch_id,
        rt,
        
        session_id,
      }).toString();

      const url = `${BASE_URL}/api/v1/student/allStudents?${queryParams}`;

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, requestOptions);

      // Check if response is OK (status 200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      // Parse response as JSON
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const getStudentsCoursesFees = createAsyncThunk(
  "getStudentsCoursesFees",
  async (id, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/student/student/batch-info/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {

      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getSingleStudent = createAsyncThunk(
  "getSingleStudent",
  async ({ id,token }, {  rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/student/students/enrollment/${id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const addStudentsExcel = createAsyncThunk(
  "students/addStudentsExcel",
  async ({ file, batch_id, course_id, session_id, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("batch_id", batch_id);
      formData.append("course_id", course_id);
      formData.append("session_id", session_id);

      const response = await fetch(`${BASE_URL}/api/v1/student/uploadexcel`, {
        method: "POST",
         headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: "follow",
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (data?.errors?.length > 0) {
          errorMessage = data.errors.map((err) => `${err.message}`).join(", ");
        } else if (data?.message) {
          errorMessage = data.message;
        }

        return rejectWithValue(errorMessage);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async ({studentData, token}, { rejectWithValue }) => {

    try {
      const formdata = new FormData();
      formdata.append("course_id", studentData.course_id);
      formdata.append("batch_id", studentData.batch_id);
      formdata.append("name", studentData.name);
      formdata.append("address", studentData.address);
      formdata.append("adhar_no", studentData.adhar_no);
      formdata.append("contact_no", studentData.contact_no);
      formdata.append("father_name", studentData.father_name);
      formdata.append("mother_name", studentData.mother_name);

      formdata.append("dob", studentData.dob);
      formdata.append("joining_date", studentData.joining_date);
      formdata.append("gender", studentData.gender);
      formdata.append("profile_image", studentData.profile_image);
      formdata.append("session_id", studentData.session_id);
      const response = await fetch(`${BASE_URL}/api/v1/student/add`, {
        method: "POST",
       headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
        redirect: "follow",
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (data?.error?.length > 0) {
          errorMessage = data.error.map((err) => err.message).join(", ");
        } else if (data?.message) {
          errorMessage = data.message;
        }

        return rejectWithValue(errorMessage);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const check = createAsyncThunk(
  "students/checkAadharNo",
  async ({studentData, token}, { rejectWithValue }) => {
    try {
      const { adhar_no, contact_no } = studentData;

      const response = await fetch(
        `${BASE_URL}/api/v1/student/check?adhar_no=${adhar_no}&contact_no=${contact_no}`,
        {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },

          redirect: "follow",
        }
      );

      const data = await response.json();

      console.log(data, "api data");

      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (data?.error?.length > 0) {
          errorMessage = data.error.map((err) => err.message).join(", ");
        } else if (data?.message) {
          errorMessage = data.message;
        }

        return rejectWithValue(errorMessage);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ studentData, id, token }, { rejectWithValue }) => {
    console.log(studentData, "studentData");
    try {
      const formdata = new FormData();
      formdata.append("course_id", studentData.course_id);
      formdata.append("batch_id", studentData.batch_id);
      formdata.append("name", studentData.name);
      formdata.append("address", studentData.address);
      formdata.append("adhar_no", studentData.adhar_no);
      formdata.append("contact_no", studentData.contact_no);
      formdata.append("father_name", studentData.father_name);
      formdata.append("mother_name", studentData.mother_name);

      formdata.append("parent_adhar_no", studentData.parent_adhar_no || "");
      formdata.append("parent_account_no", studentData.parent_account_no || "");
      formdata.append("pancard_no", studentData.pancard_no || "");
      formdata.append("ifsc_no", studentData.ifsc_no || "");
      formdata.append("ex_school", studentData.ex_school || "");
      formdata.append("adhar_front_back", studentData.adhar_front_back || "");
      formdata.append("pancard_front_back", studentData.pancard_front_back || "");

      formdata.append("dob", studentData.dob);
      formdata.append("gender", studentData.gender);
      formdata.append("profile_image", studentData.file);
      formdata.append("email", studentData.email);
      formdata.append("joining_date", studentData.joining_date);

      const response = await fetch(`${BASE_URL}/api/v1/student/update/${id}`, {
        method: "PUT",
         headers: {
            Authorization: `Bearer ${token}`,
          },
        body: formdata,
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (data?.error?.length > 0) {
          errorMessage = data.error.map((err) => err.message).join(", ");
        } else if (data?.message) {
          errorMessage = data.message;
        }

        return rejectWithValue(errorMessage);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const updateStudentsRt = createAsyncThunk(
  "students/updateStudentRtIsha",
  async ({id, token}, { rejectWithValue }) => {
    try {
      console.log("Call me for Isha RT");

      const response = await fetch(
        `${BASE_URL}/api/v1/student/updateStudentrt/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );

      const data = await response.json();
      console.log(data, "********* updateStudentRtIsha data");

      if (!response.ok) {
        throw new Error(data.message || "Failed to update student RT for Isha");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const updateStudentStatus = createAsyncThunk(
  "students/updateStudentStatus",
  async (id,token, {  rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/student/updateStudentStatus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`, // Agar auth token lage to add this
          },
          redirect: "follow",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update student status");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getStudentRecipients = createAsyncThunk(
  "students/getStudentRecipients",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/receipt/generate/${id}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipients");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
