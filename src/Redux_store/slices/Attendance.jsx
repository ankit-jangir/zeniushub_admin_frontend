import { createSlice } from "@reduxjs/toolkit";
import { downloadEmployeeExcel, export_excel, fetchAttendance, fetchEmployeeAttendance, markAllPresent, markAllPresentByEmployee } from "../Api/Attendance";

const initialState = {
  data: [],
  total: 0,
  page: 1,
  limit: 5,
  search: {
    name: '',
    batch: '',
    enrollment_id: ''
  },
  sessionID: 19,
  loading: false,
  error: null,
  export_excel_data: [],
  attendance: [],
  pagination: {},
  totalTeam: 0,
  present: 0,
  halfday: 0,
  absent: 0
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setSearchFilters(state, action) {
      state.search = { ...action.payload };
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        const { data, total, page, limit, totalStudent,
          totalPresent,
          totalAbsent,
          totalHalfday, totalPages } = action.payload || {};
        state.loading = false;
        state.data = Array.isArray(data) ? data : [];
        state.total = total;
        state.page = page;
        state.limit = limit;
        state.totalStudent = totalStudent;
        state.totalPresent = totalPresent;
        state.totalAbsent = totalAbsent;
        state.totalHalfday = totalHalfday;
        state.totalPages = totalPages;
        console.log(action.payload, "***********************state.totalPages");

      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch attendance';
      })

      .addCase(export_excel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
        state.exportSuccess = false;
      })
      .addCase(export_excel.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportSuccess = true;
      })
      .addCase(export_excel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload || 'Failed to export';
        state.exportSuccess = false;
      });

    builder
      .addCase(markAllPresent.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(markAllPresent.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(markAllPresent.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message || 'Failed to mark attendance.';
      });

    builder
      .addCase(markAllPresentByEmployee.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(markAllPresentByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(markAllPresentByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message || 'Failed to mark attendance.';
      });
    builder
      .addCase(fetchEmployeeAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.paginatedData;
        state.pagination = action.payload.pagination;
        state.absent = action.payload.totalAbsent;
        state.halfday = action.payload.totalHalfDay;
        state.present = action.payload.totalPresent;
        state.totalTeam = action.payload.pagination.totalItems;
      })
      .addCase(fetchEmployeeAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pagination = 0;
      });
    builder
      .addCase(downloadEmployeeExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadEmployeeExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadEmployeeExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchFilters, setPage, setLimit } = attendanceSlice.actions;
export default attendanceSlice.reducer;
