import React, { useEffect, useRef, useState } from "react";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import Header from "../../Dashboard/Header";
import { Button } from "../../../src/components/ui/button";
import {
  ArrowLeft,
  BookX,
  CircleDot,
  Dot,
  Edit,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash,
  View,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../src/components/ui/form";
import { Input } from "../../../src/components/ui/input";
import { FormMessage } from "../../../src/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../src/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "../../../src/components/ui/scroll-area";
import {
  add_course,
  update_course,
  get_subject,
  fetchCoursesByName,
  deleteCourse,
  markCourseActive,
  get_course,
} from "../../../../Redux_store/Api/Academic_course";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../src/components/ui/pagination";
import {
  get_Batches,
  fetchBatchesByCourseId,
  CoursebyAdd_Batches,
} from "../../../../Redux_store/Api/Batches";
import logo from "../../../../assets/Image/intellix.png";
import { Link, useNavigate, useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/ui/select";
import { Badge } from "../../../src/components/ui/badge";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { getSessions } from "../../../../Redux_store/Api/SessionApi";
import Viewdetail from "./batch/Viewdetail";
import { fetchCoursesBySubject } from "../../../../Redux_store/Api/Employesassinedtask";
import No_data_found from "../../No_data_found";

// for batch add validation
const batchSchema = z.object({
  batchName: z.string().trim().min(1, "Batch name is required"),
  course_id: z.string().min(1, { message: "Course is required" }),
  starttime: z.string().min(1, { message: "Start time is required" }),
  endtime: z.string().min(1, { message: "End time is required" }),
});

const Courses = () => {
  const [AddCourses, setAddCourses] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourseNames, setEditedCourseNames] = useState({});
  const [getcourseName, setMyCourseName] = useState();
  const [formattedPrice, setFormattedPrice] = useState("");
  const token =
    useSelector((state) => state.logout.token) || localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourseid, setSelectedCourseid] = useState(null);
  const [searchquery, setsearchquery] = useState("");
  const [queryto, setQueryTo] = useState("");
  const [querystatus, setQuerystatus] = useState("active");
  const [courseName, setCourseName] = useState("");
  const [open, setOpen] = useState();
  const [AddBatches, setAddBatches] = useState(false);
  const dispatch = useDispatch();
  const [opensubjectdialog, setopensubjectdialog] = useState(false);
  const [addBatch, setAddBatch] = useState({
    BatchesName: "",
    course_id: "",
    StartTime: "",
    EndTime: "",
  });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  // for toast theme
  const isDarkMode = true;

  const { loading: coursesLoading, error: coursesError } = useSelector(
    (state) => state.courses || {}
  );

  const handleAddCourse = async (data) => {
    const newCourse = {
      course_name: data.course_name,
      course_type: data.course_type,
      course_duration: data.course_duration,
      course_price: data.course_price,
      discount_price: data.discount_price,
      status: data.status,
    };

    try {
      const response = await dispatch(
        add_course({ courseData: newCourse, token })
      ).unwrap();

      toast.success(response?.message || "Course Added Successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      form.reset();
      setFormattedPrice("");
      setAddCourses(false);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add course";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      console.error("Failed to add course:", error);
    } finally {
      await dispatch(
        fetchCoursesByName({
          token,
          course_name: searchquery,
          course_type: queryto,
          status: querystatus,
          page: currentPage,
          limit: CoursePerPage,
        })
      );
    }
  };

  const { course, courses, pagination, loading, error } = useSelector(
    (state) => state.acad_courses || {}
  );

  // validation schema
  const courseSchema = z.object({
    course_name: z.string().trim().min(2, "Course name is required").max(50),
    course_type: z.enum(["online", "offline"], {
      required_error: "Course type is required",
    }),
    course_duration: z.coerce
      .number()
      .min(1, "Duration must be at least 1 month"),
    course_price: z.coerce.number().min(0, "Price must be non-negative"),
    discount_price: z.coerce.number().min(0, "Discount must be non-negative"),
    status: z.enum(["active", "inactive"], {
      required_error: "Status is required",
    }),
  });

  const { Session } = useSelector((state) => state.session || {});
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      course_name: "",
      course_type: "",
      course_duration: "",
      course_price: "",
      discount_price: "",
      status: "",
      batchName: "",
      course_id: "",
      starttime: "",
      endtime: "",
    },
  });

  const batchForm = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      course_id: "",
      starttime: "",
      endtime: "",
    },
  });

  const navigate = useNavigate();
  const back = () => navigate("/Academics");

  const courseData = courses || [];
  const paginationInfo = pagination || {};
  const CoursePerPage = paginationInfo.limit || 16;
  const totalCourses = courseData.length;
  const totalPages = Math.ceil(totalCourses / CoursePerPage);
  const selectedCourse = courseData;

  const { batches } = useSelector((s) => s.Batch);
  const { course: coursess = { data: [] } } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(get_subject(token));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedCourseid) {
      dispatch(fetchBatchesByCourseId({ courseId: selectedCourseid, token }));
    }
  }, [selectedCourseid, token, dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { subjectCourses } = useSelector((s) => s.getBatch);

  const handleViewSubjects = (id) => {
    dispatch(fetchCoursesBySubject({ courseId: id, token }));
    setopensubjectdialog(true);
  };

  const handleDeleteCourse = async (courseId) => {
    // Validate courseId
    if (!courseId || isNaN(courseId)) {
      console.error("Invalid courseId:", courseId);
      toast.error("Invalid course ID. Please try again.", {
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
      return;
    }

    try {
      console.log("Attempting to delete course with ID:", courseId); // Debug log
      await dispatch(deleteCourse({ courseId, token })).unwrap();

      toast.success("Course Deactivated Successfully", {
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

      dispatch(
        fetchCoursesByName({
          token,
          course_name: searchquery,
          course_type: queryto,
          status: querystatus,
          page: currentPage,
          limit: CoursePerPage,
        })
      );
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Course Deactivation Failed";
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
      console.error("Deactivate Error:", error);
    }
  };

  // Apply filters first
  const filteredCourses = (courses || []).filter((course) => {
    const typeMatch = course.course_type
      .toLowerCase()
      .includes(queryto.toLowerCase());
    const statusmatch = course.status
      .toLowerCase()
      .includes(querystatus.toLowerCase());
    return typeMatch && statusmatch;
  });

  useEffect(() => {
    dispatch(
      fetchCoursesByName({
        token,
        course_name: searchquery,
        course_type: queryto,
        status: querystatus,
        page: currentPage,
        limit: CoursePerPage,
      })
    );
  }, [
    searchquery,
    queryto,
    querystatus,
    currentPage,
    CoursePerPage,
    dispatch,
    token,
  ]);

  const handleActivateCourse = async (id) => {
    // Validate id and token
    if (!id || isNaN(id)) {
      console.error("Invalid course ID:", id);
      toast.error("Invalid course ID. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }
    if (!token || typeof token !== "string") {
      console.error("Invalid token:", token);
      toast.error(
        "Authentication token is invalid or missing. Please log in again.",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        }
      );
      return;
    }

    try {
      console.log(
        "Attempting to activate course with ID:",
        id,
        "Token:",
        token
      ); // Debug log
      await dispatch(markCourseActive({ id, token })).unwrap();

      toast.success("Course activated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      dispatch(
        fetchCoursesByName({
          token,
          course_name: searchquery,
          course_type: queryto,
          status: querystatus,
          page: currentPage,
          limit: CoursePerPage,
        })
      );
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to activate course";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      console.error("Activate Error:", error);
    }
  };

  const handleCourseUpdate = async (cardId, updatedName) => {
    const payload = {
      id: cardId,
      course_Name: updatedName.trim(),
    };

    try {
      await dispatch(update_course({ payload, token })).unwrap();

      setEditingCourseId(null);

      setTimeout(() => {
        toast.success("Course Edited Successfully", {
          position: "top-right",
          autoClose: 2000,
          theme: isDarkMode ? "dark" : "light",
        });
      }, 100);

      await dispatch(
        fetchCoursesByName({
          token,
          course_name: searchquery,
          course_type: queryto,
          status: querystatus,
          page: currentPage,
          limit: CoursePerPage,
        })
      );
    } catch (error) {
      setEditingCourseId(null);

      setTimeout(() => {
        toast.error(
          error?.error?.[0]?.message ||
            error?.message ||
            "Failed To Update Course",
          {
            position: "top-right",
            autoClose: 2000,
            theme: isDarkMode ? "dark" : "light",
          }
        );
      }, 100);

      await dispatch(
        fetchCoursesByName({
          token,
          course_name: searchquery,
          course_type: queryto,
          status: querystatus,
          page: currentPage,
          limit: CoursePerPage,
        })
      );
    }
  };

  const onSubmit = async (data) => {
    const batchPayload = {
      course_id: Number(data.course_id),
      BatchesName: data.batchName,
      StartTime: `${data.starttime}:00`,
      EndTime: `${data.endtime}:00`,
    };

    try {
      await dispatch(
        CoursebyAdd_Batches({ batchData: batchPayload, token })
      ).unwrap();

      batchForm.reset();
      toast.success("Batch Added Successfully", {
        position: "top-right",
        autoClose: 5000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setAddBatches(false);
      dispatch(fetchBatchesByCourseId({ courseId: selectedCourseid, token }));
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add batch";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      console.error("Error adding batch:", error);
    }
  };

  useEffect(() => {
    if (AddBatches && selectedCourseid) {
      batchForm.setValue("course_id", selectedCourseid.toString());
      setAddBatch((prev) => ({
        ...prev,
        course_id: selectedCourseid.toString(),
      }));
    }
  }, [AddBatches, selectedCourseid, batchForm]);

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 min-h-screen">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick={false}
            pauseOnHover
            draggable
            theme={isDarkMode ? "dark" : "light"}
            transition={Zoom}
          />
          <div
            className="mb-6 w-full gap-5
                flex flex-col              /* < lg: stacked blocks        */
                xl:grid xl:grid-cols-5"
          >
            <div className="flex gap-3 flex-wrap xl:col-span-2">
              <Button
                onClick={back}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-md"
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to Academics</span>
              </Button>

              <Button
                onClick={() => setAddCourses(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-md"
              >
                <span className="text-lg">+</span>
                <span>Add Course</span>
              </Button>
            </div>
            <div className="flex flex-col gap-5 xl:flex-row xl:gap-3 xl:col-span-3">
              <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="By Course Name..."
                  className="ml-2 w-full outline-none bg-transparent text-sm"
                  value={searchquery}
                  onChange={(e) => setsearchquery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <Select
                onValueChange={setQueryTo}
                value={queryto}
                className="w-full"
              >
                <SelectTrigger className="border-blue-300 text-sm py-1.5 px-2 rounded-md w-full">
                  <SelectValue placeholder="By Course Type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={setQuerystatus}
                value={querystatus}
                className="w-full"
              >
                <SelectTrigger className="border-blue-300 text-sm py-1.5 px-2 rounded-md w-full">
                  <SelectValue placeholder="By Course Status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <Dot className="text-green-700" /> Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <Dot className="text-red-700" /> InActive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Dialog open={AddCourses} onOpenChange={setAddCourses}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-2xl"
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold">
                  Add New Course
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddCourse)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="course_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course name (e.g. BCA, MBA)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded p-2 bg-white text-black dark:bg-black dark:text-white"
                          >
                            <option value="">--Select Type--</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Months</SelectItem>
                              <SelectItem value="6">6 Months</SelectItem>
                              <SelectItem value="12">1 Year</SelectItem>
                              <SelectItem value="24">2 Years</SelectItem>
                              <SelectItem value="36">3 Years</SelectItem>
                              <SelectItem value="48">4 Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter course price (e.g. 350000)"
                            value={formattedPrice}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              if (!/^\d*$/.test(rawValue)) return;

                              const formattedValue = new Intl.NumberFormat(
                                "en-IN"
                              ).format(Number(rawValue));

                              setFormattedPrice(formattedValue);
                              field.onChange(rawValue);
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter discount price (e.g. 1000.50)"
                            {...field}
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded p-2 bg-white text-black dark:bg-black dark:text-white"
                          >
                            <option value="">--Select Status--</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5"
                    >
                      Confirm
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {loading ? (
            <div className="h-screen flex items-center justify-center text-white">
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
            <div className="mt-8 rounded-lg text-center text-xl p-4 text-red-800">
              <span>
                {error?.error?.length > 0
                  ? error?.error[0]?.message
                  : error?.message || "No Course Found"}
              </span>
              <strong>
                <No_data_found />
              </strong>
            </div>
          ) : courseData?.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
              <No_data_found />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {selectedCourse?.map((card) => (
                <Card
                  key={card.id}
                  className="relative w-full max-w-xs sm:max-w-sm mx-auto shadow-md rounded-xl dark:border-2 dark:shadow-blue-500/30"
                  style={{ padding: "0px!important" }}
                >
                  <CardHeader className="px-2 py-1 pt-2 border-b pb-2">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          card.course_type === "online"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-green-100 text-green-700 border-green-300"
                        }`}
                      >
                        {card.course_type?.charAt(0).toUpperCase() +
                          card.course_type?.slice(1)}
                      </Badge>
                      {card?.status === "inactive" ? (
                        <p>
                          <Dot className="text-red-700" />
                        </p>
                      ) : (
                        <Dot className="text-green-700" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    className="px-2 pt-2 border-b"
                    title={card.course_name}
                  >
                    <span className="block text-base font-medium truncate max-w-[180px] sm:max-w-[250px] md:max-w-[210px]">
                      {card.course_name}
                    </span>
                  </CardContent>

                  <CardFooter className="flex items-center flex-col sm:flex-row [@media(min-width:768px)]:flex-col md:flex-row gap-4 px-2 pb-3 pt-3">
                    <div className="flex flex-col-2 gap-3 w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-blue-600 text-white hover:bg-blue-500 transition duration-200 ease-in-out"
                            onClick={() => setSelectedCourseid(card.id)}
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl"
                          onPointerDownOutside={(e) => e.preventDefault()}
                          onEscapeKeyDown={(e) => e.preventDefault()}
                        >
                          {card.status === "active" && (
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 mt-5">
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-500 text-sm px-4 py-2 flex items-center gap-2 transition duration-200"
                                onClick={() => setEditingCourseId(card.id)}
                              >
                                <Pencil className="w-4 h-4" /> Edit Course
                              </Button>
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-500 text-sm px-4 py-2 flex items-center gap-2 transition duration-200"
                                onClick={() => setAddBatches(true)}
                              >
                                <Plus className="w-4 h-4" /> Add Batch
                              </Button>
                              <Dialog
                                open={AddBatches}
                                onOpenChange={setAddBatches}
                              >
                                <DialogContent
                                  onPointerDownOutside={(e) =>
                                    e.preventDefault()
                                  }
                                  onEscapeKeyDown={(e) => e.preventDefault()}
                                  className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto shadow-lg p-6 rounded-lg"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-center text-xl font-semibold">
                                      Add Batch
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Form {...batchForm}>
                                    <form
                                      onSubmit={batchForm.handleSubmit(
                                        onSubmit
                                      )}
                                      className="space-y-6"
                                    >
                                      <FormField
                                        control={batchForm.control}
                                        name="batchName"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Batch Name</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Enter Batch Name"
                                                {...field}
                                                onChange={(e) => {
                                                  field.onChange(e);
                                                  setAddBatch({
                                                    ...addBatch,
                                                    BatchesName: e.target.value,
                                                  });
                                                }}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={batchForm.control}
                                        name="course_id"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Course Name</FormLabel>
                                            <FormControl>
                                              <Input
                                                readOnly
                                                value={
                                                  coursess?.data?.find(
                                                    (c) =>
                                                      c.id ===
                                                      Number(selectedCourseid)
                                                  )?.course_name ||
                                                  card.course_name
                                                }
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="flex items-center gap-4">
                                        <FormField
                                          control={batchForm.control}
                                          name="starttime"
                                          render={({ field }) => (
                                            <FormItem className="w-full">
                                              <FormLabel>Start Time</FormLabel>
                                              <FormControl>
                                                <Input
                                                  className=" dark:text-white dark:[color-scheme:dark]"
                                                  type="time"
                                                  {...field}
                                                  ref={startTimeRef}
                                                  onFocus={() =>
                                                    startTimeRef.current?.focus()
                                                  }
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                    setAddBatch({
                                                      ...addBatch,
                                                      StartTime: e.target.value,
                                                    });
                                                  }}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={batchForm.control}
                                          name="endtime"
                                          render={({ field }) => (
                                            <FormItem className="w-full">
                                              <FormLabel>End Time</FormLabel>
                                              <FormControl>
                                                <Input
                                                  className=" dark:text-white dark:[color-scheme:dark]"
                                                  type="time"
                                                  {...field}
                                                  ref={endTimeRef}
                                                  onFocus={() =>
                                                    endTimeRef.current?.focus()
                                                  }
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                    setAddBatch({
                                                      ...addBatch,
                                                      EndTime: e.target.value,
                                                    });
                                                  }}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                                      >
                                        Confirm
                                      </Button>
                                    </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}

                          {editingCourseId === card.id ? (
                            <div className="mb-6">
                              <input
                                type="text"
                                value={
                                  editedCourseNames[card.id] ?? card.course_name
                                }
                                onChange={(e) =>
                                  setEditedCourseNames((prev) => ({
                                    ...prev,
                                    [card.id]: e.target.value,
                                  }))
                                }
                                className="border px-4 py-3 rounded-md w-full bg-transparent mb-4 shadow-sm"
                              />
                              <div className="flex gap-3">
                                <Button
                                  className="bg-blue-600 hover:bg-blue-500 text-white transition duration-200"
                                  onClick={async () => {
                                    const updatedName =
                                      editedCourseNames[card.id];
                                    if (!updatedName?.trim()) return;

                                    await handleCourseUpdate(
                                      card.id,
                                      updatedName
                                    );
                                  }}
                                >
                                  Submit
                                </Button>

                                <Button
                                  variant="outline"
                                  className="text-gray-500 border-gray-400"
                                  onClick={() => setEditingCourseId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <h2
                              className="text-xl font-semibold text-gray-800 dark:text-white block whitespace-normal break-words"
                              title={
                                editedCourseNames[card.id] ?? card.course_name
                              }
                            >
                              Course:{" "}
                              {editedCourseNames[card.id] ?? card.course_name}
                            </h2>
                          )}
                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-6">
                            <div className="text-lg font-medium text-gray-700 dark:text-white">
                              Total Subject:{" "}
                              {batches?.data?.subjectCount ?? "N/A"}
                            </div>
                            <div className="text-lg font-medium text-gray-700 text-end dark:text-white">
                              <Button
                                onClick={() => handleViewSubjects(card.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Subjects
                              </Button>
                              <Dialog
                                open={opensubjectdialog}
                                onOpenChange={setopensubjectdialog}
                              >
                                <DialogContent
                                  onPointerDownOutside={(e) =>
                                    e.preventDefault()
                                  }
                                  onEscapeKeyDown={(e) => e.preventDefault()}
                                  className="max-h-[80vh] overflow-y-auto max-w-2xl"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-semibold">
                                      Subjects
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-muted-foreground">
                                      {loading ? (
                                        "Loading subjects..."
                                      ) : error ? (
                                        `Error: ${error}`
                                      ) : (
                                        <>
                                          Subjects associated with the course:{" "}
                                          <span className="text-blue-600 font-semibold">
                                            {card.course_name || "N/A"}
                                          </span>
                                        </>
                                      )}
                                    </DialogDescription>
                                  </DialogHeader>

                                  {!loading && !error && (
                                    <div className="mt-6 space-y-4">
                                      {subjectCourses?.data?.length > 0 ? (
                                        <>
                                          <p className="text-sm text-muted-foreground">
                                            Total Subjects:{" "}
                                            {subjectCourses.data.length}
                                          </p>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {subjectCourses.data.map(
                                              (subject, index) => (
                                                <Link
                                                  key={index}
                                                  to={`/Subjects/${subject?.subject_id}`}
                                                  className="block rounded-xl border bg-card p-4 shadow-sm transition dark:shadow-blue-500/50 shadow-gray-500/40 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                  <p className="text-base font-medium text-primary">
                                                    {subject?.Subject
                                                      ?.subject_name || "N/A"}
                                                  </p>
                                                </Link>
                                              )
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-center text-sm text-muted-foreground">
                                          No data found
                                        </p>
                                      )}

                                      <div className="flex justify-end pt-4">
                                        <DialogClose>
                                          <Button variant="outline">
                                            Close
                                          </Button>
                                        </DialogClose>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-6">
                            <div className="text-lg font-medium text-gray-700 dark:text-white">
                              Duration:{" "}
                              {card.course_duration
                                ? (() => {
                                    const years = Math.floor(
                                      card.course_duration / 12
                                    );
                                    const months = card.course_duration % 12;
                                    return (
                                      `${
                                        years > 0
                                          ? `${years} year${
                                              years > 1 ? "s" : ""
                                            } `
                                          : ""
                                      }${
                                        months > 0
                                          ? `${months} month${
                                              months > 1 ? "s" : ""
                                            }`
                                          : ""
                                      }`.trim() || "0 months"
                                    );
                                  })()
                                : "N/A"}
                            </div>

                            <div className="text-lg font-medium text-gray-700 text-end dark:text-white">
                              Price: ₹{card.course_price ?? "N/A"}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="text-lg font-medium text-gray-700 dark:text-white">
                              Mode: {card.course_type}
                            </div>
                            <div className="text-right text-lg font-medium text-gray-700 dark:text-white">
                              Batches: {batches?.data?.batches?.length ?? 0}
                            </div>
                          </div>
                          <div className="w-full max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                            <table className="min-w-[700px] w-full text-sm">
                              <thead className="bg-blue-100 text-gray-700 sticky top-0 z-10">
                                <tr>
                                  <th className="text-left p-3 whitespace-nowrap">
                                    Batch ID
                                  </th>
                                  <th className="text-left p-3 whitespace-nowrap">
                                    Batch Name
                                  </th>
                                  <th className="text-left p-3 whitespace-nowrap">
                                    Start Time
                                  </th>
                                  <th className="text-left p-3 whitespace-nowrap">
                                    End Time
                                  </th>
                                  <th className="text-left p-3 whitespace-nowrap">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {batches?.data?.batches?.length > 0 ? (
                                  batches.data.batches.map((batch, index) => (
                                    <tr
                                      key={batch.id}
                                      className="border-t hover:bg-blue-50 dark:hover:bg-gray-900 transition duration-150"
                                    >
                                      <td
                                        className="p-3 whitespace-nowrap"
                                        style={{ maxWidth: "50px" }}
                                        title={index + 1}
                                      >
                                        {index + 1}
                                      </td>
                                      <td
                                        className="p-3 whitespace-nowrap"
                                        style={{
                                          maxWidth: "150px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={batch.BatchesName}
                                      >
                                        {batch.BatchesName}
                                      </td>
                                      <td
                                        className="p-3 whitespace-nowrap"
                                        style={{
                                          maxWidth: "120px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={batch.StartTime}
                                      >
                                        {batch.StartTime}{" "}
                                        {/* Fixed: Changed from EndTime to StartTime */}
                                      </td>
                                      <td
                                        className="p-3 whitespace-nowrap"
                                        style={{
                                          maxWidth: "120px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                        title={batch.EndTime}
                                      >
                                        {batch.EndTime}
                                      </td>
                                      <td
                                        className="whitespace-nowrap pe-4"
                                        style={{ width: "80px" }}
                                      >
                                        <Viewdetail
                                          batchid={batch.id}
                                          cn={batch.Course.course_name}
                                          courseid={batch.course_id}
                                          s={batch.StartTime}
                                          e={batch.EndTime}
                                          n={batch.BatchesName}
                                          a={batch.status}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      className="text-center p-3 text-gray-500"
                                    >
                                      No Data Found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {card.status === "active" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="w-full bg-red-600 text-white hover:bg-red-500 transition duration-200"
                            >
                              <Trash className="w-4 h-4" />
                              Deactivate
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            onPointerDownOutside={(e) => e.preventDefault()}
                            onEscapeKeyDown={(e) => e.preventDefault()}
                            className="sm:max-w-md rounded-2xl"
                          >
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold">
                                Deactivate Course
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to Deactivate the course{" "}
                                <strong>{card.course_name}</strong>? This action
                                cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 mt-4">
                              <DialogClose>
                                <Button
                                  variant="outline"
                                  className="text-gray-600 hover:text-gray-500"
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button
                                onClick={() => handleDeleteCourse(card.id)}
                                className="bg-red-600 hover:bg-red-500 text-white"
                              >
                                Deactivate Course
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-green-600 text-white hover:bg-green-500 transition duration-200">
                              Activate
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            onPointerDownOutside={(e) => e.preventDefault()}
                            onEscapeKeyDown={(e) => e.preventDefault()}
                            className="sm:max-w-md rounded-2xl"
                          >
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold">
                                Activate Course
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to activate the course{" "}
                                <strong>{card.course_name}</strong>? It will be
                                visible to users.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 mt-4">
                              <Button
                                variant="outline"
                                className="text-gray-600 hover:text-gray-500"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleActivateCourse(card.id)}
                                className="bg-green-600 hover:bg-green-500 text-white"
                              >
                                Confirm Activate
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <Pagination>
            <PaginationContent className="mt-6">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
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
                    setCurrentPage(
                      Math.min(pagination?.totalPages || 1, currentPage + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Courses;
