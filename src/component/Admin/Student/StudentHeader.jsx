import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, ChevronDown, MoreVertical, Sun, Moon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";
import { Button } from "../../src/components/ui/button";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../src/components/ui/pagination";
import Header from "../Dashboard/Header";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Add_Payment from "./Add_Payment";
import {
  getStudents,
  updateStudentsRt,
  updateStudentStatus,
} from "../../../Redux_store/Api/StudentsApiStore";
import { fetchSessions } from "../../../Redux_store/Api/SessionApi";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { fetchBatchesByCourseId } from "../../../Redux_store/Api/Batches";
import avatar from "./dummy-avatar (1).jpg";
import Swal from "sweetalert2";
import logo from "../../../assets/Image/zeniushub.png";

const StudentHeader = () => {
  const PAGE_SIZE = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState(
    new Date().getFullYear()
  );
  const [showRT, setShowRT] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Theme Toggle
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  // Selectors
  const { students, loading, error } = useSelector((state) => state.students);
  console.log(
    Array.isArray(students?.data) && students.data.length > 0
      ? students.data[0]?.enrollment?.Batch?.BatchesName
      : "No data"
  );

  const { Session, loading: sessionsLoading } = useSelector(
    (state) => state.session || {}
  );
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const { batches = { data: { batches: [] } }, loading: batchesLoading } =
    useSelector((state) => state.Batch || {});
  const { course: courses = { data: [] }, loading: coursesLoading } =
    useSelector((state) => state.courses || {});

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchSessions(token));
    dispatch(get_course(token));
  }, [dispatch]);

  // Fetch students
  useEffect(() => {
    if (sessionID) {
      dispatch(
        getStudents({
          token,
          page: currentPage,
          limit: PAGE_SIZE,
          name: searchQuery,
          session_id: sessionID,
          rt: showRT ? "true" : "",
          course_id: selectedCourseId,
          batch_id: selectedBatchId,
        })
      ).then((response) => {
        setTotalPages(response?.payload?.students?.pagination?.totalPages || 1);
      });
    }
  }, [
    dispatch,
    sessionID,
    currentPage,
    searchQuery,
    showRT,
    selectedCourseId,
    selectedBatchId,
  ]);

  // Fetch batches
  useEffect(() => {
    if (selectedCourseId) {
      dispatch(fetchBatchesByCourseId({ courseId: selectedCourseId, token }));
    }
  }, [selectedCourseId, dispatch]);

  // Session options
  const [sessionOptions, setSessionOptions] = useState([]);
  useEffect(() => {
    if (Session?.length > 0) {
      const options = Session.map((s) => ({
        label: s.session_year,
        value: s.id,
      }));
      setSessionOptions(options);
      const defaultSession = Session.find((s) => s.is_default === true);
      if (defaultSession) setSelectedSessionId(defaultSession.id);
    }
  }, [Session]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCourseSelect = (courseName, courseId) => {
    setSelectedCourse(courseName);
    setSelectedCourseId(courseId);
    setSelectedBatch("");
    setSelectedBatchId("");
    setCurrentPage(1);
  };

  const handleBatchSelect = (batchName, batchId) => {
    setSelectedBatch(batchName);
    setSelectedBatchId(batchId);
    setCurrentPage(1);
  };

  const handleViewProfile = (id) => navigate(`/view/profile/${id}`);

  const handleUpdateStatus = async (studentId) => {
    await dispatch(updateStudentStatus(studentId)).then(() => {
      console.log(studentId, 'stusid');
      toast.success("Student deleted successfully!");
      dispatch(
        getStudents({
          token,
          page: currentPage,
          limit: PAGE_SIZE,
          name: searchQuery,
          session_id: sessionID,
          rt: showRT ? "true" : "",
          course_id: selectedCourseId,
          batch_id: selectedBatchId,
        })
      );
    });
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
          <div className="max-w-full mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Search Bar */}
                <div className="col-span-2 md:col-span-3 lg:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search students"
                  />
                </div>

                {/* Course Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full truncate hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm"
                    >
                      <span className="truncate">
                        {selectedCourse || "Select Course"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full sm:w-48 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-lg rounded-md">
                    <DropdownMenuItem
                      onClick={() => handleCourseSelect("", "")}
                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      All Courses
                    </DropdownMenuItem>
                    {Array.isArray(courses?.data) && courses.data.length > 0 ? (
                      courses.data.map((course) => (
                        <DropdownMenuItem
                          key={course.id}
                          onClick={() =>
                            handleCourseSelect(course.course_name, course.id)
                          }
                          className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                        >
                          {course.course_name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem
                        disabled
                        className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No courses available
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Batch Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full truncate hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm"
                      disabled={!selectedCourseId}
                    >
                      <span className="truncate">
                        {selectedBatch || "Select Batch"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full sm:w-48 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-lg rounded-md">
                    {selectedCourseId && batches?.data?.batches?.length > 0 ? (
                      batches.data.batches.map((batch) => (
                        <DropdownMenuItem
                          key={batch.id}
                          onClick={() =>
                            handleBatchSelect(batch.BatchesName, batch.id)
                          }
                          className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                        >
                          {batch.BatchesName}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem
                        disabled
                        className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        {selectedCourseId
                          ? "No batches available"
                          : "Select course first"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Action Buttons */}
                <Button
                  onClick={() => navigate("/ExStudents")}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full"
                >
                  Ex-Student
                </Button>
                <Button
                  onClick={() => navigate("/StudentUploadModal")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full"
                >
                  + Add Excel
                </Button>
                <Button
                  onClick={() => navigate("/add_student_model")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full"
                >
                  + Add Student
                </Button>
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-colors w-full"
                  onClick={() => setShowRT(!showRT)}
                >
                  Rt
                  <input
                    type="checkbox"
                    checked={showRT}
                    onChange={() => setShowRT(!showRT)}
                    className="w-4 h-4 accent-blue-500 dark:accent-blue-400"
                    aria-label="Toggle RT filter"
                  />
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
              {loading ||
                sessionsLoading ||
                batchesLoading ||
                coursesLoading ? (
                <div className="flex h-[60vh] items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
                    <img
                      src={logo}
                      alt="Loading"
                      className="absolute h-12 w-12 sm:h-16 sm:w-16 animate-pulse"
                    />
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-4">
                      Loading students...
                    </p>
                  </div>
                </div>
              ) : error || !students?.data?.length ? (
                <div className="text-center py-12">
                  <p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300">
                    No Students Found
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className=" w-full">
                  {/* Desktop Table Layout */}
                  <Table className=" w-full">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-100 to-orange-200 text-white sticky top-0 z-10 dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-500">
                        <TableHead className="w-16 font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Enrollment ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Image
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3 ">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Batch
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Course
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Duration
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Fees
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Payment
                        </TableHead>
                        <TableHead className="w-16 font-semibold text-gray-700 dark:text-gray-200 text-sm py-3">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(students?.data) &&
                        students.data.map((student, index) => (
                          <TableRow
                            key={`${student.id}-${index}`}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                          >
                            <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                              {(currentPage - 1) * PAGE_SIZE + index + 1}
                            </TableCell>

                            <TableCell
                              className="truncate max-w-xs"
                              title={student.enrollment_id}
                            >
                              {student.enrollment_id}
                            </TableCell>

                            <TableCell>
                              <img
                                className="w-12 h-12 object-cover rounded-full border border-gray-200 dark:border-gray-600"
                                src={
                                  student.profile_image
                                    ? `${import.meta.env.VITE_BASE_URL
                                    }/viewimagefromazure?filePath=${student.profile_image
                                    }`
                                    : avatar
                                }
                                alt={student.name}
                                onError={(e) => (e.target.src = avatar)}
                              />
                            </TableCell>

                            <TableCell
                              className="px-4 py-2 text-black dark:text-gray-100 truncate max-w-[180px]"
                              title={student?.name || "N/A"}
                            >
                              {student?.name || "N/A"}
                            </TableCell>

                            <TableCell>
                              <span
                                className="truncate w-[120px] block"
                                title={student?.enrollment?.Batch?.BatchesName}
                              >
                                {student?.enrollment?.Batch?.BatchesName ||
                                  "N/A"}
                              </span>
                            </TableCell>

                            <TableCell className="max-w-[180px] truncate px-4 py-2 text-black dark:text-gray-100">
                              <span
                                title={
                                  student?.enrollment?.Course?.course_name ||
                                  "N/A"
                                }
                              >
                                {student?.enrollment?.Course?.course_name ||
                                  "N/A"}
                              </span>
                            </TableCell>

                            <TableCell className="text-center">
                              {student?.enrollment?.Course?.course_duration ||
                                "N/A"}{" "}
                              months
                            </TableCell>

                            <TableCell>
                              {student.enrollment.fees || "N/A"}
                            </TableCell>

                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => {
                                      console.log(
                                        "%%%%%%%%%%%%%%%%%",
                                        student.enrollment
                                      );
                                      if (student?.enrollment?.fees != null) {
                                        console.log(
                                          "%%%%%%%%%%%%%%%%%",
                                          student.enrollment
                                        );
                                        toast.error(
                                          "Payment amount already set for this student"
                                        );
                                        return;
                                      }
                                    }}
                                    disabled={
                                      student?.enrollment?.number_of_emi > 0
                                    }
                                    aria-label={`Add payment for ${student.name}`}
                                  >
                                    Add Payment
                                  </Button>
                                </DialogTrigger>

                                {student?.enrollment?.fees == null && (
                                  <DialogContent className="w-[90vw] max-w-[825px] max-h-[80vh] overflow-x-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Add Payment
                                      </DialogTitle>
                                      <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                        Fill out the payment details for the
                                        student.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Add_Payment
                                      studentId={student?.id}
                                      studentEnrollmentId={
                                        student?.enrollment?.id
                                      }
                                      back={() => { }}
                                    />
                                  </DialogContent>
                                )}
                              </Dialog>
                            </TableCell>

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                                    aria-label="More actions"
                                  >
                                    <MoreVertical
                                      size={20}
                                      className="text-gray-500 dark:text-gray-300"
                                    />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-lg rounded-md">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleViewProfile(
                                          student?.enrollment?.id
                                        )
                                      }
                                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                                    >
                                      Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/student-payment-history/${student?.enrollment?.id}`
                                        )
                                      }
                                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                                    >
                                      Payment History
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/student_attendance/${student?.enrollment?.id}`
                                        )
                                      }
                                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                                    >
                                      Attendance
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        dispatch(
                                          updateStudentsRt({
                                            id: student?.enrollment?.id,
                                            token,
                                          })
                                        );
                                        dispatch(
                                          getStudents({
                                            token,
                                            page: currentPage,
                                            limit: PAGE_SIZE,
                                            name: searchQuery,
                                            session_id: sessionID,
                                            rt: showRT ? "true" : "",
                                            course_id: selectedCourseId,
                                            batch_id: selectedBatchId,
                                          })
                                        );
                                      }}
                                      className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-900 dark:text-gray-100 text-sm"
                                    >
                                      {student?.rt ? "Unmark RT" : "Mark as RT"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        Swal.fire({
                                          title: "Are you sure?",
                                          text: "You won't be able to revert this!",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#3085d6",
                                          cancelButtonColor: "#d33",
                                          confirmButtonText: "Yes, delete it!",
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            handleUpdateStatus(
                                              student?.enrollment?.id
                                            );
                                            Swal.fire({
                                              title: "Deleted!",
                                              text: "Student has been deleted.",
                                              icon: "success",
                                              timer: 2000,
                                              timerProgressBar: true,
                                              showConfirmButton: false,
                                            });
                                          }
                                        });
                                      }}
                                      className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!error && students?.data?.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                    <PaginationItem>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </Button>
                    </PaginationItem>
                    {totalPages <= 5 ? (
                      [...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <PaginationItem key={page}>
                            <Button
                              className={
                                currentPage === page
                                  ? "bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                              }
                              onClick={() => setCurrentPage(page)}
                              aria-label={`Page ${page}`}
                            >
                              {page}
                            </Button>
                          </PaginationItem>
                        );
                      })
                    ) : (
                      <>
                        <PaginationItem>
                          <Button
                            className={
                              currentPage === 1
                                ? "bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                            }
                            onClick={() => setCurrentPage(1)}
                            aria-label="Page 1"
                          >
                            1
                          </Button>
                        </PaginationItem>
                        {currentPage > 3 && (
                          <PaginationItem>
                            <span className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                              ...
                            </span>
                          </PaginationItem>
                        )}
                        {currentPage > 2 && (
                          <PaginationItem>
                            <Button
                              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              aria-label={`Page ${currentPage - 1}`}
                            >
                              {currentPage - 1}
                            </Button>
                          </PaginationItem>
                        )}
                        {currentPage !== 1 && currentPage !== totalPages && (
                          <PaginationItem>
                            <Button
                              className="bg-blue-900 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                              onClick={() => setCurrentPage(currentPage)}
                              aria-label={`Page ${currentPage}`}
                            >
                              {currentPage}
                            </Button>
                          </PaginationItem>
                        )}
                        {currentPage < totalPages - 1 && (
                          <PaginationItem>
                            <Button
                              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              aria-label={`Page ${currentPage + 1}`}
                            >
                              {currentPage + 1}
                            </Button>
                          </PaginationItem>
                        )}
                        {currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <span className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                              ...
                            </span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <Button
                            className={
                              currentPage === totalPages
                                ? "bg-blue-900 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                            }
                            onClick={() => setCurrentPage(totalPages)}
                            aria-label={`Page ${totalPages}`}
                          >
                            {totalPages}
                          </Button>
                        </PaginationItem>
                      </>
                    )}
                    <PaginationItem>
                      <Button
                        className="bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        Next
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentHeader;
