import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addEmis = createAsyncThunk(
  "emi/addEmis",
  async ({emiData, token}, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify(emiData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/addEmi`,
        requestOptions
      );
      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (result?.error?.length > 0) {
          errorMessage = result.error.map((err) => err.message).join(", ");
        } else if (result?.message) {
          errorMessage = result.message;
        }

        return rejectWithValue(errorMessage);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getEmis = createAsyncThunk(
  "emis/getEmis",
  async ({ filters, token }, { rejectWithValue }) => {
    try {
      const {
        fromDate,
        toDate,
        status,
        courseId,
        batchId,
        page = 1,
        limit = 5,
      } = filters;

      const queryParams = new URLSearchParams({
        fromDate,
        toDate,
        status,
        courseId,
        batchId,
        page,
        limit,
      });

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/emis?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch EMIs");
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);
export const showEmis = createAsyncThunk(
  "emis/showEmis",
  async ({filters, token}, { rejectWithValue }) => {
    try {
      const { emi_frequency, discount_percentage, id } = filters;

      const requestOptions = {
        method: "GET",
         headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/showemi/${id}?emi_frequency=${emi_frequency}&discount_percentage=${discount_percentage}`,
        requestOptions
      );
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
export const checkAmount = createAsyncThunk(
  "emis/checkAmount",
  async ({filters, token}, { rejectWithValue }) => {
    try {
      // Ensure filters is an object; throw error if not provided or invalid
      if (!filters || typeof filters !== "object") {
        throw new Error("Invalid or missing filters");
      }

      // Use filters directly as payload to keep data dynamic
      const payload = { ...filters };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/checkemiamount`,
        requestOptions
      );
      const data = await response.json();
      console.log(data, "cje");

      if (!response.ok) {
        if (!response.ok) {
          let errorMessage = "Failed to update student";

          if (data?.error?.length > 0) {
            errorMessage = data.error.map((err) => err.message).join(", ");
          } else if (data?.message) {
            errorMessage = data.message;
          }

          return rejectWithValue(errorMessage);
        }
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to check EMI amount");
    }
  }
);
export const getEmisTotalAmounts = createAsyncThunk(
  "getEmisTotalAmounts",
  async ({year ,month,token}, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: "GET",
          headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      };

      const url = new URL(
        `${BASE_URL}/api/v1/emi/getEmisTotalAmounts?month=${month}&year=${year}`
      );
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch EMI total amounts");
      }
      console.log('====================================api  data :');
      console.log(result);
      console.log('====================================');
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const addOneShotEmis = createAsyncThunk(
  "emi/addOneShotEmis",
  async ({emiData, token}, { rejectWithValue }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        student_id: emiData.student_id,
        // amount: emiData.amount,
        discount_percentage: emiData.discount_percentage || 0,
        emi_duedate: emiData.emi_duedate,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/addOneShotEmi`,
        requestOptions
      );
      const result = await response.json();

      console.log(result, "result api");
      if (!response.ok) {
        let errorMessage = "Failed to update student";

        if (result?.error?.length > 0) {
          errorMessage = result.error.map((err) => err.message).join(", ");
        } else if (result?.message) {
          errorMessage = result.message;
        }

        return rejectWithValue(errorMessage);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const getOneStudentPayment = createAsyncThunk(
  "emi/getOneStudentPayment",
  async ({studentId, token}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/getOneStudentPayment/${studentId}`,
        {
          method: "GET", // <- workaround using POST instead
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: studentId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchStudentEmi = createAsyncThunk(
  "emi/fetchStudentEmi",
  async ({studentId, token}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/emi/getOneStudentPayment?id=${studentId}`,
        {
          method: "GET",
           headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const updateEmiPayment = createAsyncThunk(
  "emi/updateEmiPayment",
  async ({ emiId, paymentDate, token }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/v1/emi/emis/update-payment?emi_id=${emiId}&payment_date=${paymentDate}`;

      const response = await fetch(url, {
        method: "GET",
         headers: {
            Authorization: `Bearer ${token}`,
          },
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

export const fetchEmis = createAsyncThunk(
  "emis/fetchEmis",
  async (
    {
      fromDate,
      toDate,
      status,
      courseId = "",
      batchId = "",
      page = 1,
      limit = 5,
      token },
    thunkAPI
  ) => {
    try {
      const url = `${BASE_URL}/api/v1/emi/emis?fromDate=${fromDate}&toDate=${toDate}&status=${status}&courseId=${courseId}&batchId=${batchId}&page=${page}&limit=${limit}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const data = await res.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const showEmisRecipt = createAsyncThunk(
  'emis/showEmisRecipt',
  async ({studentId, token}, { rejectWithValue }) => {
    try {
      const requestOptions = {
        method: 'GET',
         headers: {
            Authorization: `Bearer ${token}`,
          },
        redirect: 'follow',
      };

      const response = await fetch(
        `${BASE_URL}/api/v1/emi/reciept?student_id=${studentId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the API returns JSON
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportEmisExcel = createAsyncThunk(
  "emis/exportExcel",
  async (
    { fromDate, toDate, status, courseId = "", batchId = "", token },
    thunkAPI
  ) => {
    try {
      const url = `${BASE_URL}/api/v1/emi/emis/download/excel?fromDate=${fromDate}&toDate=${toDate}&status=${status}&courseId=${courseId}&batchId=${batchId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },
      });

      if (!res.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "emis_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      return true; // Just return success
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
