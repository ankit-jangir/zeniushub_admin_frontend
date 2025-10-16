import { Label } from "../../src/components/ui/label";
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Header from "../Dashboard/Header";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { PlusIcon, ChevronRight, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Badge } from "../../src/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../src/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../src/components/ui/dropdown-menu";
import { ScrollArea } from "../../src/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  AddLeads,
  changeAssignLeads,
  changestatusLeads,
  getAllAssignto,
  searchLeads,
  ConverttoStudent,
} from "../../../Redux_store/Api/LeadsApi";
import { createCategory } from "../../../Redux_store/Api/CategoryApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import { setSession } from "../../../Redux_store/slices/SessionSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { getBatchbycourseid } from "../../../Redux_store/Api/Employesassinedtask";
import { useNavigate } from "react-router";

const formSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  batchId: z.string().min(1, "Batch is required"),
  adhar_no: z
    .string()
    .regex(/^\d+$/, "Only numbers allowed")
    .length(12, "Aadhaar must be exactly 12 digits"),
  gender: z.string().min(1, "Gender is required"),
  father_name: z.string().min(1, "Father's name is required"),
  mother_name: z.string().min(1, "Mother's name is required"),
  dob: z.string().min(1, "DOB is required"),
});

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
  assign_to: z.coerce.number({ message: "Assign To must be a number" }),
  status: z.string().min(1, "Status is required"),
  session_id: z.string().optional(),
});

const Leads = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  const isDarkMode = true;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [getName, setName] = useState("");
  const [getStatus, setMyStatus] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedLeadsId, setSelectedLeadsId] = useState("");
  const [Employee, setEmployee] = useState("Please Select");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [leadModalStatus, setLeadModalStatus] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [department, setDepartment] = useState("");
  const [addLeadData, setLeadData] = useState({
    name: "",
    email: "",
    phone_number: "",
    assign_to: "",
    status: "",
    session_id: "",
  });

  const {
    data: leads = [],
    loading,
    error,
    assignToList,
    studentData,
    loading: convertLoading,
    error: convertError,
  } = useSelector((state) => state.Leads || {});
  const mydata = useSelector((state) => state.Leads.leads || {});

  const { categories } = useSelector((state) => state.Category || {});
  const { Session } = useSelector((state) => state?.session);
  const sessionID = useSelector((state) => state.session?.selectedSession);

  const courses = useSelector(
    (state) => state.acad_courses?.course?.data || []
  );
  const { getBatch, loading: batchLoading } = useSelector(
    (state) => state.getBatch || {}
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      contact: "",
      assign_to: "",
      status: "",
      session_id: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      batchId: "",
      adhar_no: "",
      gender: "",
      father_name: "",
      mother_name: "",
      dob: "",
    },
  });

  useEffect(() => {
    if (token) {
      dispatch(getAllAssignto(token));
      dispatch(get_course(token));
    }
  }, [dispatch.token]);

  useEffect(() => {
    if (sessionID != null) {
      dispatch(
        searchLeads({
          sessionId: {
            name: getName,
            session_id: sessionID,
            status: getStatus,
            assign_to: assignTo,
            page: currentPage,
            limit: 10,
          },
          token,
        })
      );
    }
  }, [dispatch, sessionID, currentPage, getName, getStatus, assignTo]);

  useEffect(() => {
    if (Session && Session.length > 0) {
      const options = Session.map((s) => ({
        label: s.session_year,
        value: s.id,
      }));
      setSessionOptions(options);
      const defaultSession = Session.find((s) => s.is_default === true);
      if (defaultSession && !selectedOption) {
        setSelectedOption(defaultSession.id);
        dispatch(setSession(defaultSession.id));
      }
    }
  }, [Session, selectedOption, dispatch]);

  useEffect(() => {
    const syncAutofill = () => {
      const fields = ["name", "email", "address", "contact"];
      fields.forEach((fieldName) => {
        const input = document.querySelector(`input[(name="${fieldName}")]`);
        if (input?.value && !form.getValues(fieldName)) {
          form.setValue(fieldName, input.value);
          setLeadData((prev) => ({
            ...prev,
            [fieldName]: input.value,
          }));
        }
      });
    };

    const timer = setTimeout(syncAutofill, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    if (mydata?.data) {
      setCurrentPage(Number(mydata.currentPage));
      setTotalPages(mydata.totalPages);
    }
  }, [mydata]);

  useEffect(() => {
    setValue("batchId", selectedBatchId);
  }, [selectedBatchId, setValue]);

  const data = [
    { name: "Hot Leads", value: mydata?.hotCount || 0 },
    { name: "Converted Leads", value: mydata?.convertedCount || 0 },
    { name: "Inconversation Leads", value: mydata?.inconservationCount || 0 },
    { name: "Droped Leads", value: mydata?.droppedCount || 0 },
  ];

  const onValidCategorySubmit = async (data) => {
    const payload = {
      ...data,
      phone_number: data.contact,
      session_id: data.session_id || sessionID,
    };
    delete payload.contact;

    try {
      const response = await dispatch(AddLeads({ payload, token })).unwrap();
      toast.success("Lead added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      setLeadModalStatus(false);
      form.reset();
      dispatch(
        searchLeads({
          sessionId: {
            name: getName,
            session_id: sessionID,
            status: getStatus,
            assign_to: assignTo,
            page: currentPage,
            limit: 10,
          },
          token,
        })
      );
    } catch (err) {
      console.error("Error adding lead:", err);
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleSubmit2 = async (id, setOpen) => {
    if (!department || !id) {
      toast.error("Please select a status.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }

    const statusMap = {
      Hot: "Hot",
      Converted: "Converted",
      Inconservation: "Inconservation",
      Droped: "Droped",
    };

    const mappedStatus = statusMap[department];

    if (!mappedStatus) {
      toast.error("Invalid status selected.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }

    try {
      const response = await dispatch(
        changestatusLeads({ id, status: mappedStatus, token })
      ).unwrap();
      toast.success("Status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      setOpen(false);
      setDepartment("");
      dispatch(
        searchLeads({
          sessionId: {
            name: getName,
            session_id: sessionID,
            status: getStatus,
            assign_to: assignTo,
            page: currentPage,
            limit: 10,
          },
          token,
        })
      );
    } catch (err) {
      console.error("changestatusLeads error:", err);
      toast.error("Failed to update status.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleAssign = async () => {
    if (!Employee || Employee === "Please Select") {
      toast.error("Please select an employee", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }

    try {
      const resultAction = await dispatch(
        changeAssignLeads({ id: selectedLeadsId, assign_to: Employee, token })
      );
      if (changeAssignLeads.fulfilled.match(resultAction)) {
        toast.success("Lead assigned successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        setOpen(false);
        setEmployee("Please Select");
        setSelectedLeadsId("");
        dispatch(
          searchLeads({
            sessionId: {
              name: getName,
              session_id: sessionID,
              status: getStatus,
              assign_to: assignTo,
              page: currentPage,
              limit: 10,
            },
            token,
          })
        );
      } else {
        throw new Error(resultAction.payload || "Assignment failed");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedLeadsId) {
      toast.error("No lead selected for conversion.", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      return;
    }

    const formattedData = {
      ...data,
      dob: data.dob
        ? new Date(data.dob)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .split("/")
          .join("/")
        : data.dob,
    };

    const payload = {
      leadsId: selectedLeadsId,
      ...formattedData,
    };

    try {
      const resultAction = await dispatch(ConverttoStudent({ payload, token }));
      if (ConverttoStudent.fulfilled.match(resultAction)) {
        toast.success("Lead converted to student successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        setOpen2(false);
        reset({
          courseId: "",
          batchId: "",
          adhar_no: "",
          gender: "",
          father_name: "",
          mother_name: "",
          dob: "",
        });
        setSelectedBatchId("");
        dispatch(
          searchLeads({
            sessionId: {
              name: getName,
              session_id: sessionID,
              status: getStatus,
              assign_to: assignTo,
              page: currentPage,
              limit: 10,
            },
            token,
          })
        );
      } else {
        throw new Error(resultAction.payload || "Failed to convert lead");
      }
    } catch (err) {
      toast.error(err.message || "Failed to convert lead to student", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const newArray2 = assignToList?.map((value) => ({
    label: value?.first_name,
    value: value.id,
  }));

  // Find the selected employee's name for display in the dropdown
  const selectedEmployeeName =
    newArray2?.find((emp) => emp.value.toString() === assignTo)?.label ||
    "Select Employees";

  return (
    <>
      <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <ScrollArea className="w-full overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 w-full">
              {/* Main Pie Chart Card */}
              <Card className="col-span-1 lg:col-span-2 w-full flex-shrink-0 flex flex-col items-center p-4 pb-9 dark:shadow-sm dark:shadow-blue-600/50">
                <div className="flex-1 w-full">
                  <CardTitle className="text-center font-semibold pt-5">
                    Highest Source of Lead Generation
                  </CardTitle>
                  <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold pt-5">
                      Total Leads: {mydata?.totalLeads}
                    </CardTitle>
                  </CardHeader>
                </div>
                <div className="h-20 w-40 pt-5 flex justify-center items-center">
                  <PieChart width={120} height={120}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      innerRadius={20}
                      dataKey="value"
                      label={false}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </Card>

              {/* Stats Cards */}
              <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {[
                  {
                    title: "Hot leads",
                    value: mydata?.hotCount,
                    change: "+5",
                    up: true,
                  },
                  {
                    title: "Converted leads",
                    value: mydata?.convertedCount,
                    change: "-2",
                    up: false,
                  },
                  {
                    title: "Inconversation leads",
                    value: mydata?.inconservationCount,
                    change: "+8",
                    up: true,
                  },
                  {
                    title: "Droped leads",
                    value: mydata?.droppedCount,
                    change: "-3",
                    up: false,
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="w-full p-4 rounded-lg shadow-md dark:shadow-sm dark:shadow-blue-600/50"
                  >
                    <CardContent className="flex flex-col items-center pt-4 text-center">
                      <span className="text-sm">{stat.title}</span>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 rounded-lg shadow-md max-w-8xl mx-auto w-full">
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
            <div className="flex flex-wrap justify-between gap-2 mb-4 w-full">
              <input
                type="text"
                name="search"
                placeholder="Search Name"
                value={getName}
                onChange={(e) => {
                  setName(e.target.value);
                  setCurrentPage(1); // Reset to first page
                  dispatch(
                    searchLeads({
                      sessionId: {
                        name: e.target.value, // Use updated value
                        session_id: sessionID,
                        status: getStatus,
                        assign_to: assignTo,
                        page: 1, // Set page to 1
                        limit: 10,
                      },
                      token,
                    })
                  );
                }}
                className="p-2 border rounded-md bg-white text-black placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {getStatus || "Select Status"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Hot", "Inconservation", "Converted", "Droped"].map(
                    (status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => {
                          setMyStatus(status);
                          setCurrentPage(1); // Reset to first page
                          dispatch(
                            searchLeads({
                              sessionId: {
                                name: getName,
                                session_id: sessionID,
                                status: status, // Use updated status
                                assign_to: assignTo,
                                page: 1, // Set page to 1
                                limit: 10,
                              },
                              token,
                            })
                          );
                        }}
                      >
                        {status}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 font-medium"
                  >
                    {selectedEmployeeName}
                    <ChevronDown className="w-6 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 max-h-[200px] overflow-y-auto no-scrollbar scrollbar-hide">
                  <DropdownMenuItem
                    onClick={() => {
                      setAssignTo("");
                      setCurrentPage(1); // Reset to first page
                      dispatch(
                        searchLeads({
                          sessionId: {
                            name: getName,
                            session_id: sessionID,
                            status: getStatus,
                            assign_to: "",
                            page: 1, // Set page to 1
                            limit: 10,
                          },
                          token,
                        })
                      );
                    }}
                  >
                    All Employees
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {newArray2?.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => {
                        setAssignTo(item.value.toString());
                        setCurrentPage(1); // Reset to first page
                        dispatch(
                          searchLeads({
                            sessionId: {
                              name: getName,
                              session_id: sessionID,
                              status: getStatus,
                              assign_to: item.value.toString(),
                              page: 1, // Set page to 1
                              limit: 10,
                            },
                            token,
                          })
                        );
                      }}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="default"
                className="bg-blue-900 hover:bg-blue-800"
                onClick={() => {
                  const resetQuery = {
                    name: "",
                    status: "",
                    assign_to: "",
                    page: 1, // Set page to 1
                    limit: 10,
                  };
                  setName("");
                  setMyStatus("");
                  setAssignTo("");
                  setCurrentPage(1); // Reset to first page
                  dispatch(
                    searchLeads({ ...resetQuery, session_id: sessionID, token })
                  );
                }}
              >
                Clear
              </Button>

              <Dialog open={leadModalStatus} onOpenChange={setLeadModalStatus}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-500 text-white">
                    <PlusIcon className="mr-1" /> Add Leads
                  </Button>
                </DialogTrigger>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-2xl rounded-xl p-6 max-h-[100vh] overflow-y-auto"
                >
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">
                      Add Leads
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(
                        onValidCategorySubmit,
                        (errors) => console.log("Validation Errors:", errors)
                      )}
                      className="space-y-4"
                    >
                      <div className="pr-2 space-y-4">
                        {[
                          {
                            name: "name",
                            label: "Name",
                            placeholder: "Enter name",
                            type: "text",
                          },
                          {
                            name: "email",
                            label: "Email",
                            placeholder: "Enter email",
                            type: "text",
                          },
                          {
                            name: "address",
                            label: "Address",
                            placeholder: "Enter address",
                            type: "text",
                          },
                          {
                            name: "session_id",
                            label: "Session",
                            type: "select",
                            options: sessionOptions,
                          },
                          {
                            name: "contact",
                            label: "Contact",
                            placeholder: "Enter contact",
                            type: "numberOnly",
                          },
                          {
                            name: "assign_to",
                            label: "Assign To",
                            type: "select",
                            options: newArray2,
                          },
                          {
                            name: "status",
                            label: "Status",
                            type: "select",
                            options: [
                              { label: "Hot", value: "Hot" },
                              { label: "Droped", value: "Droped" },
                              {
                                label: "Inconservation",
                                value: "Inconservation",
                              },
                            ],
                          },
                        ].map(({ name, label, placeholder, type, options }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            rules={
                              name === "contact"
                                ? {
                                  required: "Contact is required",
                                  pattern: {
                                    value: /^[0-9]{10}$/,
                                    message:
                                      "Contact must be exactly 10 digits",
                                  },
                                }
                                : {}
                            }
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  {type === "select" ? (
                                    <select
                                      {...field}
                                      value={field.value || ""}
                                      onChange={(e) => {
                                        field.onChange(
                                          name === "assign_to" ||
                                            name === "category_id"
                                            ? Number(e.target.value)
                                            : e.target.value
                                        );
                                        setLeadData((prev) => ({
                                          ...prev,
                                          [name]:
                                            name === "assign_to" ||
                                              name === "category_id"
                                              ? Number(e.target.value)
                                              : e.target.value,
                                        }));
                                      }}
                                      className="w-full border rounded p-2 bg-white text-black dark:bg-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">-- Select --</option>
                                      {options?.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : type === "numberOnly" ? (
                                    <Input
                                      {...field}
                                      type="text"
                                      inputMode="numeric"
                                      placeholder={placeholder}
                                      maxLength={10}
                                      onInput={(e) => {
                                        e.target.value = e.target.value
                                          .replace(/[^0-9]/g, "")
                                          .slice(0, 10);
                                        field.onChange(e); // keep RHF in sync
                                        setLeadData((prev) => ({
                                          ...prev,
                                          [name]: e.target.value,
                                        }));
                                      }}
                                      className="w-full border rounded p-2 bg-white text-black dark:bg-black dark:text-white"
                                      autoComplete={name}
                                    />
                                  ) : (
                                    <Input
                                      {...field}
                                      placeholder={placeholder}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setLeadData((prev) => ({
                                          ...prev,
                                          [name]: e.target.value,
                                        }));
                                      }}
                                      className="w-full border rounded p-2 bg-white text-black dark:bg-black dark:text-white"
                                      autoComplete={name}
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button type="submit">Submit</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            {/* <div className="w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table className="w-full">
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-10">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Employes</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(mydata?.data) &&
                      mydata?.data?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item?.name}</TableCell>
                          <TableCell
                            className="truncate max-w-[60px]"
                            title={item || "N/A"}
                          >
                            {item?.address}
                          </TableCell>
                          <TableCell>{item?.email}</TableCell>
                          <TableCell>{item?.phone_number}</TableCell>
                          <TableCell>
                            <Badge
                              className={`capitalize w-28 justify-center text-white ${
                                item?.status === "Hot"
                                  ? "bg-[rgb(26,255,129)] text-black"
                                  : // rgb(34, 255, 129)
                                  item?.status === "Droped"
                                  ? "bg-[rgb(255,72,44)]"
                                  : item?.status === "Inconservation"
                                  ? "bg-[rgb(234,227,8)] text-black"
                                  : "bg-gray-300 text-black"
                              }`}
                            >
                              {item?.status || "N/A"}
                            </Badge>
                          </TableCell>

                          <TableCell
                            className="truncate max-w-[60px]"
                            title={item?.first_name || "N/A"}
                          >
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() =>
                                item?.id &&
                                navigate(
                                  ` /employee/view-profile/${item?.assign_to}`
                                )
                              }
                              aria-label={`View profile of ${
                                item?.first_name || "employee"
                              }`}
                            >
                              {item?.Employee?.first_name || "N/A"}
                            </button>
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <ChevronRight size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Dialog
                                    open={statusModalOpen}
                                    onOpenChange={setStatusModalOpen}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        Change Status
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[725px]">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Change Status of Lead
                                        </DialogTitle>
                                      </DialogHeader>
                                      <select
                                        className="border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                        value={department}
                                        onChange={(e) =>
                                          setDepartment(e.target.value)
                                        }
                                      >
                                        <option value="">
                                          -- Select Status --
                                        </option>
                                        <option value="Hot">Hot</option>
                                        <option value="Converted">
                                          Converted
                                        </option>
                                        <option value="Inconservation">
                                          Inconservation
                                        </option>
                                        <option value="Droped">Droped</option>
                                      </select>
                                      <DialogFooter>
                                        <Button
                                          className="mt-4"
                                          onClick={() =>
                                            handleSubmit2(
                                              item.id,
                                              setStatusModalOpen
                                            )
                                          }
                                        >
                                          Submit
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setSelectedLeadsId(item.id)
                                        }
                                      >
                                        Assign Leads
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[825px] bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-700">
                                      <DialogHeader>
                                        <DialogTitle className="text-gray-900 dark:text-white">
                                          Assign Lead
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="flex flex-col gap-3">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                          Select Employee
                                        </label>
                                        <select
                                          className="border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                          value={Employee}
                                          onChange={(e) =>
                                            setEmployee(e.target.value)
                                          }
                                        >
                                          <option value="Please Select">
                                            Select
                                          </option>
                                          {newArray2?.map((employee) => (
                                            <option
                                              key={employee.value}
                                              value={employee.value}
                                            >
                                              {employee.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          onClick={handleAssign}
                                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                        >
                                          Assign
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Dialog open={open2} onOpenChange={setOpen2}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setSelectedLeadsId(item.id)
                                        }
                                      >
                                        Convert to Student
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none">
                                      <Card className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900 dark:text-white">
                                        <DialogHeader>
                                          <DialogTitle className="text-xl font-semibold">
                                            Convert to Student
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={handleSubmit(onSubmit)}
                                          className="space-y-4 mt-4"
                                        >
                                          <div>
                                            <Label>Course</Label>
                                            <Select
                                              onValueChange={(value) => {
                                                setValue("courseId", value);
                                                dispatch(
                                                  getBatchbycourseid({
                                                    courseId: value,
                                                    token,
                                                  })
                                                );
                                                setSelectedBatchId("");
                                                setValue("batchId", "");
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select Course" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Array.isArray(courses) &&
                                                courses.length > 0 ? (
                                                  courses.map((item) => (
                                                    <SelectItem
                                                      key={item.id}
                                                      value={item.id.toString()}
                                                    >
                                                      {item.course_name}
                                                    </SelectItem>
                                                  ))
                                                ) : (
                                                  <p className="px-4 py-2 text-gray-500 text-sm">
                                                    No courses found
                                                  </p>
                                                )}
                                              </SelectContent>
                                            </Select>
                                            {errors.courseId && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.courseId.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Batch</Label>
                                            <Select
                                              onValueChange={(value) => {
                                                setSelectedBatchId(value);
                                                setValue("batchId", value);
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Batch" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {batchLoading ? (
                                                  <p className="text-sm text-muted-foreground px-4 py-2">
                                                    Loading batches...
                                                  </p>
                                                ) : !getBatch?.length ? (
                                                  <p className="text-sm text-muted-foreground px-4 py-2">
                                                    No batches found.
                                                  </p>
                                                ) : (
                                                  getBatch.map((batch) => (
                                                    <SelectItem
                                                      key={batch.id}
                                                      value={batch.id.toString()}
                                                    >
                                                      {batch.BatchesName} (
                                                      {
                                                        batch.Session
                                                          .session_year
                                                      }
                                                      )
                                                    </SelectItem>
                                                  ))
                                                )}
                                              </SelectContent>
                                            </Select>
                                            {errors.batchId && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.batchId.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Aadhaar No</Label>
                                            <Input
                                              type="text"
                                              inputMode="numeric"
                                              maxLength={12}
                                              placeholder="Enter Aadhaar Number"
                                              {...register("adhar_no", {
                                                required:
                                                  "Aadhaar number is required",
                                                pattern: {
                                                  value: /^[0-9]{12}$/,
                                                  message:
                                                    "Aadhaar must be 12 digits only",
                                                },
                                              })}
                                              onInput={(e) => {
                                                e.target.value = e.target.value
                                                  .replace(/[^0-9]/g, "")
                                                  .slice(0, 12);
                                              }}
                                            />
                                            {errors.adhar_no && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.adhar_no.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Gender</Label>
                                            <Select
                                              onValueChange={(value) =>
                                                setValue("gender", value)
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Male">
                                                  Male
                                                </SelectItem>
                                                <SelectItem value="Female">
                                                  Female
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            {errors.gender && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.gender.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Father's Name</Label>
                                            <Input
                                              type="text"
                                              {...register("father_name")}
                                              placeholder="Enter Father's Name"
                                            />
                                            {errors.father_name && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.father_name.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Mother's Name</Label>
                                            <Input
                                              type="text"
                                              {...register("mother_name")}
                                              placeholder="Enter Mother's Name"
                                            />
                                            {errors.mother_name && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.mother_name.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Date of Birth</Label>
                                            <Input
                                              type="date"
                                              {...register("dob")}
                                            />
                                            {errors.dob && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.dob.message}
                                              </p>
                                            )}
                                          </div>
                                          <DialogFooter className="mt-6">
                                            <Button
                                              type="submit"
                                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                              disabled={convertLoading}
                                            >
                                              {convertLoading
                                                ? "Converting..."
                                                : "Convert to Student"}
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </Card>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="pagination text-center mt-4">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  {currentPage} to {totalPages}
                </span>
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 ms-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div> */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table className="w-full border border-gray-300 dark:border-gray-600">
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-10">
                    <TableRow className="border-b border-gray-300 dark:border-gray-600">
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Name
                      </TableHead>
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Address
                      </TableHead>
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Email
                      </TableHead>
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Phone
                      </TableHead>
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Status
                      </TableHead>
                      <TableHead className="border-r border-gray-300 dark:border-gray-600">
                        Employes
                      </TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(mydata?.data) &&
                      mydata?.data?.map((item, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-gray-300 dark:border-gray-600"
                        >
                          <TableCell className="border-r border-gray-300 dark:border-gray-600">
                            {item?.name}
                          </TableCell>
                          <TableCell
                            className="truncate max-w-[60px] border-r border-gray-300 dark:border-gray-600"
                            title={item?.address || "N/A"} // Fixed: Use item?.address instead of item
                          >
                            {item?.address}
                          </TableCell>
                          <TableCell className="border-r border-gray-300 dark:border-gray-600">
                            {item?.email}
                          </TableCell>
                          <TableCell className="border-r border-gray-300 dark:border-gray-600">
                            {item?.phone_number}
                          </TableCell>
                          <TableCell className="border-r border-gray-300 dark:border-gray-600">
                            <Badge
                              className={`capitalize w-28 justify-center text-white ${item?.status === "Hot"
                                ? "bg-[rgb(26,255,129)] text-black"
                                : item?.status === "Droped"
                                  ? "bg-[rgb(255,72,44)]"
                                  : item?.status === "Inconservation"
                                    ? "bg-[rgb(234,227,8)] text-black"
                                    : "bg-gray-300 text-black"
                                }`}
                            >
                              {item?.status || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className="truncate max-w-[60px] border-r border-gray-300 dark:border-gray-600"
                            title={item?.first_name || "N/A"}
                          >
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() =>
                                item?.id &&
                                navigate(
                                  `/employee/view-profile/${item?.assign_to}`
                                )
                              }
                              aria-label={`View profile of ${item?.first_name || "employee"
                                }`}
                            >
                              {item?.Employee?.first_name || "N/A"}
                            </button>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <ChevronRight size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Dialog
                                    open={statusModalOpen}
                                    onOpenChange={setStatusModalOpen}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        Change Status
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[725px]">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Change Status of Lead
                                        </DialogTitle>
                                      </DialogHeader>
                                      <select
                                        className="border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                        value={department}
                                        onChange={(e) =>
                                          setDepartment(e.target.value)
                                        }
                                      >
                                        <option value="">
                                          -- Select Status --
                                        </option>
                                        <option value="Hot">Hot</option>
                                        <option value="Converted">
                                          Converted
                                        </option>
                                        <option value="Inconservation">
                                          Inconservation
                                        </option>
                                        <option value="Droped">Droped</option>
                                      </select>
                                      <DialogFooter>
                                        <Button
                                          className="mt-4"
                                          onClick={() =>
                                            handleSubmit2(
                                              item.id,
                                              setStatusModalOpen
                                            )
                                          }
                                        >
                                          Submit
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setSelectedLeadsId(item.id)
                                        }
                                      >
                                        Assign Leads
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[825px] bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-700">
                                      <DialogHeader>
                                        <DialogTitle className="text-gray-900 dark:text-white">
                                          Assign Lead
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="flex flex-col gap-3">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                          Select Employee
                                        </label>
                                        <select
                                          className="border rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                          value={Employee}
                                          onChange={(e) =>
                                            setEmployee(e.target.value)
                                          }
                                        >
                                          <option value="Please Select">
                                            Select
                                          </option>
                                          {newArray2?.map((employee) => (
                                            <option
                                              key={employee.value}
                                              value={employee.value}
                                            >
                                              {employee.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          onClick={handleAssign}
                                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                        >
                                          Assign
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Dialog open={open2} onOpenChange={setOpen2}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setSelectedLeadsId(item.id)
                                        }
                                      >
                                        Convert to Student
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none">
                                      <Card className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900 dark:text-white">
                                        <DialogHeader>
                                          <DialogTitle className="text-xl font-semibold">
                                            Convert to Student
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={handleSubmit(onSubmit)}
                                          className="space-y-4 mt-4"
                                        >
                                          <div>
                                            <Label>Course</Label>
                                            <Select
                                              onValueChange={(value) => {
                                                setValue("courseId", value);
                                                dispatch(
                                                  getBatchbycourseid({
                                                    courseId: value,
                                                    token,
                                                  })
                                                );
                                                setSelectedBatchId("");
                                                setValue("batchId", "");
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select Course" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Array.isArray(courses) &&
                                                  courses.length > 0 ? (
                                                  courses.map((item) => (
                                                    <SelectItem
                                                      key={item.id}
                                                      value={item.id.toString()}
                                                    >
                                                      {item.course_name}
                                                    </SelectItem>
                                                  ))
                                                ) : (
                                                  <p className="px-4 py-2 text-gray-500 text-sm">
                                                    No courses found
                                                  </p>
                                                )}
                                              </SelectContent>
                                            </Select>
                                            {errors.courseId && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.courseId.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Batch</Label>
                                            <Select
                                              onValueChange={(value) => {
                                                setSelectedBatchId(value);
                                                setValue("batchId", value);
                                              }}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Batch" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {batchLoading ? (
                                                  <p className="text-sm text-muted-foreground px-4 py-2">
                                                    Loading batches...
                                                  </p>
                                                ) : !getBatch?.length ? (
                                                  <p className="text-sm text-muted-foreground px-4 py-2">
                                                    No batches found.
                                                  </p>
                                                ) : (
                                                  getBatch.map((batch) => (
                                                    <SelectItem
                                                      key={batch.id}
                                                      value={batch.id.toString()}
                                                    >
                                                      {batch.BatchesName}
                                                    </SelectItem>
                                                  ))
                                                )}
                                              </SelectContent>
                                            </Select>
                                            {errors.batchId && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.batchId.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Aadhaar No</Label>
                                            <Input
                                              type="text"
                                              inputMode="numeric"
                                              maxLength={12}
                                              placeholder="Enter Aadhaar Number"
                                              {...register("adhar_no", {
                                                required:
                                                  "Aadhaar number is required",
                                                pattern: {
                                                  value: /^[0-9]{12}$/,
                                                  message:
                                                    "Aadhaar must be 12 digits only",
                                                },
                                              })}
                                              onInput={(e) => {
                                                e.target.value = e.target.value
                                                  .replace(/[^0-9]/g, "")
                                                  .slice(0, 12);
                                              }}
                                            />
                                            {errors.adhar_no && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.adhar_no.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Gender</Label>
                                            <Select
                                              onValueChange={(value) =>
                                                setValue("gender", value)
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Male">
                                                  Male
                                                </SelectItem>
                                                <SelectItem value="Female">
                                                  Female
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            {errors.gender && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.gender.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Father's Name</Label>
                                            <Input
                                              type="text"
                                              {...register("father_name")}
                                              placeholder="Enter Father's Name"
                                            />
                                            {errors.father_name && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.father_name.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Mother's Name</Label>
                                            <Input
                                              type="text"
                                              {...register("mother_name")}
                                              placeholder="Enter Mother's Name"
                                            />
                                            {errors.mother_name && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.mother_name.message}
                                              </p>
                                            )}
                                          </div>
                                          <div>
                                            <Label>Date of Birth</Label>
                                            <Input
                                              type="date"
                                              {...register("dob")}
                                            />
                                            {errors.dob && (
                                              <p className="text-red-500 text-sm mt-1">
                                                {errors.dob.message}
                                              </p>
                                            )}
                                          </div>
                                          <DialogFooter className="mt-6">
                                            <Button
                                              type="submit"
                                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                              disabled={convertLoading}
                                            >
                                              {convertLoading
                                                ? "Converting..."
                                                : "Convert to Student"}
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </Card>
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="pagination text-center mt-4">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  {currentPage} to {totalPages}
                </span>
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 ms-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Leads;
