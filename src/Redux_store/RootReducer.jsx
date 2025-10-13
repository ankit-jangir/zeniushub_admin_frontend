import { combineReducers } from "@reduxjs/toolkit";
import teamReducer from "./slices/Team";
import DepartmentReducer from "./slices/Department";
import ExEmployeeReducer from "./slices/ExEmployee";
import { LeadsSliceReducer } from "./slices/Leads";
import { CategorySliceReducer } from "./slices/CategorySlice";
import course_sliceReducer from "./slices/Add_course";
import banner_sliceReducer from "./slices/Banner_slice";
import school_sliceReducer from "./slices/addschool_slice";
import notify_sliceReducer from "./slices/Notification.jsx";
import attendanceSliceReduce from "./slices/Attendance.jsx";
import loginSliceReducer from "./slices/Login_Admin";
import { StatusSliceReducer } from "./slices/FitterStatusSlice";
import head_yaer_sliceReducer from "./slices/Header_session_slice";
import EmiReducers from "./slices/EmisSlice";
import studentReducer from "./slices/StudentSlice";
import adminProfileSliceReducer from "./slices/adminProfileSlice";
import sessionSliceReducer from "./slices/SessionSlice";
import EmployessSlicesReducer from "./slices/Dashboard.Slices";
import subject_sliceReducer from "./slices/Subject_Slice";
import adminSliceReducer from "./slices/Logout_Admin";
import BatchesSliceReducer from "./slices/Batches_Slice";
import ExstudentReducer from "./slices/Student_ExStudent";
import stu_attendanceSliceReducer from "./slices/Stu_atten";
import statusReducer from "./slices/Status_slice";
import acad_course_sliceReducer from "./slices/Academic_course";
import receiptSliceReducer from "./slices/recipt_download_slice";
import academicsReducer from "./slices/AcademicsSlice";
import GetBatchesSliceReducer from "./slices/EmployesassinedtaskSlice";
import dateFilterReducer from "./slices/dateFilterSlice";
import CheckTokenReducer from "./slices/CheckTokenSlice";
import salarySliceReducer from "./slices/team_account-slice";
// RootReducer.js me sab imports ke niche ye add karo
import expenseReducer from "./slices/expense.slice.jsx";
import { CategoryExpensesSliceReducer } from "./slices/categoryExpenses";


// import { CategoryExpensesSliceReducer } from "./slices/categoryExpenses";
const RootReducer = combineReducers({
  team: teamReducer,
  Department: DepartmentReducer,
  ExEmployee: ExEmployeeReducer,
  Leads: LeadsSliceReducer,
  Category: CategorySliceReducer,
  banner: banner_sliceReducer,
  schools: school_sliceReducer,
  courses: course_sliceReducer,
  notify: notify_sliceReducer,
  attendance: attendanceSliceReduce,
  login: loginSliceReducer,
  Status: StatusSliceReducer,
  year: head_yaer_sliceReducer,
  emis: EmiReducers,
  students: studentReducer,
  adminProfile: adminProfileSliceReducer,
  subj: subject_sliceReducer,
  Employesss: EmployessSlicesReducer,
  logout: adminSliceReducer,
  session: sessionSliceReducer,
  acad_courses: acad_course_sliceReducer,
  Batch: BatchesSliceReducer,
  Exstudent: ExstudentReducer,
  academics: academicsReducer,
  attendance_stu: stu_attendanceSliceReducer,
  status: statusReducer,
  receipt: receiptSliceReducer,
  getBatch: GetBatchesSliceReducer,
  dateFilter: dateFilterReducer,
  CheckToken: CheckTokenReducer,
  salary: salarySliceReducer,
   expenses: expenseReducer,
   categoryExpenses : CategoryExpensesSliceReducer,
  
});

export default RootReducer;