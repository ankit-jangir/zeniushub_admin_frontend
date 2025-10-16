import React, { useEffect, useRef, useState } from "react";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import { Button } from "../../../src/components/ui/button";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Trash,
  CheckCircleIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../../src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../src/components/ui/form";
import { Input } from "../../../src/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import Viewdetail from "./batch/Viewdetail";
import Update_time from "./batch/Update_time";
import Migrate from "./batch/Migrate";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../src/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  Add_Batches,
  deleteBatch,
  get_Batches,
  search_Batches,
} from "../../../../Redux_store/Api/Batches";
import { get_course } from "../../../../Redux_store/Api/Academic_course";
import { getSessions } from "../../../../Redux_store/Api/SessionApi";
import Header from "../../Dashboard/Header";
import { useNavigate } from "react-router";
import logo from "../../../../assets/Image/intellix.png";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Lottie from "lottie-react";
import nodata from "../../../../assets/video/no_data_found.json";
import No_data_found from "../../No_data_found";

const batchSchema = z
  .object({
    batchName: z.string().trim().min(1, "Batch name is required"),
    course_id: z.string().trim().min(1, { message: "Course is required" }),
    starttime: z.string().trim().min(1, { message: "Start time is required" }),
    endtime: z.string().trim().min(1, { message: "End time is required" }),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.starttime || !data.endtime) return true;
      return data.endtime > data.starttime;
    },
    {
      message: "End time must be after start time",
      path: ["endtime"],
    }
  );

const Batches = () => {
  const [AddBatches, setAddBatches] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [querystatus, setQuerystatus] = useState("active");
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  console.log(token, "**************token");

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

  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      course_id: "",
      starttime: "",
      endtime: "",
    },
  });
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isDarkMode = true;
  const [openDialogs, setOpenDialogs] = useState({});

  const toggleDialog = (id) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const limit = 16;
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    dispatch(
      get_Batches({
        token,
        searchTerm: searchTerm || "",
        page: currentPage,
        querystatus: querystatus || "",
        limit,
      })
    );
  }, [searchTerm, dispatch, querystatus, currentPage, limit]);

  const { Batches, loading, error } = useSelector((s) => s.Batch);
  const { course: courses = { data: [] } } = useSelector(
    (state) => state.courses
  );
  const { Session } = useSelector((state) => state.session || {});
  const BatchesData = Batches?.data || [];
  const paginationInfo = Batches;
  const BachesPerPage = paginationInfo.limit || 16;
  const totalBatches = BatchesData.length;
  const totalPages = Math.ceil(totalBatches / BachesPerPage);
  const selectedBatches = BatchesData;

  const onSubmit = async (data) => {
    const batchPayload = {
      course_id: Number(data.course_id),
      BatchesName: data.batchName,
      StartTime: `${data.starttime}:00`,
      EndTime: `${data.endtime}:00`,
    };

    try {
      await dispatch(Add_Batches({ data: batchPayload, token })).unwrap();

      toast.success("Batch Added Successfully", {
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
      setAddBatches(false);
      dispatch(
        get_Batches({
          token,
          searchTerm: searchTerm || "",
          page: currentPage,
          querystatus: querystatus || "",
          limit,
        })
      );
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add batch. Please try again.";
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
    }
  };

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch]);
  const navigate = useNavigate();
  const back = () => navigate("/Academics");

  const handleDelete = async (id, currentStatus) => {
    try {
      const response = await dispatch(deleteBatch({ id, token })).unwrap();
      const actionMessage =
        currentStatus === "active" ? "deactivated" : "activated";

      toast.success(`Batch ${actionMessage} successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      await dispatch(
        get_Batches({
          token,
          searchTerm: searchTerm || "",
          page: currentPage,
          querystatus: querystatus || "",
          limit,
        })
      ).unwrap();
    } catch (error) {
      const errorMessage =
        error?.error?.[0]?.message ||
        error?.message ||
        `Failed to ${currentStatus === "active" ? "deactivate" : "activate"
        } batch. Please try again.`;

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
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

  const formatTo12Hour = (timeStr) => {
    const today = new Date();
    const [hours, minutes] = timeStr.split(":");
    today.setHours(Number(hours), Number(minutes), 0);

    const time = today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return time.replace("AM", "am").replace("PM", "pm");
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
            transition={Zoom}
            limit={3}
          />
          <div
            className="w-full rounded-lg shadow-md shadow-blue-300/30
             px-4 sm:px-8 py-4 gap-5
             flex flex-col             
             xl:grid xl:grid-cols-2"
          >
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <Button
                className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                onClick={back}
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to Academics</span>
              </Button>

              <Button
                onClick={() => setAddBatches(true)}
                className="bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>Add Batches</span>
              </Button>

              <Dialog open={AddBatches} onOpenChange={setAddBatches}>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto overflow-x-hidden shadow-lg p-6 rounded-lg"
                >
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                      Add Batch
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name="course_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setAddBatch({
                                    ...addBatch,
                                    course_id: value,
                                  });
                                }}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors box-border">
                                  <SelectValue
                                    placeholder="Select a Course"
                                    className="truncate"
                                  />
                                </SelectTrigger>
                                <SelectContent
                                  position="popper"
                                  className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto"
                                >
                                  <SelectGroup>
                                    <SelectLabel>Courses</SelectLabel>
                                    {courses?.data?.map((course) => (
                                      <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                      >
                                        {course.course_name ||
                                          `Course ${course.id}`}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="starttime"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input
                                  className="dark:text-white dark:[color-scheme:dark]"
                                  type="time"
                                  {...field}
                                  ref={startTimeRef}
                                  onFocus={() => startTimeRef.current?.focus()}
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
                          control={form.control}
                          name="endtime"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input
                                  className="dark:text-white dark:[color-scheme:dark]"
                                  type="time"
                                  {...field}
                                  ref={endTimeRef}
                                  onFocus={() => endTimeRef.current?.focus()}
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

            <div
              className="flex flex-col gap-4       
               xl:flex-row xl:gap-8         
               xl:justify-end"
            >
              <Select
                onValueChange={(value) => setQuerystatus(value)}
                value={querystatus}
                className="w-full sm:w-40"
              >
                <SelectTrigger className="w-full border-blue-300 text-sm py-4 px-2 rounded-md">
                  <SelectValue placeholder="By Course Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="active"
                    className="flex items-center justify-between"
                  >
                    Active{" "}
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-6" />
                  </SelectItem>
                  <SelectItem
                    value="inactive"
                    className="flex items-center justify-between"
                  >
                    InActive{" "}
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-3" />
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full sm:max-w-md">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="By Batch Name..."
                  className="ml-2 w-full outline-none bg-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {selectedBatches?.length === 0 ? (
            <div className="flex justify-center items-center h-[30em]">
              <No_data_found />
            </div>
          ) : (
            <div className="grid gap-6 p-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {selectedBatches.map((pass, index) => (
                <Card
                  key={index}
                  className="rounded-2xl border-2 bg-background text-foreground shadow-md dark:shadow-blue-500/30"
                >
                  <CardHeader className="px-5 py-4 border-b rounded-t-2xl">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${pass.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                            }`}
                          title={
                            pass.status === "active" ? "Active" : "Inactive"
                          }
                        />
                        <CardTitle
                          className="text-md font-semibold tracking-wide w-[100px] truncate whitespace-nowrap"
                          title={pass.BatchesName}
                        >
                          {pass.BatchesName}
                        </CardTitle>
                      </div>

                      <Dialog
                        open={openDialogs[pass.id] || false}
                        onOpenChange={() => toggleDialog(pass.id)}
                      >
                        <DialogTrigger asChild>
                          {pass.status === "inactive" ? (
                            <Button className="bg-green-600 text-white hover:bg-green-400 p-2 rounded-full">
                              <CheckCircleIcon className="w-5 h-5" />
                              Activate
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              className="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white"
                            >
                              <span className="hidden lg:inline">Delete</span>
                              <Trash className="w-5 h-5 text-white-600" />
                            </Button>
                          )}
                        </DialogTrigger>

                        <DialogContent
                          onPointerDownOutside={(e) => e.preventDefault()}
                          onEscapeKeyDown={(e) => e.preventDefault()}
                          className="sm:max-w-md rounded-2xl"
                        >
                          <DialogHeader>
                            <DialogTitle
                              className={
                                pass.status === "active"
                                  ? "text-destructive"
                                  : "text-primary"
                              }
                            >
                              {pass.status === "active"
                                ? "Deactivate Batch"
                                : "Activate Batch"}
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to{" "}
                              {pass.status === "active"
                                ? "deactivate"
                                : "activate"}{" "}
                              the batch{" "}
                              <strong
                                className={
                                  pass.status === "active"
                                    ? "text-primary"
                                    : "text-destructive"
                                }
                              >
                                {pass.BatchesName}
                              </strong>
                              ? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex justify-end gap-2 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => toggleDialog(pass.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => {
                                handleDelete(pass.id, pass.status);
                                toggleDialog(pass.id);
                              }}
                            >
                              {pass.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-2 px-6 py-4 border-b mb-3">
                    <Viewdetail
                      batchid={pass.id}
                      cn={pass.Course.course_name}
                      courseid={pass.course_id}
                      s={pass.StartTime}
                      e={pass.EndTime}
                      n={pass.BatchesName}
                      a={pass.status}
                    />

                    {pass.status === "active" ? (
                      <Update_time
                        id={pass.id}
                        s={pass.StartTime}
                        e={pass.EndTime}
                      />
                    ) : null}
                  </CardContent>

                  <CardContent className="grid grid-cols-2 md:grid-cols-2 gap-y-4 gap-x-8 px-3 pt-2 pb-6 ">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Start Time
                      </span>
                      <span className="inline-block w-fit px-3 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-sm font-semibold shadow-sm">
                        {formatTo12Hour(pass.StartTime)}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        End Time
                      </span>
                      <span className="inline-block w-fit px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-sm font-semibold shadow-sm">
                        {formatTo12Hour(pass.EndTime)}
                      </span>
                    </div>
                  </CardContent>
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
                />
              </PaginationItem>

              {Array.from({ length: paginationInfo?.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(i + 1)}
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
                  href="#"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Batches;
