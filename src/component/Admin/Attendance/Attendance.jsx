import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarInset } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Header from "../Dashboard/Header";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle,
  Download,
  GraduationCapIcon,
  Search,
  Users,
  UsersIcon,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../src/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../src/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";
import "./Attendance.css";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadEmployeeExcel,
  export_excel,
  fetchAttendance,
  fetchEmployeeAttendance,
  markAllPresent,
  markAllPresentByEmployee,
} from "../../../Redux_store/Api/Attendance";
import DatePicker from "react-multi-date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";
import { ToastContainer, Zoom, toast } from "react-toastify";
import {
  setPage,
  setSearchFilters,
} from "../../../Redux_store/slices/Attendance";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { fetchBatchesByCourseId } from "../../../Redux_store/Api/Batches";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/ui/tabs";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "../../src/components/ui/command";
import { fetchActiveEmployees } from "../../../Redux_store/Api/TeamApi";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import CardHeaderAtt from "./CardHeaderAtt";
import { FaAngleDown } from "react-icons/fa6";
import { Label } from "../../src/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import No_data_found from "../No_data_found";
export const exportSchema = z
  .object({
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date",
      }),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date",
      }),
    course: z.string().min(1, "Course is required"),
    batch: z.string().min(1, "Batch is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date (not the same)",
    path: ["endDate"],
  });

const isDarkMode = true;

const Attendance = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);

  const [totalStudents, setTotalStudents] = useState(0);
  const [onLeave, setOnLeave] = useState("50");
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchEnrollmentId, setSearchEnrollmentId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBatchName, setSearchBatchName] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [attendanceData, setAttendanceData] = useState([]);
  const [openFirstModal, setOpenFirstModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    data,
    page,
    limit,
    search,
    loading,
    error,
    totalStudent,
    totalPresent,
    totalAbsent,
    totalHalfday,
    totalPages,
  } = useSelector((state) => state.attendance);
  console.log('====================================');
  console.log(totalStudent);
  console.log('====================================');
  const sessionID = useSelector((state) => state.session?.selectedSession);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAttendanceData(data);
      setTotalStudents(data.length);
      setOnLeave(data.filter((d) => d.status === "On Leave").length);
    }
  }, [data]);

  useEffect(() => {
    if (sessionID != null) {
      dispatch(
        fetchAttendance({
          sessionID,
          name: search.name || "",
          batch: search.batch || "",
          enrollment_id: search.enrollment_id || "",
          status: "",
          page,
          limit,
          date,
          selectedTab,
          token
        })
      );
    }
  }, [dispatch, sessionID, search, page, limit, date]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      setSearchFilters({
        name: searchName,
        batch: searchBatchName,
        enrollment_id: searchEnrollmentId,
      })
    );
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(setPage(newPage));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    dispatch(
      fetchAttendance({
        sessionID,
        name: searchName,
        batch: searchBatchName,
        enrollment_id: searchEnrollmentId,
        status: "",
        page,
        limit,
        date: selectedDate,
        token
      })
    );
  };

  const filteredData = attendanceData?.filter((student) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "In") return student.status === "In";
    if (selectedTab === "Out") return student.status === "Out";
    if (selectedTab === "Absent") return student.status === "Absent";
    return true;
  });

  const [formData, setFormData] = useState({
    Batch_id: "",
    from: "",
    to: "",
  });

  const handleProceed = () => {
    const values = getValues();
    const result = exportSchema.safeParse(values);

    if (!result.success) {
      Object.entries(result.error.flatten().fieldErrors).forEach(
        ([key, val]) => {
          if (val?.[0]) {
            console.warn(`${key}: ${val[0]}`);
          }
        }
      );
      return;
    }

    setOpenFirstModal(false);
    setTimeout(() => setOpenSecondModal(true), 300);
  };

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      course: "",
      batch: "",
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  setValue("search.name", searchName);

  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const { course } = useSelector((s) => s.acad_courses);
  const [courseid, setcourseid] = useState();
  const Batches = useSelector((state) => state?.Batch?.batches);

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch]);

  const handleSelect = (courseName, id) => {
    setSelectedCourse(courseName);
    setcourseid(id);
    dispatch(fetchBatchesByCourseId({ courseId: id, token }));
  };

  // Employee Attendance
  const [currentPageAtt, setCurrentPageAtt] = useState(1);
  const handlePageChangeAtt = (newPage) => {
    setCurrentPageAtt(newPage);
    dispatch(setPage(newPage));
  };

  const { attendance, pagination, absent, halfday, present, totalTeam } =
    useSelector((state) => state.attendance);

  const [firstName, setFirstName] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const limitAtt = 20;

  useEffect(() => {
    setCurrentPageAtt(1);
  }, [firstName, dateSearch]);

  useEffect(() => {
    dispatch(
      fetchEmployeeAttendance({
        token,
        first_name: firstName,
        attendence_date: dateSearch,
        page: currentPageAtt,
        limit: limitAtt,
        status: "",
      })
    );
  }, [firstName, dispatch, dateSearch, currentPageAtt, limitAtt]);

  const [dates, setDates] = useState([]);
  const [datess, setDatess] = useState([]);

  const handleMarkAll = async () => {
    try {
      const result = await dispatch(markAllPresent({ body: { dates }, token })).unwrap();

      toast.success(result.message || "Marked successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Zoom,
      });

      dispatch(
        fetchEmployeeAttendance({
          token,
          first_name: firstName,
          attendence_date: dateSearch,
          page: currentPageAtt,
          limit: limitAtt,
          status: "",
        })
      );

      setDates([]);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "An error occurred";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  const handleMarkAllEmployee = async () => {
    try {
      const result = await dispatch(
        markAllPresentByEmployee({ body: { dates: datess, employeeIds: selected }, token })
      );

      if (markAllPresentByEmployee.fulfilled.match(result)) {
        toast.success(result.payload.message || "Marked successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Zoom,
        });

        dispatch(
          fetchEmployeeAttendance({
            first_name: firstName, token,
            attendence_date: dateSearch,
            page: currentPageAtt,
            limit: limitAtt,
            status: "",
          })
        );

        setDatess([]);
        setSelected([]);
      } else {
        throw new Error(result.error?.message || "An error occurred");
      }
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "An error occurred";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Zoom,
      });
    }
  };


  const { employees } = useSelector((state) => state.team);
  useEffect(() => {
    dispatch(fetchActiveEmployees(token));
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [openExcel, setOpenExcel] = useState(false);
  const [dateExport, setDateExport] = useState("");
  const handleDownload = async () => {
    try {
      await dispatch(
        downloadEmployeeExcel({ attendence_date: dateExport, token })
      ).unwrap();
      setDateExport("");
      setOpenExcel(false);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const errorMessage =
    error?.error?.length > 0
      ? error?.error?.[0]?.message
      : error?.message || "No attendance records found.";

  const [valueTab, setValueTab] = useState("student_att");

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 lg:p-8">
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
          <CardHeaderAtt
            value={valueTab}
            count={
              valueTab === "student_att"
                ? {
                  t: totalStudent,
                  p: totalPresent,
                  a: totalAbsent,
                  h: totalHalfday,
                }
                : { t: totalTeam, p: present, a: absent, h: halfday }
            }
            apiData={
              valueTab === "student_att"
                ? {
                  p: page,
                  l: limit,
                  s: search,
                  stb: selectedTab,
                  d: date,
                  sn: searchName,
                }
                : {
                  n: firstName,
                  d: dateSearch,
                  cp: currentPageAtt,
                  l: limitAtt,
                }
            }
          />
          <Tabs
            value={valueTab}
            onValueChange={setValueTab}
            defaultValue="student_att"
          >
            {/* ---------- Header: Tabs + Export (responsive) ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center p-4 shadow-sm shadow-gray-700/30">
              {/* ---------- Tabs (always 2 equal buttons) ---------- */}
              <TabsList className="col-span-1 md:col-span-2 grid grid-cols-2 gap-2 w-full">
                {/* Student Attendance */}
                <TabsTrigger
                  value="student_att"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
        ${valueTab === "student_att"
                      ? "bg-blue-800 text-white shadow"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white"
                    }`}
                >
                  <GraduationCapIcon className="w-4 h-4" />
                  Student
                </TabsTrigger>

                {/* Employee Attendance */}
                <TabsTrigger
                  value="employee_att"
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
        ${valueTab === "employee_att"
                      ? "bg-blue-800 text-white shadow"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white"
                    }`}
                >
                  <UsersIcon className="w-4 h-4" />
                  Employee
                </TabsTrigger>
              </TabsList>

              {/* ---------- Export Report Button & Dialog (responsive) ---------- */}
              {valueTab === "student_att" ? (
                <Dialog
                  open={openFirstModal}
                  onOpenChange={setOpenFirstModal}
                  className="col-span-1"
                >
                  <DialogTrigger asChild>
                    {/* full-width on ≤ md, auto on lg */}
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto text-sm sm:text-base">
                      <Download className="mr-2" /> Export Report
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className="w-full max-w-[90vw] sm:max-w-lg bg-background text-foreground shadow-xl rounded-xl p-4 sm:p-6"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-center">
                        Export Report
                      </DialogTitle>
                    </DialogHeader>

                    <form
                      onSubmit={handleSubmit(handleProceed)}
                      className="space-y-5 mt-4"
                    >
                      {/* --- Course --- */}
                      <div>
                        <label className="block mb-1 font-medium">
                          Select Course
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-between px-4 py-2 border rounded-md bg-muted dark:bg-muted/30"
                            >
                              {selectedCourse || "Choose course"}
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full bg-popover text-popover-foreground shadow-md">
                            {Array.isArray(course?.data) &&
                              course.data.length ? (
                              course.data.map((c) => (
                                <DropdownMenuItem
                                  key={c.id}
                                  onClick={() =>
                                    handleSelect(c.course_name, c.id)
                                  }
                                  className="cursor-pointer hover:bg-accent"
                                >
                                  {c.course_name}
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <DropdownMenuItem disabled>
                                Loading...
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* --- Batch --- */}
                      <div>
                        <label className="block mb-1 font-medium">
                          Select Batch
                        </label>
                        <select
                          className="w-full px-4 py-2 border rounded-md bg-muted dark:bg-muted/30 text-foreground"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Batch_id: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Batch</option>
                          {Batches?.data?.batches?.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.BatchesName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* --- Date Range --- */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            From Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-md bg-muted dark:bg-muted/30 text-foreground cursor-pointer"
                            onChange={(e) =>
                              setFormData({ ...formData, from: e.target.value })
                            }
                            onClick={(e) =>
                              e.target.showPicker && e.target.showPicker()
                            }
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            To Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-md bg-muted dark:bg-muted/30 text-foreground cursor-pointer"
                            onChange={(e) =>
                              setFormData({ ...formData, to: e.target.value })
                            }
                            onClick={(e) =>
                              e.target.showPicker && e.target.showPicker()
                            }
                          />
                        </div>
                      </div>

                      {/* --- Proceed --- */}
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          onClick={() => {
                            dispatch(export_excel({ data: formData, token }))
                              .unwrap()
                              .then(() => setOpenFirstModal(false))
                              .catch((error) =>
                                toast.error("Export failed. Please try again.")
                              );
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        >
                          Proceed
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                /* ---------- Employee Export Dialog ---------- */
                <Dialog
                  open={openExcel}
                  onOpenChange={setOpenExcel}
                  className="col-span-1"
                >
                  <form>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto text-sm sm:text-base">
                        <Download className="mr-2" /> Export Report
                      </Button>
                    </DialogTrigger>

                    <DialogContent
                      className="w-full max-w-[90vw] sm:max-w-[425px] p-4 sm:p-6"
                      onPointerDownOutside={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle>Export Attendance Report</DialogTitle>
                        <DialogDescription>
                          Choose the details below and click ‘Download Excel’.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 mb-6">
                        <div>
                          <Label htmlFor="emp-date">Date</Label>
                          <Input
                            id="emp-date"
                            type="date"
                            className="w-full dark:text-white dark:bg-gray-900 dark:[color-scheme:dark]"
                            value={dateExport}
                            onChange={(e) => setDateExport(e.target.value)}
                            onClick={(e) =>
                              e.target.showPicker && e.target.showPicker()
                            }
                          />
                        </div>
                      </div>

                      <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleDownload} disabled={loading}>
                          {loading ? "Downloading..." : "Download Excel"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              )}
            </div>

            <TabsContent value="student_att">
              <div className="rounded-lg shadow-sm shadow-blue-500/50 mt-6 p-4">
                {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {["All"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`rounded-md px-4 py-2 text-xs sm:text-sm font-medium ${
                        selectedTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div> */}
                <form
                  onSubmit={handleSearch}
                  /* 1 col → md: 2 cols → lg: 4 cols */
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                >
                  {/* Enrollment ID */}
                  <input
                    type="text"
                    placeholder="Search By Enrollment Id"
                    value={searchEnrollmentId}
                    onChange={(e) => setSearchEnrollmentId(e.target.value)}
                    className="w-full h-10 px-2 py-2 text-xs sm:text-sm border border-blue-500 rounded-md bg-transparent text-gray-700 shadow-sm"
                  />

                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Search By Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full h-10 px-2 py-2 text-xs sm:text-sm border border-blue-500 rounded-md bg-transparent text-gray-700 shadow-md"
                  />

                  {/* Batch Name */}
                  <input
                    type="text"
                    placeholder="Search By Batch Name"
                    value={searchBatchName}
                    onChange={(e) => setSearchBatchName(e.target.value)}
                    className="w-full h-10 px-2 py-2 text-xs sm:text-sm border border-blue-500 rounded-md bg-transparent text-gray-700 shadow-md"
                  />

                  {/* Search button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-10 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white border border-blue-500 rounded-lg shadow-md shadow-blue-500/50"
                  >
                    Search
                  </button>

                  {/* Date picker (trigger + hidden input) */}
                  <div className="relative w-full">
                    <Button
                      variant="outline"
                      className="w-full h-10 flex items-center justify-between px-3 sm:px-4 border border-blue-400 rounded-xl shadow-sm shadow-blue-500/50 font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        inputRef.current?.showPicker();
                      }}
                    >
                      {date
                        ? format(new Date(date), "yyyy-MM-dd")
                        : "Pick a date"}
                      <CalendarIcon className="w-5 h-5" />
                    </Button>

                    {/* invisible native picker */}
                    <Input
                      ref={inputRef}
                      type="date"
                      value={date || ""}
                      onChange={handleDateChange}
                      onClick={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      className="absolute inset-0 opacity-0 -z-10"
                    />
                  </div>
                </form>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto border rounded-md">
                  {loading ? (
                    <p className="text-center py-4">Loading...</p>
                  ) : error ? (
                    <No_data_found />

                  ) : filteredData.length > 0 ? (
                    <table className="w-full border-collapse border">
                      <thead className="dark:bg-gray-800 bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="border sm:px-4 py-2 text-xs sm:text-sm">
                            Enrollment ID
                          </th>
                          <th className="border sm:px-4 py-2 text-xs sm:text-sm">
                            Name
                          </th>
                          <th className="border sm:px-4 py-2 text-xs sm:text-sm">
                            Batch Name
                          </th>
                          <th className="border sm:px-4 py-2 text-xs sm:text-sm">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map((student, i) => (
                          <tr key={i}>
                            <td className="border sm:px-4 py-2 text-xs sm:text-sm">
                              {student?.Student?.enrollment_id}
                            </td>
                            <td className="border sm:px-4 py-2 text-xs sm:text-sm">
                              {student?.Student?.name}
                            </td>
                            <td className="border sm:px-4 py-2 text-xs sm:text-sm">
                              {student?.Student?.batch}
                            </td>
                            <td
                              className={`border sm:px-4 py-2 text-xs sm:text-sm text-center ${student.status === "present"
                                ? "text-green-800"
                                : student.status === "absent"
                                  ? "text-red-800"
                                  : student.status === "halfday"
                                    ? "text-yellow-800"
                                    : ""
                                }`}
                            >
                              {student.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center py-4 text-xs sm:text-sm">
                      No data available
                    </p>
                  )}
                </div>
                <Pagination className="mt-4 flex justify-center">
                  <PaginationContent className="flex flex-wrap gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-md ${currentPage === i + 1
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
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>
            <TabsContent value="employee_att">
              {/* -------- Bulk Actions container -------- */}
              <div className="rounded-xl shadow-sm shadow-gray-500/40 mt-6 p-4 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-lg font-semibold">Bulk Actions</h2>
                  <p className="text-sm text-gray-500">
                    Manage attendance for all employees at once
                  </p>
                </div>

                {/* Two action cards — 1-col (sm), 2-col (md+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ---------- Card 1 : specific employees ---------- */}
                  <div className="grid gap-4">
                    <h2 className="text-center py-3 px-5 text-gray-800 dark:text-white font-semibold border-b-2 border-blue-600 shadow-sm hover:shadow-md transition-shadow duration-300">
                      Mark Specific Employees Present
                    </h2>

                    {/* Employees pop-select + dates — 1-col → 2-col (sm+) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Employee multiselect popover */}
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start overflow-hidden border border-blue-400 hover:bg-transparent"
                          >
                            <div className="flex gap-1 overflow-x-auto scrollbar-hide whitespace-nowrap w-full">
                              {selected.length ? (
                                employees
                                  .filter((opt) => selected.includes(opt.id))
                                  .map((opt) => (
                                    <span
                                      key={opt.id}
                                      className="text-xs font-medium px-2 py-0.5 rounded"
                                    >
                                      {opt.first_name}
                                    </span>
                                  ))
                              ) : (
                                <span className="text-gray-500 flex items-center gap-1">
                                  Select Employees <FaAngleDown />
                                </span>
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandGroup>
                              {employees?.map((opt) => (
                                <CommandItem
                                  key={opt.id}
                                  onSelect={() => toggleOption(opt.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Check
                                      className={`h-4 w-4 ${selected.includes(opt.id)
                                        ? "opacity-100"
                                        : "opacity-0"
                                        }`}
                                    />
                                    {opt.first_name}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Multi-date picker */}
                      <DatePicker
                        multiple
                        value={datess}
                        onChange={setDatess}
                        format="YYYY-MM-DD"
                        inputClass="w-full px-4 py-2 text-xs sm:text-sm border border-blue-400 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                        className="custom-calendar cursor-pointer bg-transparent"
                        placeholder="Select multiple dates"
                      />
                    </div>

                    {/* Mark button */}
                    {datess.length || selected.length ? (
                      <div className="flex justify-center">
                        <button
                          disabled={loading}
                          onClick={handleMarkAllEmployee}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          {loading ? (
                            "Marking..."
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" /> Mark Present
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* ---------- Card 2 : all employees ---------- */}
                  <div className="grid gap-4">
                    <h2 className="text-center py-3 px-5 text-gray-800 dark:text-white font-semibold border-b-2 border-blue-600 shadow-sm hover:shadow-md transition-shadow duration-300">
                      Mark All Employees Present
                    </h2>

                    {/* Date picker */}
                    <DatePicker
                      multiple
                      value={dates}
                      onChange={setDates}
                      format="YYYY-MM-DD"
                      inputClass="w-full px-4 py-2 text-xs sm:text-sm border border-blue-400 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                      className="custom-calendar cursor-pointer bg-transparent"
                      placeholder="Select multiple dates"
                    />

                    {/* Mark button */}
                    {dates.length ? (
                      <div className="flex justify-center">
                        <button
                          disabled={loading}
                          onClick={handleMarkAll}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          {loading ? (
                            "Marking..."
                          ) : (
                            <>
                              <Users className="w-4 h-4" /> Mark Present
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 pb-6 rounded-xl shadow-sm shadow-gray-700/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md bg-gray-50 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-xs sm:text-sm"
                  />
                </div>
                <Input
                  type="date"
                  className="w-full dark:text-white dark:bg-gray-900 dark:[color-scheme:dark] text-xs sm:text-sm"
                  value={dateSearch}
                  onChange={(e) => setDateSearch(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto border rounded-md">
                <Table className="w-full border-collapse border">
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="dark:bg-gray-800 bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800">
                      <TableHead className="text-xs sm:text-sm">
                        Sr. no.
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        In Time
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Out Time
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      error ?
                        <No_data_found /> : attendance?.map((emp, i) => (
                          <TableRow key={i}>

                            <TableCell>{(currentPageAtt - 1) * limitAtt + i + 1}</TableCell>
                            <TableCell>{emp?.Employee?.first_name}</TableCell>
                            <TableCell>{emp?.in_time}</TableCell>
                            <TableCell>{emp?.out_time}</TableCell>
                            <TableCell
                              className={
                                emp.status === "present"
                                  ? "text-green-500"
                                  : emp.status === "half_day"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }
                            >
                              {emp.status}
                            </TableCell>
                          </TableRow>
                        ))
                    }
                  </TableBody>
                </Table>
              </div>
              {pagination.totalPages ? (
                <Pagination className="mt-4 flex justify-center">
                  <PaginationContent className="flex flex-wrap gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPageAtt > 1 &&
                          handlePageChangeAtt(currentPageAtt - 1)
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => handlePageChangeAtt(i + 1)}
                          className={`px-4 py-2 rounded-md ${currentPageAtt === i + 1
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
                        onClick={() =>
                          currentPageAtt < pagination.totalPages &&
                          handlePageChangeAtt(currentPageAtt + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : (
                <></>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Attendance;
