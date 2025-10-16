import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../src/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Separator } from "../../src/components/ui/separator";
import { Button } from "../../src/components/ui/button";
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  Book,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Layers,
  PlusIcon,
  Trash,
} from "lucide-react";
import {
  FaRegUser,
  FaClipboard,
  FaAlignLeft,
  FaRegCalendarAlt,
} from "react-icons/fa";
import {
  addTask,
  get_assigned_task,
  getoneemployee,
  updateEmployee,
} from "../../../Redux_store/Api/TeamApi";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Header from "../Dashboard/Header";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import { Badge } from "../../src/components/ui/badge";
import moment from "moment/moment";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { Checkbox } from "../../src/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  assignSubjectsToEmployee,
  deleteEmployeeAssignment,
  fetchCoursesBySubject,
  getBatchbycourseid,
  getEmployeeBatchSubject,
} from "../../../Redux_store/Api/Employesassinedtask";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../src/components/ui/popover";
import { ScrollArea } from "../../src/components/ui/scroll-area";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { get_Deparment } from "../../../Redux_store/Api/Department";
import { Label } from "../../src/components/ui/label";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "../../src/components/ui/command";
import { fetchSessions } from "../../../Redux_store/Api/SessionApi";
import Swal from "sweetalert2";

const img_url = "https://adminv2-api-dev.intellix360.in";

const ViewProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [cityFullName, setCityFullName] = useState("");

  const handleCityClick = () => {
    setCityFullName(profile?.permanent_district || "");
    setShowModal(true);
  };

  const { Department } = useSelector((state) => state.Department || []);

  const isDarkMode = true;
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [fileName, setFileName] = useState("");
  const { updateSuccess, message } = useSelector((state) => state.team);
  const base_img_url = "https://adminv2-api-dev.intellix360.in/";
  const { assign } = useSelector((state) => state.getBatch);
  const emp_batches = assign?.employeeBatchSubject[0]?.emp_batches || [];
  const emp_subjects = assign?.employeeBatchSubject[0]?.emp_subjs || [];

  const profile = useSelector(
    (state) => state.team?.profile?.getSingleEmployee
  );
  const [formData, setFormData] = useState({
    image_path: null,
    first_name: "",
    highest_qualification: "",
    institution_name: "",
    contact_number: "",
    emergency_number: "",
    email: "",
    date_of_birth: "",
    residential_address: "",
    district: "",
    state: "",
    status: "",
    start_time: "",
    end_time: "",
    pincode: "",
    permanent_address: "",
    permanent_district: "",
    permanent_state: "",
    permanent_pincode: "",
    salary: "",
    joining_date: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: "",
    fcm_key: null,
    socket_id: null,
    department: [],
  });

  const { Session, loading: sessionsLoading } = useSelector(
    (state) => state.session || {}
  );

  const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z
      .string({
        required_error: "Due date is required",
        invalid_type_error: "Due date must be a string",
      })
      .min(1, "Due date is required")
      .nullable()
      .refine((val) => val !== null && val.trim() !== "", {
        message: "Due date is required",
      }),
    file: z
      .any()
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          const file = files[0];
          return (
            file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
          );
        },
        {
          message: "File must be a PDF and less than 5MB",
        }
      ),
  });

  const {
    register: taskRegister,
    handleSubmit: handleTaskSubmit,
    setValue: setTaskValue,
    watch: watchTask,
    reset: resetTaskForm,
    formState: { errors: taskErrors },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });
  const selectedFile = watchTask("file");

  // Initializing formData from profile
  useEffect(() => {
    if (profile) {
      setSelected(profile.department);
      setSelectedImage(
        profile.image_path
          ? `${img_url}/viewimagefromazure?filePath=${profile.image_path}`
          : null
      );
      setFormData({
        image_path: profile.image_path || null,
        first_name: profile.first_name || "",
        highest_qualification: profile.highest_qualification || "",
        institution_name: profile.institution_name || "",
        contact_number: profile.contact_number || "",
        emergency_number: profile.emergency_number || "",
        email: profile.email || "",
        salary: profile.salary || "",
        joining_date: profile.joining_date || "",
        permanent_address: profile.permanent_address || "",
        district: profile.district || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        account_number: profile.account_number || "",
        ifsc_code: profile.ifsc_code || "",
        account_holder_name: profile.account_holder_name || "",
        residential_address: profile.residential_address || "",
        permanent_district: profile.permanent_district || "",
        permanent_state: profile.permanent_state || "",
        permanent_pincode: profile.permanent_pincode || "",
        start_time: profile.start_time
          ? moment(profile.start_time, ["HH:mm:ss", "HH:mm"]).format("HH:mm")
          : "",
        end_time: profile.end_time
          ? moment(profile.end_time, ["HH:mm:ss", "HH:mm"]).format("HH:mm")
          : "",
        department: profile.department,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_time" || name === "end_time") {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (value && !timeRegex.test(value)) {
        toast.error(`${name} HH:MM फॉर्मेट में होना चाहिए (उदाहरण: 14:30)`, {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (updateSuccess) {
      toast({
        title: "Employee updated successfully!",
        description: message,
      });
    }
  }, [updateSuccess, message, dispatch]);

  const tasks = useSelector(
    (state) => state.team?.tasks?.employeeTasks?.[0]?.EmployeeTasks || []
  );
  const { error } = useSelector((state) => state.getBatch);

  const handleAssign = () => {
    const payload = {
      subjectId: selectedSubjectIds,
      course_id: selectedCourseId,
      batch_id: selectedBatchIds,
      session_Id: selectedSessionId,
      employeeId: parseInt(id),
    };
    dispatch(assignSubjectsToEmployee({ payload, token }))
      .unwrap()
      .then(() => {
        toast.success("Assign successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        setShowEmployeeModal(false);
        dispatch(getEmployeeBatchSubject({ id, token }));
        setSelectedSubjectIds([]);
        setSelectedCourseId(null);
        setSelectedBatchIds([]);
      })
      .catch((error) => {
        console.error("Assign failed:", error);
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
      });
  };

  // API calls based on active tab
  useEffect(() => {
    if (id && activeTab === "profile") {
      dispatch(getoneemployee({ id, token }));
    }
  }, [dispatch, id, token, activeTab]);

  useEffect(() => {
    if (id && activeTab === "tasks") {
      console.log("inn", id);
      dispatch(get_assigned_task({ id, token }));
    }
  }, [dispatch, id, token, activeTab]);

  useEffect(() => {
    if (activeTab === "Courses") {
      dispatch(get_course(token));
      if (id) dispatch(getEmployeeBatchSubject({ id, token }));
    }
  }, [dispatch, id, activeTab]);

  const goBack = () => window.history.back();

  const goToSalaryPage = () => {
    navigate(`/manage_salary/${id}`);
  };

  const data = useSelector((state) => state.courses);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Sirf JPEG ya PNG images allowed hain!");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size 2MB se kam hona chahiye!");
        e.target.value = "";
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image_path: file,
      }));
    }
  };

  const employeeData = new FormData();
  Object.keys(formData).forEach((key) => {
    if (key === "image_path" && formData.image_path instanceof File) {
      employeeData.append("image_path", formData.image_path);
    } else if (key === "department") {
      selected.forEach((deptId, index) => {
        employeeData.append(`department[${index}]`, deptId);
      });
    } else if (formData[key] !== null && formData[key] !== "") {
      employeeData.append(key, formData[key]);
    }
  });

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch]);

  const { loading } = useSelector((state) => state.getBatch);
  const getBatch = useSelector((state) => state.getBatch?.getBatch);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const subjectCourses = useSelector((state) => state.getBatch?.subjectCourses);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const toggleBatchSelection = (id) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  const toggleSubjectSelection = (id) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  const selectedNames = getBatch
    ?.filter((batch) => selectedBatchIds.includes(batch.id))
    .map((batch) => batch.BatchesName)
    .join(", ");

  const selectedNames2 = subjectCourses?.data
    ?.filter((subject) => selectedSubjectIds.includes(subject.subject_id))
    .map((subject) => subject.Subject?.subject_name)
    .join(", ");

  const handleDelete = (ids, options) => {
    let dispatchPromise;

    if (options === "subject_id") {
      dispatchPromise = dispatch(
        deleteEmployeeAssignment({
          employee_id: id,
          token,
          subject_id: ids,
        })
      );
    } else {
      dispatchPromise = dispatch(
        deleteEmployeeAssignment({
          employee_id: id,
          token,
          batch_id: ids,
        })
      );
    }

    dispatchPromise
      .unwrap()
      .then(() => {
        toast.success("Delete successfully!", {
          position: "top-right",
          autoClose: 5000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        dispatch(getEmployeeBatchSubject({ id, token }));
      })
      .catch((error) => {
        console.error("Deletion failed:", error);
      });
  };

  useEffect(() => {
    dispatch(get_Deparment({ searchName: "", token }));
  }, [dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error && error !== "Employee not found") {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  }, [error]);

  const imageUrl = profile?.image_path
    ? `${base_img_url}viewimagefromazure?filePath=${profile?.image_path}`
    : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg";

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
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
            limit={1} // एक समय में सिर्फ एक टोस्टर
            preventDuplicate={true}
          />
          <Button
            onClick={goBack}
            className="mb-4 bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 rounded-lg border border-gray-200 sticky top-4 z-20 bg-white/90 dark:bg-gray-800/90">
              <TabsTrigger
                value="profile"
                className="flex items-center justify-center gap-1 transition-colors duration-200 text-base font-medium py-2 px-4 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <span>👤</span> Profile
              </TabsTrigger>
              {profile?.status === "Inactive" ? null : (
                <>
                  <TabsTrigger
                    value="tasks"
                    className="flex items-center justify-center gap-1 transition-colors duration-200 text-base font-medium py-2 px-4 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <span>📝</span> Assigned Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="Edit"
                    className="flex items-center justify-center gap-1 transition-colors duration-200 text-base font-medium py-2 px-4 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <span>✏️</span> Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="Courses"
                    className="flex items-center justify-center gap-1 transition-colors duration-200 text-base font-medium py-2 px-4 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <span>📝</span> Assign Courses
                  </TabsTrigger>
                </>
              )}
              <TabsTrigger
                value="salary"
                onClick={goToSalaryPage}
                className="flex items-center justify-center gap-1 transition-colors duration-200 text-base font-medium py-2 px-4 rounded-md hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <span>💵</span> Salary
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-4">
              <Card className="rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-500 p-6 flex flex-col sm:flex-row items-center rounded-t-2xl">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Avatar
                        className="w-24 h-24 ring-4 ring-white shadow-lg cursor-pointer"
                        onClick={() => setIsOpen(true)}
                      >
                        <AvatarImage src={imageUrl} alt="profile" />
                        <AvatarFallback>👤</AvatarFallback>
                      </Avatar>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-white/80 dark:bg-black/50 shadow-none border-none max-w-[90vw] sm:max-w-[80vw] md:max-w-[600px]">
                      <img
                        src={imageUrl}
                        alt="profile large"
                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                  <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-white text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-wide truncate overflow-hidden whitespace-nowrap max-w-[80vw] sm:max-w-[400px]">
                      {profile?.first_name}
                    </h2>
                    {profile?.departments?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {profile?.departments?.map((dep, index) => (
                          <p
                            key={index}
                            className="text-sm sm:text-md opacity-90 truncate max-w-[150px] cursor-pointer transition-colors duration-150"
                            onClick={() =>
                              Swal.fire({
                                title: "Department Name",
                                html: `<p class="text-md text-gray-700 break-words">${dep?.name || "No Department"
                                  }</p>`,
                                confirmButtonText: "Close",
                                confirmButtonColor: "#2563eb",
                                customClass: {
                                  popup: "rounded-xl shadow-2xl max-w-md p-6",
                                  title: "text-xl font-bold text-gray-900 mb-3",
                                  htmlContainer: "text-md text-gray-700",
                                  confirmButton:
                                    "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200",
                                },
                                background: "#f9fafb",
                                backdrop: "rgba(0, 0, 0, 0.6)",
                                showClass: {
                                  popup:
                                    "animate__animated animate__fadeIn animate__faster",
                                },
                                hideClass: {
                                  popup:
                                    "animate__animated animate__fadeOut animate__faster",
                                },
                              })
                            }
                            title="Click to view full name"
                          >
                            {dep?.name || "No Department"}
                            {index < profile.departments.length - 1 && " ,"}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-md opacity-90">
                        No Department
                      </p>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6 space-y-8">
                  <ProfileSection
                    title="👤 Personal Information"
                    items={[
                      {
                        label: "Joining Date",
                        value: formatDate(profile?.joining_date),
                      },
                      {
                        label: "DOB",
                        value: formatDate(profile?.date_of_birth),
                      },
                      { label: "Contact", value: profile?.contact_number },
                      { label: "Email", value: profile?.email },
                      {
                        label: "Start Time",
                        value: formatTime(profile?.start_time),
                      },
                      {
                        label: "End Time",
                        value: formatTime(profile?.end_time),
                      },
                    ]}
                  />
                  <ProfileSection
                    title="🎓 Education"
                    items={[
                      {
                        label: "Qualification",
                        value: profile?.highest_qualification,
                      },
                    ]}
                  />
                  <ProfileSection
                    title="🏠 Address"
                    items={[
                      { label: "State", value: profile?.permanent_state },
                      {
                        label: "City",
                        value: (
                          <span
                            onClick={handleCityClick}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {profile?.permanent_district?.length > 12
                              ? profile.permanent_district.slice(0, 12) + "..."
                              : profile?.permanent_district}
                          </span>
                        ),
                      },
                      { label: "Zip", value: profile?.permanent_pincode },
                      { label: "Address", value: profile?.permanent_address },
                    ]}
                  />

                  {showModal && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker backdrop
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                      onClick={() => setShowModal(false)}
                    >
                      <div
                        style={{
                          background: "#ffffff",
                          padding: "20px",
                          borderRadius: "10px",
                          width: "100%",
                          maxWidth: "320px", // Fixed max-width for consistency
                          minWidth: "240px", // Adjusted min-width for smaller screens
                          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)", // Softer shadow
                          color: "#000000",
                          animation: "slideIn 0.2s ease-out", // Subtle slide-in animation
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3
                          style={{
                            color: "#000000",
                            marginBottom: "12px",
                            fontSize: "1.25em",
                            fontWeight: "600",
                            textAlign: "center", // Centered title
                          }}
                        >
                          Full City Name
                        </h3>
                        <p
                          style={{
                            color: "#000000",
                            marginBottom: "20px",
                            fontSize: "1em",
                            lineHeight: "1.5",
                            wordBreak: "break-word", // Handle long city names
                            textAlign: "center", // Centered text
                          }}
                        >
                          {cityFullName}
                        </p>
                        <button
                          onClick={() => setShowModal(false)}
                          style={{
                            background: "#1a73e8",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontSize: "0.9em",
                            fontWeight: "500",
                            width: "100%", // Full-width button for consistency
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background = "#1557b0")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "#1a73e8")
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                  <ProfileSection
                    title="🏦 Bank Info"
                    items={[
                      { label: "Account No.", value: profile?.account_number },
                      { label: "IFSC", value: profile?.ifsc_code },
                      {
                        label: "Holder Name",
                        value: profile?.account_holder_name,
                      },
                      { label: "Salary", value: profile?.salary },
                    ]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {profile?.status === "Active" ? (
              <>
                {/* Tasks Tab */}
                <TabsContent value="tasks" className="mt-6">
                  <Card className="p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                      <h2 className="text-lg sm:text-xl font-bold text-center text-blue-700">
                        📋 Assigned Tasks
                      </h2>
                      <Dialog
                        open={isTaskDialogOpen}
                        onOpenChange={setIsTaskDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold shadow-md"
                            onClick={() => setIsTaskDialogOpen(true)}
                          >
                            + Assign Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          onPointerDownOutside={(e) => e.preventDefault()}
                          onEscapeKeyDown={(e) => e.preventDefault()}
                          className="max-w-[95vw] sm:max-w-[500px] rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                        >
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                              Assign Task
                            </DialogTitle>
                            <p className="text-md sm:text-lg mt-1 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <FaRegUser /> Employee:{" "}
                              {profile?.first_name || "Loading..."}
                            </p>
                          </DialogHeader>
                          <form
                            onSubmit={handleTaskSubmit(async (data) => {
                              const token = localStorage.getItem("token");
                              const formData = new FormData();
                              const formattedDueDate = data.dueDate
                                ? data.dueDate.replace("T", " ")
                                : "";
                              formData.append("task_tittle", data.title);
                              formData.append("description", data.description);
                              formData.append("due_date", formattedDueDate);
                              formData.append("employee_id", id);
                              if (data.file?.[0]) {
                                formData.append("attachments", data.file[0]);
                              }

                              try {
                                console.log("📦 FormData entries:");
                                for (let [key, value] of formData.entries()) {
                                  console.log(`${key}:`, value);
                                }
                                const resultAction = await dispatch(
                                  addTask({ formData, token })
                                ).unwrap();
                                toast.success("Task assigned successfully!", {
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
                                resetTaskForm();
                                setFileName("");
                                setIsTaskDialogOpen(false);
                                dispatch(get_assigned_task({ id, token }));
                              } catch (error) {
                                const errorMessage =
                                  error?.error?.length > 0
                                    ? error?.error?.[0]?.message
                                    : error?.message ||
                                    "Task submission failed";
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
                            })}
                            className="space-y-5 pt-2"
                          >
                            <div>
                              <Label
                                htmlFor="title"
                                className="flex items-center gap-2 text-md sm:text-lg font-medium text-gray-800 dark:text-gray-200"
                              >
                                <Book size={18} /> Task Title *
                              </Label>
                              <Input
                                id="title"
                                placeholder="Task Title"
                                maxLength={100}
                                {...taskRegister("title")}
                                className="w-full mt-1"
                              />
                              {taskErrors.title && (
                                <p className="text-red-500 text-sm">
                                  {taskErrors.title.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor="description"
                                className="flex items-center gap-2 text-md sm:text-lg font-medium text-gray-800 dark:text-gray-200"
                              >
                                <FileText size={18} /> Task Description *
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Task Description"
                                maxLength={250}
                                {...taskRegister("description")}
                                className="w-full mt-1 min-h-[100px]"
                              />
                              {taskErrors.description && (
                                <p className="text-red-500 text-sm">
                                  {taskErrors.description.message}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label
                                htmlFor="file-upload"
                                className="flex items-center gap-2 px-4 py-2 border rounded-md w-fit cursor-pointer bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200"
                              >
                                <ArrowUp size={18} /> Add Attachments
                              </Label>
                              <input
                                type="file"
                                id="file-upload"
                                accept="application/pdf"
                                className="hidden"
                                {...taskRegister("file", {
                                  onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.type !== "application/pdf") {
                                        toast.error(
                                          "Only PDF files are allowed."
                                        );
                                        e.target.value = "";
                                        setFileName("");
                                        return;
                                      }
                                      if (file.size > 5 * 1024 * 1024) {
                                        toast.error(
                                          "File size must be less than 5MB."
                                        );
                                        e.target.value = "";
                                        setFileName("");
                                        return;
                                      }
                                      setFileName(file.name);
                                    }
                                  },
                                })}
                              />
                              {fileName && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  📎 {fileName}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFileName("");
                                      document.getElementById(
                                        "file-upload"
                                      ).value = "";
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                              {taskErrors.file && (
                                <p className="text-red-500 text-sm">
                                  {taskErrors.file.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor="due-date"
                                className="text-md sm:text-lg font-medium text-gray-800 dark:text-gray-200"
                              >
                                Due Date
                              </Label>
                              <Input
                                id="due-date"
                                type="datetime-local"
                                {...taskRegister("dueDate")}
                                className="mt-1 w-full cursor-pointer"
                                onFocus={(e) => e.target.showPicker()}
                              />
                              {taskErrors.dueDate && (
                                <p className="text-red-500 text-sm">
                                  {taskErrors.dueDate.message}
                                </p>
                              )}
                            </div>
                            <div className="pt-2 text-center">
                              <Button
                                type="submit"
                                className="w-full sm:w-[250px] bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm"
                              >
                                Assign Task
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                      {tasks.length === 0 ? (
                        <p className="text-center text-gray-500">
                          No tasks assigned.
                        </p>
                      ) : (
                        tasks.map((task, index) => (
                          <div
                            key={task.id}
                            className="border border-blue-400 p-4 rounded-xl space-y-4 shadow-sm hover:shadow-md transition duration-200"
                          >
                            <h1 className="font-bold text-lg text-blue-800">
                              Task #{index + 1}
                            </h1>
                            <TaskDetail
                              icon={<FaClipboard />}
                              label="Title"
                              value={task.task_tittle}
                            />
                            <TaskDetail
                              icon={<FaAlignLeft />}
                              label="Description"
                              value={task.description}
                            />
                            {task?.attachments && (
                              <div>
                                <a
                                  href={`${img_url}/viewimagefromazure?filePath=${task.attachments}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline font-medium transition-all"
                                >
                                  📎 View Attachment
                                </a>
                              </div>
                            )}
                            <TaskDetail
                              icon={<FaRegCalendarAlt />}
                              label="Due"
                              value={formatDateTime(task.due_date)}
                            />
                            <TaskDetail
                              icon={<FaRegUser />}
                              label="Assigned By"
                              value={task?.Admin?.full_name || "N/A"}
                            />
                            <Badge
                              variant="outline"
                              className={`text-sm font-medium px-3 py-1 rounded-full ${task.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              Status: {task.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="Edit" className="mt-6 sm:mt-10">
                  <div className="w-full flex items-start justify-center px-4">
                    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-10 rounded-2xl shadow-2xl w-full max-w-5xl transition-all duration-300">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 sm:mb-10 text-center text-gray-900 dark:text-white tracking-tight">
                        Edit Employee
                      </h2>
                      <div className="flex justify-center">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                          <Avatar className="w-full h-full shadow-md rounded-full">
                            {selectedImage ? (
                              <AvatarImage
                                src={
                                  selectedImage ||
                                  (profile?.image_path
                                    ? `${img_url}/viewimagefromazure?filePath=${profile.image_path}`
                                    : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg")
                                }
                                onError={() => {
                                  toast.error(
                                    "Image load karne mein problem hui!"
                                  );
                                  setSelectedImage(null);
                                }}
                              />
                            ) : (
                              <AvatarFallback className="rounded-full">
                                CN
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                            onClick={handleFileInputClick}
                          >
                            <Camera className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                        <div className="flex flex-col">
                          <label
                            htmlFor="first_name"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Name
                          </label>
                          <input
                            id="first_name"
                            name="first_name"
                            placeholder="Name"
                            value={formData.first_name || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="highest_qualification"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Highest Qualification
                          </label>
                          <input
                            id="highest_qualification"
                            name="highest_qualification"
                            placeholder="Highest Qualification"
                            value={formData.highest_qualification || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="institution_name"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Institution Name
                          </label>
                          <input
                            id="institution_name"
                            name="institution_name"
                            placeholder="Institution Name"
                            value={formData.institution_name || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="contact_number"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Contact Number
                          </label>
                          <input
                            id="contact_number"
                            name="contact_number"
                            placeholder="Contact Number"
                            value={formData.contact_number || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="emergency_number"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Emergency Contact
                          </label>
                          <input
                            id="emergency_number"
                            name="emergency_number"
                            placeholder="Emergency Contact"
                            value={formData.emergency_number || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="salary"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            In-Hand Salary (Per Month)
                          </label>
                          <input
                            id="salary"
                            name="salary"
                            placeholder="Salary"
                            value={formData.salary || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="joining_date"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Joining Date
                          </label>
                          <input
                            id="joining_date"
                            name="joining_date"
                            placeholder="Joining Date"
                            value={formData.joining_date || ""}
                            readOnly
                            className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-white cursor-not-allowed"
                          />
                        </div>
                        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
                          <label
                            htmlFor="permanent_address"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Permanent Address
                          </label>
                          <textarea
                            id="permanent_address"
                            name="permanent_address"
                            placeholder="Permanent Address"
                            value={formData.permanent_address || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="district"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            District
                          </label>
                          <input
                            id="district"
                            name="district"
                            placeholder="District"
                            value={formData.district || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="state"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            State
                          </label>
                          <input
                            id="state"
                            name="state"
                            placeholder="State"
                            value={formData.state || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="pincode"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Pincode
                          </label>
                          <input
                            id="pincode"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="account_number"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Bank Account Number
                          </label>
                          <input
                            id="account_number"
                            name="account_number"
                            placeholder="Account Number"
                            value={formData.account_number || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="ifsc_code"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            IFSC Code
                          </label>
                          <input
                            id="ifsc_code"
                            name="ifsc_code"
                            placeholder="IFSC Code"
                            value={formData.ifsc_code || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="account_holder_name"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Account Holder Name
                          </label>
                          <input
                            id="account_holder_name"
                            name="account_holder_name"
                            placeholder="Account Holder Name"
                            value={formData.account_holder_name || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="start_time"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Start Time
                          </label>
                          <input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time || ""}
                            onChange={handleChange}
                            step="60"
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="end_time"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            End Time
                          </label>
                          <input
                            type="time"
                            id="end_time"
                            name="end_time"
                            value={formData.end_time || ""}
                            onChange={handleChange}
                            step="60"
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="residential_address"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Residential Address
                          </label>
                          <input
                            id="residential_address"
                            name="residential_address"
                            placeholder="Residential Address"
                            value={formData.residential_address || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="permanent_district"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Permanent District
                          </label>
                          <input
                            id="permanent_district"
                            name="permanent_district"
                            placeholder="Permanent District"
                            value={formData.permanent_district || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="permanent_state"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Permanent State
                          </label>
                          <input
                            id="permanent_state"
                            name="permanent_state"
                            placeholder="Permanent State"
                            value={formData.permanent_state || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="permanent_pincode"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Permanent Pincode
                          </label>
                          <input
                            id="permanent_pincode"
                            name="permanent_pincode"
                            placeholder="Permanent Pincode"
                            value={formData.permanent_pincode || ""}
                            onChange={handleChange}
                            className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
                          <label
                            htmlFor="department"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Department
                          </label>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                id="department"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-white text-left flex justify-between items-center"
                              >
                                <span>
                                  {selected.length > 0
                                    ? Department.filter((opt) =>
                                      selected.includes(opt.id)
                                    )
                                      .map((opt) => opt.name)
                                      .join(", ")
                                    : "Select Department"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-70" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full min-w-[200px] sm:min-w-[300px] p-0">
                              <Command>
                                <CommandGroup>
                                  {Department?.map((opt) => (
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
                                        {opt.name}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="flex justify-center mt-6 sm:mt-10">
                        <Button
                          onClick={async () => {
                            const updatedFormData = {
                              ...formData,
                              department: selected,
                              start_time: formData.start_time
                                ? moment(formData.start_time, [
                                  "HH:mm:ss",
                                  "HH:mm",
                                ]).format("HH:mm")
                                : "",
                              end_time: formData.end_time
                                ? moment(formData.end_time, [
                                  "HH:mm:ss",
                                  "HH:mm",
                                ]).format("HH:mm")
                                : "",
                            };
                            console.log(
                              "Updated FormData before API call:",
                              updatedFormData
                            );
                            try {
                              await dispatch(
                                updateEmployee({
                                  id: parseInt(id),
                                  employeeData: updatedFormData,
                                  token,
                                })
                              ).unwrap();
                              toast.success("Employee updated successfully", {
                                position: "top-right",
                                theme: isDarkMode ? "dark" : "light",
                                transition: Zoom,
                              });
                            } catch (error) {
                              if (
                                error?.errors &&
                                Array.isArray(error.errors)
                              ) {
                                const errorMessage = error.errors
                                  .filter(
                                    (e) => e.messages && e.messages.length > 0
                                  )
                                  .map(
                                    (e) =>
                                      `${e.field}: ${e.messages.join(", ")}`
                                  )
                                  .join("; ");
                                toast.error(errorMessage, {
                                  position: "top-right",
                                  theme: isDarkMode ? "dark" : "light",
                                  transition: Zoom,
                                });
                              } else {
                                const errorMessage =
                                  error?.error?.length > 0
                                    ? error?.error?.[0]?.message
                                    : error?.message ||
                                    "Something went wrong !";
                                toast.error(errorMessage, {
                                  position: "top-right",
                                  theme: isDarkMode ? "dark" : "light",
                                  transition: Zoom,
                                });
                              }
                            }
                          }}
                          disabled={loading}
                          className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-md"
                        >
                          {loading ? "Updating..." : "Update Employee"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="Courses" className="mt-6 sm:mt-10">
                  <div className="text-end mb-4 sm:mb-6">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowEmployeeModal(true);
                      }}
                      className="px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Assign
                      Course
                    </Button>
                  </div>
                  {emp_batches.length === 0 && emp_subjects.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm sm:text-base">
                      No courses assigned.
                    </p>
                  ) : (
                    <>
                      <h3 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 sm:h-6 sm:w-6" /> Batches
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                        {emp_batches.length === 0 ? (
                          <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">
                            No batches assigned.
                          </p>
                        ) : (
                          emp_batches.map((batch, index) => (
                            <Card
                              key={index}
                              className="shadow-md dark:shadow-md dark:shadow-blue-400/50 border box-border overflow-hidden max-w-full"
                            >
                              <CardHeader className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="max-w-[80%]">
                                    <CardTitle className="text-md sm:text-lg truncate">
                                      {batch?.Batch?.BatchesName || "N/A"}
                                    </CardTitle>
                                    <CardDescription
                                      className="text-xs sm:text-sm text-muted-foreground truncate"
                                      title={batch?.Batch?.Course?.course_name}
                                    >
                                      {batch?.Batch?.Course?.course_name ||
                                        "No Course"}
                                    </CardDescription>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                                    onClick={() =>
                                      handleDelete(batch?.batch_id, "batch_id")
                                    }
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="text-xs sm:text-sm p-3">
                                <p className="flex items-center gap-2 truncate">
                                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {batch?.Batch?.StartTime || "N/A"} -{" "}
                                    {batch?.Batch?.EndTime || "N/A"}
                                  </span>
                                </p>
                                <p className="flex items-center gap-2 mt-2 truncate">
                                  <BadgeCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="truncate">
                                    Status: {batch?.Batch?.status || "N/A"}
                                  </span>
                                </p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" /> Subjects
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                        {emp_subjects.length === 0 ? (
                          <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">
                            No subjects assigned.
                          </p>
                        ) : (
                          emp_subjects.map((subj, index) => (
                            <Card
                              key={index}
                              className="shadow-md dark:shadow-md dark:shadow-blue-400/50 border box-border overflow-hidden max-w-full"
                            >
                              <CardHeader className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="max-w-[80%]">
                                    <CardTitle className="text-md sm:text-lg truncate">
                                      {subj?.Subject?.subject_name || "N/A"}
                                    </CardTitle>
                                    <CardDescription
                                      className="text-xs sm:text-sm text-muted-foreground truncate"
                                      title={subj?.Course?.course_name}
                                    >
                                      {subj?.Course?.course_name || "No Course"}
                                    </CardDescription>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                                    onClick={() =>
                                      handleDelete(
                                        subj?.subject_id,
                                        "subject_id"
                                      )
                                    }
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="text-xs sm:text-sm p-3">
                                <p className="flex items-center gap-2 truncate">
                                  <BadgeCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="truncate">
                                    Status: {subj?.Subject?.status || "N/A"}
                                  </span>
                                </p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </>
                  )}



                  <Dialog
                    open={showEmployeeModal}
                    onOpenChange={setShowEmployeeModal}
                  >
                    <DialogContent className=" max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="mb-4 text-lg sm:text-xl">
                          📝 Assign Course
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <Select
                          onValueChange={(value) => {
                            if (!value) return;
                            setSelectedCourseId(value);
                            console.log(value, "courseId selected");
                            dispatch(
                              getBatchbycourseid({ courseId: value, token })
                            );
                            dispatch(fetchCoursesBySubject({ courseId: value, token }));
                            dispatch(fetchSessions(token));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.course?.data?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <span className="w-[400px] truncate block" title={item.course_name}>
                                  {item.course_name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) => {
                            setSelectedSessionId(value);
                            console.log(value, "selected session");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Session" />
                          </SelectTrigger>
                          <SelectContent>
                            {Session?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <span className="truncate">
                                  {item.session_year}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger className="w-full">
                            <span className="text-left w-[400px] truncate block " title={selectedBatchIds.length > 0
                              ? selectedNames.length > 30 // 30 chars se zyada hone par
                                ? `${selectedNames.slice(0, 30)}... (+${selectedBatchIds.length - 1
                                } more)`
                                : selectedNames
                              : "Choose Batches"}>


                              {selectedBatchIds.length > 0
                                ? selectedNames.length > 30 // 30 chars se zyada hone par
                                  ? `${selectedNames.slice(0, 30)}... (+${selectedBatchIds.length - 1
                                  } more)`
                                  : selectedNames
                                : "Choose Batches"}
                            </span>
                          </SelectTrigger>

                          <SelectContent>
                            <div className="max-h-60 overflow-y-auto px-2 py-1">
                              {loading ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Loading batches...
                                </p>
                              ) : error ? (
                                <p className="text-sm text-red-500 px-2 py-1">
                                  {error}
                                </p>
                              ) : getBatch?.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  No batch found for this course
                                </p>
                              ) : (
                                getBatch?.map((batch) => (
                                  <div
                                    key={batch.id}
                                    className="flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-muted rounded"
                                    onClick={() =>
                                      toggleBatchSelection(batch.id)
                                    }
                                  >
                                    <Checkbox
                                      checked={selectedBatchIds.includes(
                                        batch.id
                                      )}
                                    />
                                    <span className="text-sm w-[400px] truncate block" title={batch.BatchesName}  >
                                      {batch.BatchesName}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </SelectContent>
                        </Select>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start  truncate block" title={selectedSubjectIds.length > 0
                                ? selectedNames2
                                : "Choose Subjects"}
                            >
                              {selectedSubjectIds.length > 0
                                ? selectedNames2
                                : "Choose Subjects"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <ScrollArea
                              className={`w-full ${subjectCourses?.data?.length === 0
                                ? "h-20 pt-6 ps-3 pe-3"
                                : subjectCourses?.data?.length < 6
                                  ? "max-h-40 pt-4 ps-3 pe-3"
                                  : "h-60 pt-4 ps-3 pe-3"
                                }`}
                            >
                              <div className="px-2 py-1 w-full">
                                {loading ? (
                                  <p className="text-sm text-muted-foreground">
                                    Loading subjects...
                                  </p>
                                ) : subjectCourses?.data?.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No subject found for this course
                                  </p>
                                ) : (
                                  subjectCourses?.data?.map((subject) => (
                                    <div
                                      key={subject.id}
                                      className="flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-muted rounded w-full"
                                      onClick={() =>
                                        toggleSubjectSelection(
                                          subject.subject_id
                                        )
                                      }
                                    >
                                      <Checkbox
                                        checked={selectedSubjectIds.includes(
                                          subject.subject_id
                                        )}
                                      />
                                      <span className="text-sm w-[380px] truncate  block" title={subject?.Subject?.subject_name}
                                      >
                                        {subject?.Subject?.subject_name}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>

                        <Button
                          onClick={handleAssign}
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" /> Assign Course
                        </Button>
                        {error && error !== "Employee not found" && (
                          <div className="text-red-700 text-center text-sm truncate">
                            {error}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
              </>
            ) : null}
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

const ProfileSection = ({ title, items }) => (
  <section>
    <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, index) => (
        <div key={index}>
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-sm sm:text-base font-medium">
            {item.value || (
              <span className="italic text-gray-400">No Data</span>
            )}
          </p>
        </div>
      ))}
    </div>
    <Separator className="my-6" />
  </section>
);

const TaskDetail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-lg sm:text-xl text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm sm:text-base font-medium">{value}</p>
    </div>
  </div>
);

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "N/A";

const formatTime = (time) =>
  time ? moment(time, "HH:mm:ss").format("hh:mm A") : "N/A";

const formatDateTime = (dateTime) =>
  dateTime ? moment(dateTime).format("MMMM Do YYYY, h:mm A") : "N/A";

export default ViewProfile;
