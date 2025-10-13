import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login/Login";
import AdminLogin from "./component/Login/AdminLogin";
import Settings from "./component/Admin/Setting/Change_pass";
import Dashboard from "./component/Admin/Dashboard/Dashboard";
import StudentHeader from "./component/Admin/Student/StudentHeader";
import Advertisment from "./component/Admin/Advertisment/Advertisment";
import Attendance from "./component/Admin/Attendance/Attendance";
import Support from "./component/Admin/Support/Support";
import AddStudentModal from "./component/Admin/Student/AddStudentForm";
import Team from "./component/Admin/Team/Team";
import StudentSelectionPage from "./component/Admin/Student/StudentSelectionPage";
import ParentDetails from "./component/Admin/Student/ParentDetails";
import SuccessMessage from "./component/Admin/Student/SuccessMessage";
import ViewProfile from "./component/Admin/Team/ViewProfile";
import Manage_sallery from "./component/Admin/Team/Manage_sallery";
import ProceedModal from "./component/Admin/Student/ProceedModel";
import Leads from "./component/Admin/Leads/Leads";
import ExEmployees from "./component/Admin/Team/ExEmployees";
import Department_access from "./component/Admin/Team/Department_access";
import MyLeads from "./component/Admin/Leads/MyLeads/MyLeads";
import Departments from "./component/Admin/Team/Departments";
import Profile from "./component/Admin/Student/Action/Profile";
import Payment_History from "./component/Admin/Student/Action/Payment_History";
import Account from "./component/Admin/Accounts/Account";
import View_User from "./component/Admin/Team/View_User";
import StudentUploadModal from "./component/Admin/Student/Add_Excel/StudentUploadModal";
import Academics from "./component/Admin/Academics/Academics";
import Upcoming from "./component/Admin/Accounts/Upcoming";
import Missed from "./component/Admin/Accounts/Missed";
import MarksheetForm from "./component/Admin/Student/Marksheet/MarksheetForm";
import Department_list_Employee from "./component/Admin/Accounts/Department_list_Employee";
import Batches from "./component/Admin/Academics/Academics_data/Batches";
import Courses from "./component/Admin/Academics/Academics_data/Courses";
import Sessions from "./component/Admin/Academics/Academics_data/Sessions";
import Subjects from "./component/Admin/Academics/Academics_data/Subjects";
import ThankYouCard from "./component/Admin/Dashboard/ThankYouCard";
import ExStudentsData from "./component/Admin/Student/Ex-Students/ExStudentsData";
import Stu_Attendance from "./component/Admin/Student/Action/Stu_Attendance";
import Add_Payment from "./component/Admin/Student/Add_Payment";
import ProtectedRoute from "./Protect_Rotues";
import Notification from "./component/Admin/Advertisment/Notification";
import Message from "./component/Admin/Student/Message";
import Received from "./component/Admin/Accounts/Received";
import Notfoundpage from "./component/Admin/Notfoundpage";
import "react-day-picker/dist/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ ADD THIS
import StudentDetail from "./component/Admin/Academics/Academics_data/batch/addStudentInBatch/StudentDetail";
import ExtraDetail from "./component/Admin/Academics/Academics_data/batch/addStudentInBatch/ExtraDetail";
import CourseDetail from "./component/Admin/Academics/Academics_data/batch/addStudentInBatch/CourseDetail";
import ParentsDetail from "./component/Admin/Academics/Academics_data/batch/addStudentInBatch/ParentsDetail";
import Expenses from "./component/Admin/expenses/Expenses";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Adminlogin" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Expenses" element={<Expenses />} />
            <Route path="/Academics" element={<Academics />} />
            <Route path="/students" element={<StudentHeader />} />
            <Route path="/Accounts" element={<Account />} />
            <Route path="/Access/:id" element={<Department_access />} />
            <Route path="/Departments" element={<Departments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/Advertisement" element={<Advertisment />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/add_student_model" element={<AddStudentModal />} />
            <Route path="/ProceedModal" element={<ProceedModal />} />
            <Route path="/successfully" element={<Message />} />
            <Route
              path="/StudentSelectionPage"
              element={<StudentSelectionPage />}
            />
            <Route path="/ParentDetails" element={<ParentDetails />} />
            <Route path="/add" element={<SuccessMessage />} />
            <Route path="/view/profile/:id" element={<Profile />} />
            <Route
              path="/student-payment-history/:id"
              element={<Payment_History />}
            />
            <Route
              path="/StudentUploadModal"
              element={<StudentUploadModal />}
            />
            <Route path="/Marksheet" element={<MarksheetForm />} />
            <Route path="/ExStudents" element={<ExStudentsData />} />
            <Route
              path="/student_attendance/:id"
              element={<Stu_Attendance />}
            />
            <Route
              path="/employee/view-profile/:id"
              element={<ViewProfile />}
            />
            <Route path="/View_User/:id" element={<View_User />} />
            <Route path="/Ex-Employee" element={<ExEmployees />} />
            <Route path="/manage_salary/:empId" element={<Manage_sallery />} />
            <Route path="/Leads" element={<Leads />} />
            <Route path="/MyLeads" element={<MyLeads />} />
            <Route path="/paid" element={<Received />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/missed" element={<Missed />} />
            <Route
              path="/Accounts/Department_list_Employee/:id"
              element={<Department_list_Employee />}
            />
            <Route path="/Batches" element={<Batches />} />
            <Route path="/Courses" element={<Courses />} />
            <Route path="/Sessions" element={<Sessions />} />
            <Route path="/Subjects" element={<Subjects />} />
            <Route path="/Subjects/:id" element={<Subjects />} />
            <Route path="/ThankYouCard" element={<ThankYouCard />} />
            <Route path="/add-payment" element={<Add_Payment />} />

            <Route
              path="/Student_Detail/:courseId/:batchId/:courseName/:batchName/:sessionId/:sessionYear"
              element={<StudentDetail />}
            />

            <Route
              path="/Extra_Detail/:courseId/:batchId/:courseName/:batchName/:sessionId/:sessionYear"
              element={<ExtraDetail />}
            />
            <Route
              path="/Course_Detail/:courseId/:batchId/:courseName/:batchName"
              element={<CourseDetail />}
            />
            <Route path="/Parents_Detail" element={<ParentsDetail />} />

            <Route path="*" element={<Notfoundpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* ✅ Add ToastContainer OUTSIDE your routes/dialogs/modals */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Or "dark" based on your theme
      />
    </div>
  );
};

export default App;
