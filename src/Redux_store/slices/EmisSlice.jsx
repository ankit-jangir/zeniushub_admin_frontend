import { createSlice } from "@reduxjs/toolkit";
import {
  addEmis,
  getEmis,
  getEmisTotalAmounts,
  addOneShotEmis,
  getOneStudentPayment,
  fetchStudentEmi,
  fetchEmis,
  exportEmisExcel,
  showEmis,
  checkAmount,
  showEmisRecipt,
} from "../Api/EmisApiStore";

const EmisSlice = createSlice({
  name: "emis",
  initialState: {
    emiList: [],
    studentPayment: [],
    emiData: {},
    data: {
      totalAmount: 0,
      totalEmis: 0,
      missed: [],
      upcoming: [],
      paid: [],
      summary: {
        totalMissedFees: 0,
        totalCollectedFees: 0,
        totalUpcomingFees: 0,
      },
    },
    recive: [],
    loading: false,
    error: null,
    searchData: [],
    emis: [],
    amountData: null,
    amountError: null,
    amountStatus: null,
    status: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    fromDate: (state, action) => {
      state.firstDate = action.payload;
    },
    toDate: (state, action) => {
      state.toDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addEmis (for EMI payments)
      .addCase(addEmis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmis.fulfilled, (state, action) => {
        state.loading = false;
        const payload = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.data.missed = [...state.data.missed, ...payload];
      })
      .addCase(addEmis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add EMI";
      })
      // Handle addOneShotEmis (for one-shot payments)
      .addCase(addOneShotEmis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOneShotEmis.fulfilled, (state, action) => {
        state.loading = false;
        state.data.missed = [...state.data.missed, action.payload];
      })
      .addCase(addOneShotEmis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add one-shot EMI";
      })
      // Handle getEmis
      .addCase(getEmis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmis.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getEmis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch EMIs";
      })
      // Handle getEmisTotalAmounts
      .addCase(getEmisTotalAmounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmisTotalAmounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getEmisTotalAmounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch EMI total amounts";
      })
      // getOneStudentPayment
      .addCase(getOneStudentPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneStudentPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.studentPayment = action.payload;
      })
      .addCase(getOneStudentPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payment data";
      })
      // emi by student id
      .addCase(fetchStudentEmi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentEmi.fulfilled, (state, action) => {
        state.loading = false;
        state.emiList = action.payload;
      })
      .addCase(fetchStudentEmi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get emi account received
      .addCase(fetchEmis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmis.fulfilled, (state, action) => {
        state.loading = false;
        state.recive = action.payload;
      })
      .addCase(fetchEmis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // exportEmisExcel
      .addCase(exportEmisExcel.pending, (state) => {
        state.loading = true; // Corrected: Set loading to true during pending
        state.error = null;
      })
      .addCase(exportEmisExcel.fulfilled, (state) => {
        state.loading = false;
        // Success: file download handled in thunk itself
      })
      .addCase(exportEmisExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to export EMI Excel";
      })
      // showEmis
      .addCase(showEmis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(showEmis.fulfilled, (state, action) => {
        state.status = "success";
        state.emis = action.payload;
      })
      .addCase(showEmis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to show EMIs";
      })
      // checkAmount
      .addCase(checkAmount.pending, (state) => {
        state.loading = true;
        state.amountError = null;
        state.amountStatus = "pending";
      })
      .addCase(checkAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.amountData = action.payload;
        state.amountStatus = "fulfilled";
      })
      .addCase(checkAmount.rejected, (state, action) => {
        state.loading = false;
        state.amountError = action.payload;
        state.amountStatus = "rejected";
      })
      // showEmisRecipt
      .addCase(showEmisRecipt.pending, (state) => {
        state.status = "pending";
      })
      .addCase(showEmisRecipt.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        console.log( action.payload," action.payload");
        
      })
      .addCase(showEmisRecipt.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to show EMI receipt";
      });
  },
});

export const { clearError, toDate, fromDate } = EmisSlice.actions;
export default EmisSlice.reducer;