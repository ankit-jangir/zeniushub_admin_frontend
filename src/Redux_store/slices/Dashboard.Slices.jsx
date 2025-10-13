// import { createSlice } from "@reduxjs/toolkit";
// import { Employesss, Department, Emi , getEmisTotalAmounts,} from "../Api/Dashboard.Api";

// const initialState = {
//   getYear: 0,
//   employees: {},
//   departments: [],
//   emi: {},
//   loading: false,
//   error: null,
// };

// const EmployessSlices = createSlice({
//   name: "Employesss",
//   initialState,
//   reducers: {
//     setYear: (state, action) => {
//       state.getYear = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       //  Employees API Cases
//       .addCase(Employesss.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(Employesss.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = action.payload;
//       })
//       .addCase(Employesss.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Something went wrong";
//       })

//       //  Department API Cases
//       .addCase(Department.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(Department.fulfilled, (state, action) => {
//         state.loading = false;
//         state.departments = action.payload;
//       })
//       .addCase(Department.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Something went wrong";
//       })
//       // Emi API Cases
//       .addCase(Emi.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(Emi.fulfilled, (state, action) => {
//         state.loading = false;
//         state.emi = action.payload;
//       })
//       .addCase(Emi.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Something went wrong";
//       });

//        .addCase(getEmisTotalAmounts.pending, (state) => {
//               state.loading = true;
//               state.error = null;
//             })
//             .addCase(getEmisTotalAmounts.fulfilled, (state, action) => {
//               state.loading = false;
//               // const payload = action.payload.data || action.payload;
//               state.emiData = action.payload.data;
      
//               // state.data.totalAmount = payload.totalAmount || 0; // Store totalAmount
//               // state.data.totalEmis = payload.breakdown.totalEmis || 0; // Store totalEmis
//               // state.data.summary = {
//               //   totalMissedFees: payload.breakdown.totalMissedFees || 0,
//               //   totalCollectedFees: payload.amount_to_collect|| 0,
//               //   totalUpcomingFees: payload.breakdown.totalUpcomingFees || 0,
//               // };
//             })
//             .addCase(getEmisTotalAmounts.rejected, (state, action) => {
//               state.loading = false;
//               state.error = action.payload || "Failed to fetch EMI total amounts";
//             })
//   },
// });

// export default EmployessSlices.reducer;
// export const { setYear } = EmployessSlices.actions;

import { createSlice } from "@reduxjs/toolkit";
import {
  Employesss,
  Department,
  Emi,
  todaysummary,
} from "../Api/Dashboard.Api";

const initialState = {
  getYear: 0,
  employees: {},
  departments: [],
  emi: {},
  emiData: [], // Added for EMI total amounts
  loading: false,
  error: null,
};

const EmployessSlices = createSlice({
  name: "Employesss",
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.getYear = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Employees API
      .addCase(Employesss.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Employesss.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(Employesss.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Department API
      .addCase(Department.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Department.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(Department.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // EMI API
      .addCase(Emi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Emi.fulfilled, (state, action) => {
        state.loading = false;
        state.emi = action.payload;
      })
      .addCase(Emi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // EMI Total Amounts API
     .addCase(todaysummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(todaysummary.fulfilled, (state, action) => {
        state.loading = false;
        state.emiData = action.payload || []; // fallback to [] if undefined
        console.log("Fetched EMI data:",state.emiData);
      })
      .addCase(todaysummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch EMI total amounts";
      });
  },
});

export default EmployessSlices.reducer;
export const { setYear } = EmployessSlices.actions;
