import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import { Button } from "../../src/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";
import {
  exportEmisExcel,
  fetchEmis,
  getEmis,
  updateEmiPayment,
} from "../../../Redux_store/Api/EmisApiStore";
import {
  fetchBatchesByCourseId,
  get_Batches,
} from "../../../Redux_store/Api/Batches";
import { useLocation, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../../src/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { useForm } from "react-hook-form";
import logo from "../../../assets/Image/intellix.png";
import { toast, ToastContainer, Zoom } from "react-toastify";
import No_data_found from "../No_data_found";
const isDarkMode = true;
// Constants
const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const YEARS = ["2023", "2024", "2025"];
const ROWS_PER_PAGE = 10;

const Missed = () => {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const location = useLocation();
  const source = location.state?.source || "Accounts";
  const dispatch = useDispatch();
  const getData = useLocation();
  const getPathName = getData?.pathname;
  const output = getPathName.replace("/", "");

  const [storeid, setstoreid] = useState("");
  const [batchidstoree, setbatchidstore] = useState("");

  const fdat = useSelector((state) => state.emis.firstDate);
  const ldate = useSelector((state) => state.emis.toDate);

  // 👇 Put this function OUTSIDE the component (once)
  const formatDateToDMY = (isoDateStr) => {
    if (!isoDateStr) return null;
    const date = new Date(isoDateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const getDatesFromMonthYear = (month, year) => {
    if (!month || !year) return null;
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);
    return {
      fromDate: formatDateToDMY(fromDate),
      toDate: formatDateToDMY(toDate),
    };
  };
  // ✅ MAIN FUNCTION (also outside component)
  const getCurrentDates = (source) => {
    const searchParams = new URLSearchParams(window.location.search);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (source === "Accounts" && month && year) {
      const result = getDatesFromMonthYear(Number(month), Number(year));
      if (result) return result;
    }

    const now = new Date();
    const today = formatDateToDMY(now);
    return {
      fromDate: today,
      toDate: today,
    };
  };

  const storedEmiState = JSON.parse(localStorage.getItem("emiState") || "{}");
  const { fromDate: defaultFromDate, toDate: defaultToDate } =
    getCurrentDates(source);
  const [emiState, setemiState] = useState({
    fromDate: defaultFromDate,
    toDate: defaultToDate,
    status: storedEmiState.status || "missed",
    courseId: storedEmiState.courseId || "",
    batchId: storedEmiState.batchId || "",
    page: storedEmiState.page || 1,
  });
  const handleExport = () => {
    dispatch(
      exportEmisExcel({
        fromDate: emiState.fromDate,
        toDate: emiState.toDate,
        status: "missed",
        courseId: emiState.courseId,
        batchId: emiState.batchId,
        token,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(res); // check karo kya structure hai response ka
        toast.success(res?.message || "EMI report exported successfully!");
      })
      .catch((error) => {
        const errorMessage =
          error?.error?.length > 0
            ? error?.error?.[0]?.message
            : error?.message || "Failed to export EMI report.";
        toast.error(errorMessage);
      });
  };

  const date = new Date();
  const [month, setMonth] = useState(
    String(date.getMonth() + 1).padStart(2, "0")
  );

  const [year, setYear] = useState(String(date.getFullYear()));
  const [searchInput, setSearchInput] = useState(""); // For controlled input
  const [comps, setComps] = useState(""); // For debounced search filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [localFromDate, setLocalFromDate] = useState(emiState.fromDate);
  const [localToDate, setLocalToDate] = useState(emiState.toDate);

  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // Fetch data when month or year changes

  const [fromDate, setFromDate] = useState(emiState.fromDate);
  const [toDate, setToDate] = useState(emiState.toDate);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const { recive, loading, error } = useSelector((state) => state.emis || {});

  const prevEmiState = useRef(emiState);
  const handleSearch = useCallback(
    debounce((value) => {
      setComps(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, []);

  const rowsPerPage = 9;
  const paginatedData = recive?.data || [];

  const meta = recive?.meta || {};
  const totalPages = meta.totalPages || 1;
  const { register, handleSubmit, setValue } = useForm();

  const [selectedBatch, setSelectedBatch] = useState("");

  // Generate dynamic years (last 5 years and next 2 years)
  const years = Array.from({ length: 8 }, (_, i) => date.getFullYear() - 3 + i);

  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const { course } = useSelector((s) => s.acad_courses);
  const [dialogError, setDialogError] = useState("");
  const [openDialogId, setOpenDialogId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const subjects = useSelector((state) => state.acad_courses.subjects);
  // const [selectedSubject, setSelectedSubject] = useState("Select Subject");
  const {
    // Batches: batches,
    loading: batchesLoading,
    error: batchesError,
  } = useSelector((state) => state.Batch || {});
  const batches = useSelector((state) => state.Batch);

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch]);

  const handleSelect = (courseName, courseId) => {
    setSelectedCourse(courseName === "" ? "All" : courseName);
    setSelectedBatch(""); // Reset batch label
    setstoreid(courseId); // Store course ID if needed
    setemiState((prev) => ({
      ...prev,
      courseId, // Update selected course
      batchId: "", // Reset batch ID
      page: 1, // Reset pagination
    }));

    // Only fetch batches if a specific course is selected (not "All")
    if (courseId !== "") {
      dispatch(fetchBatchesByCourseId({ courseId, token }));
    } else {
    }
  };
  useEffect(() => {
    dispatch(
      fetchEmis({
        fromDate: emiState.fromDate,
        toDate: emiState.toDate,
        status: emiState.status,
        courseId: emiState.courseId,
        batchId: emiState.batchId,
        page: emiState.page,
        limit: rowsPerPage,
        token,
      })
    );
  }, [dispatch, emiState, rowsPerPage]);
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/view/profile/${id}`);
  };
  const handleUpdatePayment = async (id) => {
    if (!selectedDate) {
      setDialogError("Please select a payment date.");
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Please select a payment date.";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await dispatch(
        updateEmiPayment({ emiId: id, paymentDate: selectedDate, token })
      ).unwrap();

      if (res?.emi?.[0] === 1) {
        setOpenDialogId(null);
        setDialogError("");
        dispatch(
          fetchEmis({
            fromDate: emiState.fromDate,
            toDate: emiState.toDate,
            status: emiState.status,
            courseId: emiState.courseId,
            batchId: emiState.batchId,
            page: emiState.page,
            limit: rowsPerPage,
            token,
          })
        );
        toast.success("Payment marked as paid successfully!");
      } else {
        setDialogError("Payment update failed. Please try again.");
        const errorMessage =
          error?.error?.length > 0
            ? error?.error?.[0]?.message
            : error?.message || "Payment update failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err?.message || "Something went wrong. Please try again.";
      setDialogError(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
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
          {/* Back Button & Search Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6">
            {/* Back Button */}
            <div className="flex justify-center md:justify-start">
              <Button
                onClick={() => window.history.back()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center md:justify-start gap-2"
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back</span>
              </Button>
            </div>

            {/* Filter by Date */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Filter by Date
                </Button>
              </DialogTrigger>
              <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-[425px]"
              >
                <DialogHeader className="text-center">
                  <DialogTitle>Filter by Date</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* FROM Date */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">FROM :</Label>
                    <Button
                      variant="outline"
                      className="w-[250px] flex items-center text-left justify-between shadow-sm border border-blue-400 rounded-xl px-4 py-2 shadow-blue-500/50 font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        fromInputRef.current?.showPicker();
                      }}
                    >
                      {localFromDate || "Pick a date"}
                      <CalendarIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      ref={fromInputRef}
                      type="date"
                      value={localFromDate}
                      onChange={(e) => setLocalFromDate(e.target.value)}
                      className="opacity-0 absolute -z-10"
                    />
                  </div>

                  {/* TO Date */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">TO :</Label>
                    <Button
                      variant="outline"
                      className="w-[250px] flex items-center text-left justify-between shadow-sm border border-blue-400 rounded-xl px-4 py-2 shadow-blue-500/50 font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        toInputRef.current?.showPicker();
                      }}
                    >
                      {localToDate || "Pick a date"}
                      <CalendarIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      ref={toInputRef}
                      type="date"
                      value={localToDate}
                      onChange={(e) => setLocalToDate(e.target.value)}
                      className="opacity-0 absolute -z-10"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      setemiState((prev) => ({
                        ...prev,
                        fromDate: localFromDate,
                        toDate: localToDate,
                        page: 1,
                      }));
                      setIsOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Export Excel Button */}
            <Button
              onClick={handleExport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Export Excel
            </Button>

            {/* Course Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 border-gray-300 dark:border-gray-600 truncate"
                >
                  <span className="truncate">
                    {selectedCourse || "Select Course"}
                  </span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    key="All"
                    onClick={() => handleSelect("", "")}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    All
                  </DropdownMenuItem>
                  {Array.isArray(course?.data) && course.data.length > 0 ? (
                    course.data.map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => handleSelect(c.course_name, c.id)}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {c.course_name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No courses available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Batch Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 border-gray-300 dark:border-gray-600 truncate"
                  disabled={emiState.courseId === ""}
                >
                  <span className="truncate">
                    {selectedBatch || "Select Batch"}
                  </span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto">
                {emiState.courseId !== "" &&
                batches?.batches?.data?.batches?.length > 0 ? (
                  batches.batches.data.batches.map((batch) => (
                    <DropdownMenuItem
                      key={batch.id}
                      onClick={() => {
                        setSelectedBatch(batch.BatchesName);
                        setemiState((prev) => ({
                          ...prev,
                          batchId: batch.id,
                          page: 1,
                        }));
                      }}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      {batch.BatchesName}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    {emiState.courseId === ""
                      ? "Select a course first"
                      : "No batches available"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
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
          ) : (
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-800 dark:text-gray-200">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-left">
                    <tr>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        ID
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Batch
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Course
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Student
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Payment Date
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Amount
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300">
                        Due Amount
                      </th>
                      <th className="p-4 font-semibold border-b border-gray-300 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData?.length > 0 ? (
                      paginatedData?.map((row, index) => {
                        return (
                          <tr
                            key={row.id}
                            className="transition hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() =>
                              handleRowClick(row?.Student_Enrollment?.id)
                            }
                          >
                            <td className="p-4 border-b">
                              {" "}
                              {(emiState.page - 1) * rowsPerPage + index + 1}
                            </td>
                            <td className="p-4 border-b">
                              {row.Student_Enrollment?.Batch?.BatchesName
                                ? row.Student_Enrollment.Batch.BatchesName
                                    .length > 15
                                  ? row.Student_Enrollment.Batch.BatchesName.slice(
                                      0,
                                      15
                                    ) + "..."
                                  : row.Student_Enrollment.Batch.BatchesName
                                : "N/A"}
                            </td>
                            {/* Course not available in data, so we show 'N/A' */}
                            <td className="p-4 border-b">
                              {row.Student_Enrollment?.Course?.course_name
                                ? row.Student_Enrollment.Course.course_name
                                    .length > 15
                                  ? row.Student_Enrollment.Course.course_name.slice(
                                      0,
                                      15
                                    ) + "..."
                                  : row.Student_Enrollment.Course.course_name
                                : "N/A"}
                            </td>
                            <td className="p-4 border-b">
                              {row.Student_Enrollment?.Student?.name || "N/A"}
                            </td>
                            <td className="p-4 border-b">
                              {row.payment_date
                                ? new Date(
                                    row.payment_date
                                  ).toLocaleDateString()
                                : "Not Paid"}
                            </td>
                            <td className="p-4 border-b font-semibold text-red-600 dark:text-red-400">
                              ₹{row.amount.toLocaleString()}
                            </td>
                            <td className="p-4 border-b font-semibold text-red-600 dark:text-red-400">
                              ₹{row.due_amount.toLocaleString()}
                            </td>
                            <td
                              className="p-4 border-b  text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Dialog
                                open={openDialogId === row.id}
                                onOpenChange={(isOpen) => {
                                  setDialogError("");
                                  setOpenDialogId(isOpen ? row.id : null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="text-green-600 underline hover:text-green-800"
                                    onClick={() => {
                                      setOpenDialogId(row.id);
                                      setSelectedDate("");
                                    }}
                                  >
                                    Mark as Paid
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Mark as Paid</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label
                                        htmlFor="payment-date"
                                        className="text-right"
                                      >
                                        Date
                                      </Label>
                                      <Input
                                        id="payment-date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) =>
                                          setSelectedDate(e.target.value)
                                        }
                                        placeholder="yyyy-mm-dd"
                                        className="col-span-3"
                                      />
                                    </div>
                                  </div>
                                  {dialogError && (
                                    <p className="text-red-500 text-sm">
                                      {dialogError}
                                    </p>
                                  )}
                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      onClick={() =>
                                        handleUpdatePayment(row.id)
                                      }
                                    >
                                      Save Status
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center p-4 text-gray-500 font-semibold"
                        >
                          <No_data_found />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (emiState.page > 1) {
                        setemiState((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }));
                      }
                    }}
                    className={
                      emiState.page === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                    aria-disabled={emiState.page === 1}
                  />
                </PaginationItem>

                {Array.from({ length: meta?.totalPages || 0 }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setemiState((prev) => ({
                          ...prev,
                          page: i + 1,
                        }));
                      }}
                      className={`px-4 py-2 rounded-md transition ${
                        emiState.page === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-500 hover:text-white"
                      }`}
                      aria-current={
                        emiState.page === i + 1 ? "page" : undefined
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (emiState.page < meta?.totalPages) {
                        setemiState((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }));
                      }
                    }}
                    className={
                      emiState.page === meta?.totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    aria-disabled={emiState.page === meta?.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Missed;
