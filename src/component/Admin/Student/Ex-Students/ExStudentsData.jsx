import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../../../src/components/ui/dropdown-menu";
import { Button } from "../../../src/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Dashboard/Header";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import { GetExStudent } from "../../../../Redux_store/Api/Student_ExStudent";
import { getSingleStudent } from "../../../../Redux_store/Api/StudentsApiStore";
import logo from "../../../../assets/Image/zeniushub.png";

// Constants
const PAGE_SIZE = 10;
const DEFAULT_SESSION_ID = 19;

/**
 * Custom hook for debouncing search input
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * ExStudentsData component with enhanced UI
 */
const ExStudentsData = () => {
  // State and Hooks
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);

  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchInput.trim());

  // Redux selectors
  const {
    Session,
    selectedSession,
    loading: sessionsLoading,
    error: sessionsError,
  } = useSelector((state) => state.session || {});
  const { get_Exstudent, loading, singleLoading, error } = useSelector(
    (state) => state.Exstudent || {}
  );

  // Derived data
  const students = useMemo(
    () => get_Exstudent?.students || [],
    [get_Exstudent]
  );


  const totalPages = useMemo(
    () => Math.ceil((get_Exstudent?.totalRecords || 0) / PAGE_SIZE),
    [get_Exstudent]
  );

  // Fetch ex-students
  useEffect(() => {
    if (selectedSession) {
      dispatch(
        GetExStudent({
          getData: {
            sessionid: selectedSession || DEFAULT_SESSION_ID,
            page: currentPage,
            pageSize: PAGE_SIZE,
            name: debouncedSearch,
          }, token
        })
      );
    }
  }, [debouncedSearch, currentPage, selectedSession, dispatch]);

  // Ensure a session is selected
  useEffect(() => {
    if (Session?.length && !selectedSession) {
      // Optionally dispatch action to set default session
    }
  }, [Session, selectedSession]);

  // Handlers
  const handleViewProfile = (id) => {
    dispatch(getSingleStudent({ id, token }))
      .unwrap()
      .then(() => navigate(`/view/profile/${id}`))
      .catch((err) => console.error("Failed to fetch student:", err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="flex w-full py-16 items-center justify-center animate-pulse">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
        <img
          src={logo}
          alt="Loading"
          className="rounded-full h-28 w-28 transform hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-20">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="font-semibold text-xl text-gray-700 dark:text-gray-200">
            No Ex-Students Found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Try adjusting your search criteria or check back later for new
            ex-students.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  // Error State
  const ErrorState = ({ error }) => (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-20">
        <div className="mx-auto max-w-md rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-6 text-sm text-red-600 dark:text-red-300 animate-fade-in">
          <strong className="font-semibold">Error:</strong>{" "}
          {typeof error === "string"
            ? error
            : error?.message ?? "Something went wrong. Please try again."}
        </div>
      </TableCell>
    </TableRow>
  );

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 2 && page <= currentPage + 2)
    );

    return (
      <nav
        className="flex flex-wrap justify-center md:justify-end items-center gap-3 py-4"
        aria-label="Pagination"
      >
        <Button
          size="icon"
          variant="ghost"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          className="h-10 w-10 rounded-full hover:bg-indigo-500 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-all duration-300 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            variant={currentPage === page ? "default" : "outline"}
            className={`h-10 w-10 rounded-full font-semibold transition-all duration-300 ${currentPage === page
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "border-indigo-200 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              }`}
            aria-label={`Page ${page}`}
          >
            {page}
          </Button>
        ))}
        <Button
          size="icon"
          variant="ghost"
          disabled={currentPage === totalPages}
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          className="h-10 w-10 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-all duration-300 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
    );
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-6 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Top Controls */}
          <div className="grid w-full gap-4 sm:grid-cols-12 items-center">
            <Button
              onClick={() => navigate(-1)}
              className="sm:col-span-4 md:col-span-3 bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-md hover:bg-blue-900 flex items-center justify-center sm:justify-start gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Back to students"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden lg:inline ">Back to Students</span>
            </Button>
            <div className="relative sm:col-span-8 md:col-span-9">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by ex-student name…"
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search ex-students"
              />
            </div>
          </div>

          {/* Table */}
          <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 sm:max-h-[65vh] md:max-h-[75vh] overflow-auto scrollbar-thin scrollbar-thumb-indigo-500 dark:scrollbar-thumb-indigo-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 transition-all duration-300">
            <Table className="w-full text-sm md:text-base">
              <TableHeader className="bg-gradient-to-r from-orange-100 to-orange-200 text-white sticky top-0 z-10 dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-500">
                <TableRow className="grid grid-cols-[60px_1fr_1fr_1fr_80px] text-left">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 pl-4 py-3">
                    Sr. No.
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-3">
                    Student Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-3">
                    Enrollment ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 py-3">
                    Batch Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-200 text-center py-3">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <SkeletonLoader />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <ErrorState error={error} />
                ) : Array.isArray(students) && students.length > 0 ? (
                  students.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className="grid grid-cols-[60px_1fr_1fr_1fr_80px] items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
                    >
                      <TableCell className="pl-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">
                        {PAGE_SIZE * (currentPage - 1) + (index + 1)}
                      </TableCell>

                      <TableCell className="py-3">
                        <span className="font-medium text-gray-800 dark:text-gray-200 break-words">
                          {student.name ?? "No Name"}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                        {student.enrollment_id ?? "N/A"}
                      </TableCell>

                      <TableCell className="py-3 text-gray-600 dark:text-gray-300 break-words">
                        {student?.enrollment?.Batch?.BatchesName ?? "No Batch"}
                      </TableCell>

                      <TableCell className="text-center py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <MoreVertical
                              className="mx-auto cursor-pointer text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                              size={20}
                              aria-label="More actions"
                            />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleViewProfile(student?.enrollment?.id)}
                                disabled={singleLoading}
                                className={`py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200 ${singleLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                              >
                                {singleLoading ? "Loading…" : "View Profile"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/student-payment-history/${student?.enrollment?.id}`
                                  )
                                }
                                className="py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                              >
                                Payment History
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/student_attendance/${student?.enrollment?.id}`)
                                }
                                className="py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                              >
                                Attendance
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <EmptyState />
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ExStudentsData;
