import React, { useEffect, useState } from "react";
import "./Team.css";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import logo from "../../../assets/Image/intellix.png";
import {
  ArrowLeft,
  Ellipsis,
  Search,
  User,
  HandCoins,
  Clock,
  Logs,
  Mail,
  Calendar,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../src/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../src/components/ui/dialog";
import ThankYouCard from "../Dashboard/ThankYouCard";
import { useDispatch, useSelector } from "react-redux";
import {
  get_ExEmployee,
  UpdateEmployee,
} from "../../../Redux_store/Api/ExEmployee";
import { toast, ToastContainer, Zoom } from "react-toastify";
import No_data_found from "../No_data_found";

const ExEmployees = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);

  const isDarkMode = true;
  const navigate = useNavigate();

  const [ActiveEmployee, setActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ExEmployees, loading, error } = useSelector(
    (state) => state.ExEmployee || {}
  );
  const base_img_url = "https://adminv2-api-dev.intellix360.in/";
  const [first_name, setEmployeeName] = useState("");

  function formatTime(timeStr) {
    if (!timeStr) return "N/A";

    // Remove seconds if present (e.g., "14:30:00" -> "14:30")
    const timeWithoutSeconds = timeStr.split(":").slice(0, 2).join(":");

    // Convert to Date object for formatting
    const [hour, minute] = timeWithoutSeconds.split(":").map(Number);

    let suffix = "AM";
    let hour12 = hour;

    if (hour === 0) {
      hour12 = 12;
    } else if (hour >= 12) {
      suffix = "PM";
      if (hour > 12) hour12 = hour - 12;
    }

    return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  const handleDelete = async () => {
    try {
      if (selectedEmployeeId) {
        await dispatch(
          UpdateEmployee({ data: { id: selectedEmployeeId }, token })
        );

        // console.log("Employee activated successfully:", selectedEmployeeId);
        toast.success("Employee activated successfully:", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });

        // Close dialog
        setActive(false);
        await dispatch(
      get_ExEmployee({
        first_name: first_name,
        token,
        limit: employeesPerPage,
        page: currentPage,
      })
    );
        setSelectedEmployeeId(null);
      } else {
        // console.warn("No employee ID selected for activation");
        toast.warn(warn.message || "No employee ID selected for activation", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
      }
    } catch (error) {
      // console.error("Activation failed:", error);
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Activation failed:";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const employeesPerPage = 9;

  const EmployeeData = ExEmployees?.result?.employees || [];

  const totalPages = ExEmployees?.result?.totalPages || 1;
  const paginatedTeachers = EmployeeData;

  useEffect(() => {
    dispatch(
      get_ExEmployee({
        first_name: first_name,
        token,
        limit: employeesPerPage,
        page: currentPage,
      })
    );
  }, [dispatch, first_name, currentPage]);

  // const filteredData = allData.filter(item =>
  //   item.first_name.toLowerCase().includes(first_name.toLowerCase())
  // );

  useEffect(() => {
    if (first_name.trim() !== "") {
      setCurrentPage(1);
    }
  }, [first_name]);
  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      {/* Pass setActivePage to Sidebar */}
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
            transition={Zoom}
          />
          {/* Content Wrapper */}
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4  gap-3">
            {/* Back Button (Responsive) */}
            <Button
              className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back to Employees</span>
            </Button>

            {/* Search Bar (Responsive) */}
            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-auto sm:w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="By Employee Name..."
                className="ml-2 w-full outline-none bg-transparent"
                value={first_name}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="h-screen w-full flex items-center justify-center text-white">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                <img
                  src={logo}
                  alt="Loading"
                  className="rounded-full h-28 w-28"
                />
              </div>
            </div>
          ) : error ? (
            <div className="mt-4 rounded-lg border border-red-300  p-4 text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong. Please try again."}
            </div>
          ) : EmployeeData?.length === 0 ? (
            <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
              <No_data_found />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {paginatedTeachers?.map((employee) => {
                const fullName = `${employee.first_name || "N/A"} ${
                  employee.last_name || ""
                }`.trim();
                const department =
                  employee.department_names?.length > 0
                    ? employee.department_names.join(", ")
                    : "No Department";

                return (
                  <div
                    key={employee.id}
                    className="w-full max-w-[400px] mx-auto p-6 rounded-xl shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col gap-4 relative"
                  >
                    {/* DropdownMenu top right */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                          <Ellipsis size={20} />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-30 bg-gray-100 mt-1 shadow-md rounded-md"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEmployeeId(employee.id);
                            setActive(true);
                          }}
                          className="cursor-pointer text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-400/30 hover:text-gray-900 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          Activate Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Top Section */}
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          employee.image_path
                            ? `${base_img_url}viewimagefromazure?filePath=${employee.image_path}`
                            : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg"
                        }
                        alt="ex-employee"
                        className="w-16 h-16 rounded-full border-2 border-blue-500 dark:border-blue-400 object-cover"
                      />
                      <div className="flex-1">
                        <h2
                          className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[200px]"
                          title={fullName || "N/A"}
                        >
                          {fullName || "N/A"}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                            {department}
                          </span>
                          <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-medium">
                            {employee.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Email:</span>
                        <span
                          className="truncate max-w-[200px]"
                          title={employee.email || "N/A"}
                        >
                          {employee.email || "N/A"}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Joined:</span>
                        {employee.joining_date
                          ? new Date(employee.joining_date).toLocaleDateString(
                              "en-US"
                            )
                          : "N/A"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Time:</span>
                        {formatTime(employee.start_time)} -{" "}
                        {formatTime(employee.end_time)}
                      </p>
                      <p className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Assigned:</span>{" "}
                        {employee?.total_tasks}
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">Completed:</span>{" "}
                        {employee?.completed_tasks}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        onClick={() =>
                          navigate(`/employee/view-profile/${employee.id}`)
                        }
                      >
                        <User size={16} className="inline-block mr-2" /> Profile
                      </button>
                      <button
                        className="flex-1 bg-orange-500 dark:bg-orange-400 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                        onClick={() =>
                          navigate(`/manage_salary/${employee.id}`)
                        }
                      >
                        <HandCoins size={16} className="inline-block mr-2" />{" "}
                        Salary
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Dialog box Activate Employee */}
          <Dialog open={ActiveEmployee} onOpenChange={setActive}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[425px] shadow-lg p-6 rounded-lg"
            >
              <DialogHeader>
                <DialogTitle className="text-center text-[29px]">
                  Activate Employee
                </DialogTitle>
                <DialogDescription className="text-center text-md">
                  Are you sure you want to activate this employee ?
                </DialogDescription>
              </DialogHeader>

              <hr className="mt-5" />
              <div className="flex justify-center">
                <button
                  onClick={handleDelete}
                  type="submit"
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                  Activate Employee
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="mb-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ExEmployees;
