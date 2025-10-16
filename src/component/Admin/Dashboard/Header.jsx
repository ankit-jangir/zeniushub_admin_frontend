import React, { useState, useEffect, useContext } from "react";
import {
  LogOut,
  Search,
  Bell,
  User,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";
import { SidebarTrigger } from "../../src/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../src/components/ui/dialog";
import { Button } from "../../src/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../../Redux_store/Api/Logout_admin";
import { clearToken } from "../../../Redux_store/slices/Logout_Admin";
import { fetchSessions } from "../../../Redux_store/Api/SessionApi";

import { Maximize, Minimize } from "lucide-react";
import { setSession } from "../../../Redux_store/slices/SessionSlice";
import { setYear } from "../../../Redux_store/slices/Dashboard.Slices";
import { Emi } from "../../../Redux_store/Api/Dashboard.Api";
const Header = () => {
  const [logout, setLogout] = useState(false);
  const { profile } = useSelector((state) => state.adminProfile || {});

  const admin = profile.admin || {};
  const [selectedOption, setSelectedOption] = useState("");
  const [selectYearId, setselectYearId] = useState(0);
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const location = useLocation(); // React Router hook to get the current path
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { Session, loading, error } = useSelector((state) => state?.session);
  const getActiveTabName = () => {
    const path = location.pathname;

    if (path === "/Dashboard") return "Dashboard";
    if (path === "/Expenses") return "Expenses";
    if (path === "/Academics") return "Academics";
    if (path === "/students") return "Students";
    if (path === "/Accounts") return "Accounts";
    if (path.startsWith("/Access/")) return "Department Access";
    if (path === "/Departments") return "Departments";
    if (path === "/attendance") return "Attendance";
    if (path === "/Advertisement") return "Advertisement";
    if (path === "/team") return "Team";
    if (path === "/settings") return "Settings";
    if (path === "/support") return "Support";
    if (path === "/add_student_model") return "Add Student";
    if (path === "/ProceedModal") return "Proceed Modal";
    if (path === "/successfully") return "Success Message";
    if (path === "/StudentSelectionPage") return "Student Selection";
    if (path === "/ParentDetails") return "Parent Details";
    if (path === "/add") return "Add Success";
    if (path.startsWith("/view/profile/")) return "View Profile";
    if (path.startsWith("/student-payment-history/")) return "Payment History";
    if (path === "/StudentUploadModal") return "Student Upload";
    if (path === "/Marksheet") return "Marksheet";
    if (path === "/ExStudents") return "Ex Students";
    if (path.startsWith("/student_attendance/")) return "Student Attendance";
    if (path.startsWith("/employee/view-profile/")) return "Employee Profile";
    if (path.startsWith("/View_User/")) return "View User";
    if (path === "/Ex-Employee") return "Ex Employees";
    if (path === "/manage_salary") return "Manage Salary";
    if (path === "/leads") return "Leads";
    if (path === "/MyLeads") return "My Leads";
    if (path === "/paid") return "Paid";
    if (path === "/upcoming") return "Upcoming";
    if (path === "/missed") return "Missed";
    if (path.startsWith("/Accounts/Department_list_Employee/"))
      return "Department Employees";
    if (path === "/Batches") return "Batches";
    if (path === "/Courses") return "Courses";
    if (path === "/Sessions") return "Sessions";
    if (path === "/Subjects") return "Subjects";
    if (path === "/ThankYouCard") return "Thank You Card";
    if (path === "/add-payment") return "Add Payment";
    if (path === "/EmployesAttendance") return "Employees Attendance";

    return ""; // Default name
  };

  const visiblePaths = [
    "/Dashboard",
    "/students",
    "/leads",
    "/MyLeads",
    "/attendance",
    "/ExStudents",
  ];
  const shouldShowDropdown =
    location.pathname.startsWith("/Dashboard") ||
    location.pathname.startsWith("/Expenses") ||
    location.pathname.startsWith("/students") ||
    location.pathname.startsWith("/leads") ||
    location.pathname.startsWith("/MyLeads") ||
    location.pathname.startsWith("/attendance") ||
    location.pathname.startsWith("/ExStudents");

  useEffect(() => {
    dispatch(fetchSessions(token));
  }, [dispatch]);

  const navigate = useNavigate();

  useEffect(() => {
    if (logout) {
      const timer = setTimeout(() => setLogout(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [logout]);

  // const token = useSelector((state) => state.logout.token);

  const handleLogout = async () => {
    const response = await dispatch(logoutAdmin(token)).unwrap();

    if (response.status == "001") {
      setLogout(false);
      dispatch(clearToken());
      localStorage.removeItem("token");
      navigate("/");
    }
  };


  const handleSessionSelect = (sessionYear, id) => {
    setSelectedOption(sessionYear);
    setselectYearId(id);
    dispatch(setYear(id));

    dispatch(setSession(id));
  };

  const sessionID = useSelector((state) => state.session?.selectedSession);

  useEffect(() => {
    if (Session && Session.length > 0) {
      let sessionData = null;

      if (sessionID) {
        sessionData = Session.find((s) => s.id === sessionID);
      } else {
        sessionData = Session.find((s) => s.is_default === true);
        if (sessionData) {
          dispatch(setSession(sessionData.id)); // Set in Redux
        }
      }

      if (sessionData && !selectedOption) {
        setSelectedOption(sessionData.session_year);
        setselectYearId(sessionData.id);
      }
    }
  }, [Session, sessionID, selectedOption, dispatch]);

  useEffect(() => {
    if (selectYearId != 0) {
      dispatch(setYear(selectYearId));
    }
  }, [dispatch, selectYearId]);

  // for minimize screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // useEffect(() => {
  //   // console.log("ueeEffect");
  //   // dispatch(StudentsAttendance(selectYearId))
  //   dispatch(Emi(selectYearId));
  // }, [dispatch, selectYearId]);

  return (
    <>
      <header className="flex sticky top-0 shrink-0 gap-2 border-b z-[50] h-16 bg-white dark:bg-gray-900 shadow-md items-center px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex w-full items-center justify-between">
          {/* Dynamic Page Title */}
          <h1 className="lg:text-2xl mt-1 sm:text-sm ps-7 font-semibold text-orange-600 dark:text-white">
            {getActiveTabName()} {/* Display active tab name here */}
          </h1>

          {/* Right Section: Icons & Profile */}
          <div className="flex items-center space-x-6">
            {/* Year Dropdown - visible on all screen sizes */}
            <div className="w-full max-w-lg ms-1 mt-2">
              {shouldShowDropdown && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full font-medium max-w-lg border border-orange-400 dark:border-orange-500 shadow rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-9 py-2 flex justify-between items-center hover:bg-blue-500 hover:text-white">
                      <span>
                        {loading
                          ? "Loading..."
                          : error
                            ? "Failed to load"
                            : selectedOption || "Select Year"}
                      </span>
                      <ChevronDown size={18} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-full font-medium max-w-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-2 border border-orange-600 dark:border-orange-500 rounded-lg shadow-md"
                  >
                    {loading ? (
                      <div className="px-4 py-2 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : error ? (
                      <div className="px-4 py-2 text-center text-red-500">
                        Failed to load
                      </div>
                    ) : (
                      (Array.isArray(Session?.rows)
                        ? Session.rows
                        : Session || []
                      ).map((year) => (
                        <DropdownMenuItem
                          key={year.id}
                          onClick={() =>
                            handleSessionSelect(year.session_year, year.id)
                          }
                          className="cursor-pointer hover:bg-orange-600 hover:text-white px-4 py-2 text-center"
                        >
                          {year.session_year}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* <Button
                            variant="ghost"
                            onClick={toggleFullscreen}
                            className="p-2 pt-2 hover:bg-muted rounded-full"
                        >
                            {isFullscreen ? <Minimize size={48} /> : <Maximize size={48} />}
                        </Button> */}

            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="focus:outline-none"
              >
                {darkMode ? (
                  <Sun size={25} className="text-yellow-400" />
                ) : (
                  <Moon size={25} className="text-gray-700 dark:text-white" />
                )}
              </button>
              <div className="  relative">
                <Bell
                  size={25}
                  className="text-gray-700 dark:text-white cursor-pointer"
                />
                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback>{admin.full_name?.at(0) || "Admin"} </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
                <div className="flex flex-col space-y-2 lg:hidden">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-2 text-gray-900 dark:text-white"
                  >
                    {darkMode ? (
                      <Sun size={18} className="text-yellow-400" />
                    ) : (
                      <Moon
                        size={18}
                        className="text-gray-700 dark:text-white"
                      />
                    )}
                    <span>Dark Mode</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Bell size={18} />
                    <span>Notifications</span>
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white"
                >
                  <User size={18} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLogout(true)}
                  className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
                >
                  <LogOut size={18} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logout} onOpenChange={setLogout}>
              <DialogContent className="sm:max-w-[425px] shadow-lg p-6 rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-[22px] font-semibold">
                    Confirm Logout
                  </DialogTitle>
                  <DialogDescription className="text-center text-md">
                    Are you sure you want to log out?
                  </DialogDescription>
                </DialogHeader>
                <hr className="mt-4" />
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={() => setLogout(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
