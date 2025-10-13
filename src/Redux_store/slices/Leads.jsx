// import { createSlice } from "@reduxjs/toolkit";
// import {
//   changestatusLeads,
//   AddLeads,
//   getAllAssignto,
//   searchLeads,
//   leadSummaryApi,
//   changeAssignLeads, 
// } from "../Api/LeadsApi";

// const LeadsSlice = createSlice({
//   name: "LeadsSlice",
//   initialState: {
//     leads: [],
//     loading: false,
//     error: null,
//     searchedLeads: [],
//     leadData: [],
//     assignToList: [],
//     datas: [],
//   },

//   extraReducers: (builder) => {
//     builder
//       // ✅ Change Status Leads
//       .addCase(changestatusLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(changestatusLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         const { id, status } = action.meta.arg;
//         // Optionally update the local leads array if needed
//       })
//       .addCase(changestatusLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to change lead status";
//       })

//       // ✅ Add Leads
//       .addCase(AddLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(AddLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leadData.push(action.payload);
//       })
//       .addCase(AddLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to add lead";
//       })

//       // ✅ Get All Assign To
//       .addCase(getAllAssignto.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllAssignto.fulfilled, (state, action) => {
//         state.loading = false;
//         state.assignToList = action.payload;
//       })
//       .addCase(getAllAssignto.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ Search Leads
//       .addCase(searchLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leads = action.payload;
//       })
//       .addCase(searchLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ Lead Summary
//       .addCase(leadSummaryApi.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(leadSummaryApi.fulfilled, (state, action) => {
//         state.loading = false;
//         state.datas = action.payload;
//       })
//       .addCase(leadSummaryApi.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Something went wrong";
//       })

//       // ✅ Assign Lead (new case)
//       .addCase(changeAssignLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(changeAssignLeads.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(changeAssignLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to assign lead";
//       });


      
//   },
// });

// export const LeadsSliceReducer = LeadsSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";
import {
  changestatusLeads,
  AddLeads,
  getAllAssignto,
  searchLeads,
  leadSummaryApi,
  changeAssignLeads,
  ConverttoStudent,
} from "../Api/LeadsApi"; 

const LeadsSlice = createSlice({
  name: "LeadsSlice",
  initialState: {
    leads: [],
    loading: false,
    error: null,
    searchedLeads: [],
    leadData: [],
    assignToList: [],
    datas: [],
    studentData: null, 
  },

  extraReducers: (builder) => {
    builder
      // ✅ Change Status Leads
      .addCase(changestatusLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changestatusLeads.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.meta.arg;
        // Optionally update the local leads array
      })
      .addCase(changestatusLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change lead status";
      })

      // ✅ Add Leads
      .addCase(AddLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leadData.push(action.payload);
      })
      .addCase(AddLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add lead";
      })

      // ✅ Get All Assign To
      .addCase(getAllAssignto.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAssignto.fulfilled, (state, action) => {
        state.loading = false;
        state.assignToList = action.payload;
      })
      .addCase(getAllAssignto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Search Leads
      .addCase(searchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(searchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Lead Summary
      .addCase(leadSummaryApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leadSummaryApi.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(leadSummaryApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // ✅ Assign Lead
      .addCase(changeAssignLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAssignLeads.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeAssignLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to assign lead";
      })

      // ✅ Convert to Student
      .addCase(ConverttoStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ConverttoStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload;
      })
      .addCase(ConverttoStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to convert lead to student";
      });
  },
});

export const LeadsSliceReducer = LeadsSlice.reducer;
