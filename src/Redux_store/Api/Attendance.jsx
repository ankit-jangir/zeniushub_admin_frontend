// import { createAsyncThunk } from "@reduxjs/toolkit";
// const BASE_URL = import.meta.env.VITE_BASE_URL

// export const fetchAttendance = createAsyncThunk(
//   'attendance/fetchAttendance',
//   async ({ sessionID, name , batch , enrollment_id , page = 1, limit = 10, date  }, { rejectWithValue }) => {
//     try {
//       // ✅ Optional: Validate and format date
//       const isValidDate = (d) => !isNaN(new Date(d).getTime());
//       const formattedDate = isValidDate(date)
//   ? date
//   : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

//       const url = new URL(`https://adminv2-api-dev.intellix360.in/api/v1/attendence/getstudent`);
//       url.searchParams.append("sessionId", sessionID);
//       url.searchParams.append("name", name);
//       url.searchParams.append("batch", batch);
//       url.searchParams.append("enrollment_id", enrollment_id);
//       url.searchParams.append("page", page);
//       url.searchParams.append("limit", limit);
//       url.searchParams.append("date", formattedDate);

//       const response = await fetch(url);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to fetch attendance');
//       }
// console.log(result.data?.totalStudent );

//       return {
//         data: result.data?.data || [],
//         total: result.data?.total ?? 0,
//         page: result.data?.page ?? 1,
//         limit: result.data?.limit ?? 10,
//         totalStudent: result.data?.totalStudent ?? 0,
//         totalPresent: result.data?.totalPresent ?? 0,
//         totalAbsent: result.data?.totalAbsent ?? 0,
//         totalHalfday: result.data?.totalHalfday ?? 0,

//       };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const export_excel = createAsyncThunk(
//   'attendance/exportExcel',
//   async (data, { rejectWithValue }) => {
//     console.log(data);

//     console.log("Export Excel called");
//     try {
//       // const formData = new FormData();
//       // formData.append('from', from);
//       // formData.append('to', to);
//       // formData.append('Batch_id', Batch_id);
//       const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

//       const response = await fetch(
//         `https://adminv2-api-dev.intellix360.in/api/v1/attendence/exportdatainExcel`,
//         {
//           method: 'POST',
//           headers: myHeaders,
//           body: JSON.stringify({
//             "from": data.from,
//             "to": data.to,
//             "Batch_id": data.Batch_id
//           }),
//             redirect: "follow"
//         }
//       );
//       console.log("Call Api : ");

//       if (!response.ok) {
//         const errorData = await response.json();
//         return rejectWithValue(errorData);
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'attendence.xlsx');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       return 'success';
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (
    { sessionID, name, batch, enrollment_id, page, limit, date, status, token },
    { rejectWithValue }
  ) => {

    try {
      // ✅ Optional: Validate and format date
      const isValidDate = (d) => !isNaN(new Date(d).getTime());
      const formattedDate = isValidDate(date)
        ? date
        : new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

      const url = new URL(
        `${BASE_URL}/api/v1/attendence/getstudent`
      );
      url.searchParams.append("sessionId", sessionID);
      url.searchParams.append("name", name);
      url.searchParams.append("status", status);
      url.searchParams.append("batch", batch);
      url.searchParams.append("enrollment_id", enrollment_id);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);
      url.searchParams.append("date", formattedDate);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log('====================================');
      console.log(result);
      console.log('====================================');
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch students attendance");
      }

      return {
        data: result?.data || [],
        total: result?.total ?? 0,
        page: result?.page ?? 1,
        limit: result?.limit ?? 10,
        totalStudent: result?.totalStudent ?? 0,
        totalPresent: result?.totalPresent ?? 0,
        totalAbsent: result?.totalAbsent ?? 0,
        totalHalfday: result?.totalHalfday ?? 0,
        totalPages: result?.totalPages ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const export_excel = createAsyncThunk(
  "attendance/exportExcel",
  async ({ data, token }, { rejectWithValue }) => {
    console.log(data);

    console.log("Export Excel called");
    try {
      // const formData = new FormData();
      // formData.append('from', from);
      // formData.append('to', to);
      // formData.append('Batch_id', Batch_id);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(
        `https://adminv2-api-dev.intellix360.in/api/v1/attendence/exportdatainExcel`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            from: data.from,
            to: data.to,
            Batch_id: data.Batch_id,
          }),
          redirect: "follow",
        }
      );
      console.log("Call Api : ");

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendence.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      return "success";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const markAllPresent = createAsyncThunk(
  'attendance/markAllPresent',
  async ({ body, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/markall-present`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);



export const markAllPresentByEmployee = createAsyncThunk(
  'attendance/markAllPresentEmployee',
  async ({ body, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/mark-present`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);



export const fetchEmployeeAttendance = createAsyncThunk(
  'employee/fetchAttendance',
  async ({ first_name, attendence_date, page, limit, status, token }, { rejectWithValue }) => {

    try {
      const response = await fetch(`${BASE_URL}/api/v1/employee/searchempcontroller?attendence_date=${attendence_date}&first_name=${first_name}&page=${page}&limit=${limit}&status=${status}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const downloadEmployeeExcel = createAsyncThunk(
  'employee/downloadExcel',
  async ({ attendence_date, token }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({ attendence_date }).toString();
      const response = await fetch(
        `${BASE_URL}/api/v1/employee/saveactiveEmpwithdown?${query}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download Excel file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Auto trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_data.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);