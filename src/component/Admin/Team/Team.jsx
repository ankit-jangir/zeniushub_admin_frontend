import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./Team.css";
import TimePicker from "../../src/components/ui/time-picker";
import { format } from "date-fns";
import { Button } from "@headlessui/react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import {
  ChevronDown,
  Mail,
  Search,
  User,
  Ellipsis,
  Camera,
  HandCoins,
  Clock,
  GraduationCap,
  Phone,
  CalendarIcon,
  MapPinHouse,
  ArrowLeft,
  UserPlus,
  CheckCircle,
  Book,
  FileText,
  ArrowUp,
  Calendar,
  Users,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import { Popover, PopoverTrigger } from "../../src/components/ui/popover";
import { useNavigate, useParams } from "react-router-dom";
import ThankYouCard from "../Dashboard/ThankYouCard";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Header from "../Dashboard/Header";
import {
  update_Employee_Status,
  GetTeam,
  Update_Time,
  create_employee,
  addTask,
} from "../../../Redux_store/Api/TeamApi";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/Image/zeniushub.png";
import { get_Deparment } from "../../../Redux_store/Api/Department";
import { Textarea } from "../../../component/src/components/ui/textarea";
import { FaRegUser } from "react-icons/fa";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import No_data_found from "../No_data_found";
// import alert from "react-hot-alert";
// Zod Schema for Task Assignment Form Validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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
        if (!files || files.length === 0) return true; // file is optional
        const file = files[0];
        return file.type === "application/pdf" && file.size <= MAX_FILE_SIZE;
      },
      {
        message: "File must be a PDF and less than 5MB",
      }
    ),
});
// Schema for the first form (Basic Details)
const basicDetailsSchema = z.object({
  first_name: z.string().min(3, "Name must be at least 3 characters").max(50),
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  contact_number: z
    .string()
    .length(10, "Enter a valid 10-digit contact number") // Exactly 10 digits
    .regex(/^(\+91)?[0-9]{10}$/, "Enter a valid 10-digit contact number"), // Ensure it's only digits
});

// Schema for the second form (Additional Details)

const additionalDetailsSchema = z
  .object({
    Teachername: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50),
    email: z.string().email("Invalid email format"),
    highestQualification: z.string().min(1, "Qualification is required"),
    institution: z
      .string()
      .min(3, "Institution is required minimum character 3")
      .max(30),
    contactNumber: z
      .string({
        required_error: "Mobile number is required.",
        invalid_type_error: "Mobile number must be a string.",
      })
      .regex(
        /^[6-9][0-9]{9}$/,
        "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9 (only digits allowed)."
      )
      .refine((val) => !/^(\d)\1{9}$/.test(val), {
        message:
          "Mobile number cannot have all digits the same (e.g., 6666666666).",
      }),

    emergencyContact: z
      .string({
        required_error: "Mobile number is required.",
        invalid_type_error: "Mobile number must be a string.",
      })
      .regex(
        /^[6-9][0-9]{9}$/,
        "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9 (only digits allowed)."
      )
      .refine((val) => !/^(\d)\1{9}$/.test(val), {
        message:
          "Mobile number cannot have all digits the same (e.g., 6666666666).",
      }),
    Salary: z.string().min(4, "Enter a valid amount"),
    JoiningDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
  })
  .refine((data) => data.contactNumber !== data.emergencyContact, {
    message: "Contact Number and Emergency Contact cannot be the same",
    path: ["emergencyContact"],
  });
const testData = {
  Teachername: "Ravi",
  email: "ravi@example.com",
  highestQualification: "MSc",
  institution: "ABC University",
  contactNumber: "9876543210",
  emergencyContact: "9876543210", // same as contactNumber => should fail
  Salary: "5000",
  JoiningDate: "2023-06-01",
};

try {
  additionalDetailsSchema.parse(testData);
  console.log("Validation passed");
} catch (e) {
  console.error("Validation failed", e.errors);
}
const additionalDetailsSchema2 = z.object({
  ResidentialAddress: z
    .string()
    .min(10, "Residential Address must be at least 10 characters."),
  District: z.string().min(2, "District name is required."),
  State: z.string().min(2, "State name is required."),
  Pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),

  terms: z.boolean().optional(),

  PermanentAddress: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Permanent Address must be at least 10 characters.",
    }),

  PermanentDistrict: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Permanent District is required.",
    }),

  PermanentState: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Permanent State is required.",
    }),

  PermanentPincode: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: "Permanent Pincode must be exactly 6 digits.",
    }),
});

const bankDetailsSchema = z.object({
  accountNumber: z
    .string()
    .min(12, "Account Number must be at least 12 digits")
    .max(16, "Account Number must be at most 16 digits")
    .regex(/^\d+$/, "Account Number must contain only digits"),
  ifscCode: z
    .string()
    .min(1, "IFSC Code is required")
    .refine(
      (val) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val),
      "Invalid IFSC Code. It must be 11 characters: 4 capital letters, followed by 0, and then 6 alphanumeric characters."
    ),
  accountHolderName: z.string().min(3, "Name should be at least 3 characters"),
});

const Team = ({ teacherData }) => {
  let token = localStorage.getItem("token");
  const [openTask, setOpenTask] = useState(false);
  token = useSelector((state) => state.logout.token);
  const isDarkMode = true;
  const [viewTaskOpen, setViewTaskOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Newest");
  const [selectedDepartment, setSelectedDepartment] =
    useState("Select Department");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage, setTeachersPerPage] = useState(10);
  const [profileImg, setProfileImg] = useState("https://github.com/shadcn.png");
  const Navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [Addteacher, setTeacher] = useState(false); //first
  const [AddDetails, setAddDetails] = useState(false); //secondd
  const [AddBankDetails, setAddBankDetails] = useState(false); //third
  const [Deleteteacher, setDelete] = useState(false);
  const [ChangeTime, setChangeTime] = useState(false);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [InputName, setInputName] = useState("");
  const [isresidSameAddress, setisresidSameAddress] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { Teachers, loading, error } = useSelector((state) => state.team || []);

  const { Department } = useSelector((state) => state.Department || {});

  // const token = useSelector((state) => state.auth?.user?.token);

  const [date, setDate] = useState("");
  const [activePage, setActivePage] = useState("Team");
  const { id } = useParams();
  const [deleteemployee, setdeleteemployee] = useState(null);
  const [first_name, setEmployeeName] = useState("");
  const [updatetime, setupdatetimetime] = useState({
    start_time: "",
    end_time: "",
    id: null,
  });

  const [addemployee, setemployee] = useState({
    first_name: "",
    highest_qualification: "",
    institution_name: "",
    contact_number: "",
    emergency_number: "",
    email: "",
    date_of_birth: "2025-05-21",
    residential_address: "",
    district: "",
    state: "",
    status: "Active",
    pincode: "",
    permanent_address: "",
    permanent_district: "",
    permanent_state: "",
    permanent_pincode: "",
    department: [],
    salary: "",
    joining_date: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: "",
    image_path: null,
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const departmentList = Department;
  departmentList?.map((value) => { });

  const updateTeachersPerPage = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setTeachersPerPage(4); // Mobile
    } else if (width < 1024) {
      setTeachersPerPage(6); // Tablet
    } else {
      setTeachersPerPage(6); // Desktop
    }
  };

  // Form instances
  const basicForm = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      first_name: "",
      email: "",
      contact_number: "",
    },
  });

  useEffect(() => {
    if (open && Teachers) {
      basicForm.reset({
        first_name: Teachers.first_name || "",
        email: Teachers.email || "",
        contact_number: Teachers.contact_number || "",
      });
    }
  }, [open, Teachers, basicForm]);

  const additionalForm = useForm({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      Teachername: "",
      email: "",
      highestQualification: "",
      institution: "",
      contactNumber: "",
      emergencyContact: "",
    },
  });
  const additionalForm2 = useForm({
    resolver: zodResolver(additionalDetailsSchema2),
    defaultValues: {
      ResidentialAddress: "",
      District: "",
      State: "",
      Pincode: "",
      terms: false,
      PermanentAddress: "",
      PermanentDistrict: "",
      PermanentState: "",
      PermanentPincode: "",
      departmentSelection: "",
    },
  });
  const additionalForm3 = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
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

  const onSubmitTask = async (data) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    const formattedDueDate = data.dueDate ? data.dueDate.replace("T", " ") : "";

    formData.append("task_tittle", data.title);
    formData.append("description", data.description);
    formData.append("due_date", formattedDueDate);
    formData.append("employee_id", selectedEmployeeId);

    if (data.file?.[0]) {
      formData.append("attachments", data.file[0]);
    }

    try {
      console.log("📦 FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const resultAction = await dispatch(addTask({ formData, token }));

      if (addTask.fulfilled.match(resultAction)) {
        setOpenTask(false);
        // ✅ Reset the form
        resetTaskForm();
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
        // ✅ Refetch team data
        dispatch(
          GetTeam({
            first_name: first_name,
            limit: TeachersPerPage,
            token,
            page: currentPage,
          })
        );

      } else {
        setOpenTask(true);
        const errorMessage =
          resultAction?.payload?.error?.[0]?.message ||
          resultAction?.payload?.message ||
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
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Task submission error:";
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

  const selectedFile = watchTask("file");

  ///////dilog function
  const main = async (e) => {
    e.preventDefault();

    const isValid = await additionalForm.trigger();

    if (!isValid) {
      const errorMessage =
        error?.data?.message || // Common in RTK queries or API responses
        error?.message || // JS error message fallback
        "Failed to personal detail."; // Default fallback

      toast.error(errorMessage || "please check the personal details", {
        position: "top-right",
        autoClose: 5000,
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

    const formData = additionalForm.getValues();
    const validationResult = additionalDetailsSchema.safeParse(formData);

    if (validationResult.success) {
      toast.success("Personal details saved successfully!", {
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

      setTeacher("");
      setTeacher(false);
      setAddDetails(true);
    } else {
      const errorMessage =
        error?.message || // Common in RTK queries or API responses
        error?.message || // JS error message fallback
        "Failed to personal detail."; // Default fallback

      toast.error(errorMessage || "please check the personal details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      Object.entries(validationResult.error.format()).forEach(
        ([key, value]) => {
          additionalForm.setError(key, {
            type: "manual",
            message: value._errors?.[0] || "Invalid field",
          });
        }
      );
    }
  };

  //second dilog function
  const mainSecond = async (e) => {
    e.preventDefault();

    const isValid = await additionalForm2.trigger();

    if (!isValid) {
      const errorMessage =
        error?.messages || // Common in RTK queries or API responses
        error?.messages || // JS error message fallback
        "Failed to address details."; // Default fallback

      toast.error(errorMessage || "please fix the address details", {
        position: "top-right",
        autoClose: 5000,
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

    const formData = additionalForm2.getValues();
    const validationResult = additionalDetailsSchema2.safeParse(formData);

    if (validationResult.success) {
      toast.success("Address details saved successfully!", {
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

      setAddDetails("");
      setAddDetails(false);
      setAddBankDetails(true);
    } else {
      const errorMessage =
        error?.message || // Common in RTK queries or API responses
        error?.message || // JS error message fallback
        "Failed to address details."; // Default fallback

      toast.error(errorMessage || "please check the address details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      Object.entries(validationResult.error.format()).forEach(
        ([key, value]) => {
          additionalForm2.setError(key, {
            type: "manual",
            message: value._errors?.[0] || "Invalid field",
          });
        }
      );
    }
  };

  ///////////third dilog
  const mainthird = async (e) => {
    e.preventDefault();

    const isValid = await additionalForm3.trigger();

    if (!isValid) {
      const errorMessage =
        error?.message || // Common in RTK queries or API responses
        error?.message || // JS error message fallback
        "Failed to bank detail."; // Default fallback

      toast.error(errorMessage || "please check the bank details", {
        position: "top-right",
        autoClose: 5000,
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

    const formData = additionalForm3.getValues();
    const validationResult = bankDetailsSchema.safeParse(formData);

    if (validationResult.success) {
      toast.success("All steps completed successfully!", {
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

      additionalForm3.reset();
      setAddBankDetails("");
      setAddBankDetails(false);
    } else {
      const errorMessage =
        error?.message || // Common in RTK queries or API responses
        error?.message || // JS error message fallback
        "Failed to bank detail."; // Default fallback

      toast.error(errorMessage || "please check the bank details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      Object.entries(validationResult.error.format()).forEach(
        ([key, value]) => {
          additionalForm3.setError(key, {
            type: "manual",
            message: value._errors?.[0] || "Invalid field",
          });
        }
      );
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Validate bank details form
    const isValid = await additionalForm3.trigger();

    if (!isValid) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "failed to Sumbit";

      toast.error(errorMessage || "please check the bank details", {
        position: "top-right",
        autoClose: 5000,
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

    // Step 2: Schema validation
    const formData = additionalForm3.getValues();
    const validationResult = bankDetailsSchema.safeParse(formData);

    if (!validationResult.success) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || // JS error message fallback
          "Failed to bank details."; // Default fallback

      toast.error(
        errorMessage || "validation failed in bank details recheck it ",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        }
      );

      Object.entries(validationResult.error.format()).forEach(
        ([key, value]) => {
          additionalForm3.setError(key, {
            type: "manual",
            message: value._errors?.[0] || "Invalid field",
          });
        }
      );

      return;
    }

    try {
      // Step 3: Prepare FormData for sending both data and image
      const formDataToSend = new FormData();

      Object.entries(addemployee).forEach(([key, value]) => {
        if (key === "department") {
          formDataToSend.append(key, JSON.stringify(value)); // Send department array as JSON string
        } else if (key === "image_path") {
          if (
            value instanceof File &&
            value.type.match(/^image\/(jpeg|png|jpg|webp|svg\+xml)$/)
          ) {
            formDataToSend.append("image_path", value);
          }
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      for (const [key, value] of formDataToSend.entries()) {
      }

      // Step 4: Dispatch API call to create employee
      await dispatch(create_employee({ data: formDataToSend, token })).unwrap();
      await dispatch(
        GetTeam({
          first_name: first_name,
          limit: TeachersPerPage,
          token,
          page: currentPage,
        })
      ).unwrap();

      toast.success("Employee Add successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      // Step 5: Reset all forms and states
      additionalForm.reset();
      additionalForm2.reset();
      additionalForm3.reset();

      // Reset employee state to initial values
      setemployee({
        first_name: "",
        highest_qualification: "",
        institution_name: "",
        contact_number: "",
        emergency_number: "",
        email: "",
        salary: "",
        joining_date: "",
        residential_address: "",
        district: "",
        state: "",
        pincode: "",
        permanent_address: "",
        permanent_district: "",
        permanent_state: "",
        permanent_pincode: "",
        department: [],
        account_number: "",
        ifsc_code: "",
        account_holder_name: "",
        image_path: null,
      });

      // Reset profile image and dialog states
      setProfileImg(null);
      setisresidSameAddress(false);
      setTeacher(false);
      setAddDetails(false);
      setAddBankDetails(false);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || // JS error message fallback
          "Failed to employee data."; // Default fallback

      toast.error(errorMessage || "failed to save employee data ", {
        position: "top-right",
        autoClose: 5000,
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file)); // Show preview
      setemployee((prev) => ({
        ...prev,
        image_path: file, // Add image binary to state
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh

    console.log("Submitted Time:", { inTime, outTime });

    // Reset the time pickers
    setInTime(null);
    setOutTime(null);

    // Close the Change Time dialog
    setChangeTime(false);
  };

  const handleChange = (e) => {
    setInputName(e.target.value);

    console.log(InputName);
  };

  const handleTimeUpdate = async () => {
    if (!updatetime.id) {
      toast.warn("No employee selected.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
      return;
    }

    if (!updatetime.start_time && !updatetime.end_time) {
      toast.warn("Please select at least one time (In or Out).", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
      return;
    }

    try {
      const payload = {
        id: updatetime.id,
        ...(updatetime.start_time && {
          start_time: updatetime.start_time.substring(0, 5),
        }),
        ...(updatetime.end_time && {
          end_time: updatetime.end_time.substring(0, 5),
        }),
      };

      await dispatch(Update_Time({ data: payload, token })).unwrap();

      toast.success("Time Updated Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setChangeTime(false);
      setTimeout(() => {
        dispatch(
          GetTeam({
            first_name: first_name,
            limit: TeachersPerPage,
            token,
            page: currentPage,
          })
        );
      }, 100);
      setupdatetimetime({ id: null, start_time: "", end_time: "" });
      setInTime("");
      setOutTime("");
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to update timing.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
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

  // for time hh:mm formate
  const formatTimeToHHMM = (time) => {
    if (!time) return "";
    // If time is already in HH:mm format, return it
    if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) return time;
    // Handle other formats (e.g., "14:30:00" or Date object)
    let hours, minutes;
    if (typeof time === "string") {
      [hours, minutes] = time.split(":").slice(0, 2).map(Number);
    } else if (time instanceof Date) {
      hours = time.getHours();
      minutes = time.getMinutes();
    } else {
      return "";
    }
    if (isNaN(hours) || isNaN(minutes)) return "";
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleBasicFormSubmit = (data) => {
    if (!selectedEmployee?.id) {
      toast.warn("No employee selected for update", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const payload = {
      id: selectedEmployee.id,
      ...data,
    };

    dispatch(Update_Employee({ data: payload, token }))
      .unwrap()
      .then((res) => {
        toast.success("Employee updated successfully!", {
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

        setOpen(false);
        setSelectedEmployee(null);

        dispatch(
          GetTeam({
            first_name: first_name,
            limit: TeachersPerPage,
            token,
            page: currentPage,
          })
        );
      })
      .catch((err) => {
        const errorMessage =
          error?.error?.length > 0
            ? error?.error?.[0]?.message
            : error?.message || "Update failed. Please try again.";
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
        console.error("Update failed:", err);
      });
  };

  const handleAdditionalFormSubmit = (e) => {
    // e.preventDefault();
    // dispatch(create_employee(token));
    console.log("Additional Form Data:", data);
  };
  const handleAdditionalFormSubmit2 = (data) => {
    console.log("Additional Form Data:", data);
  };
  const handleAdditionalFormSubmit3 = (data) => {
    console.log("Submitted Data:", data);
  };

  const { watch, setValue } = additionalForm2;
  const isSameAddress = watch("terms");
  const residentialAddress = watch("ResidentialAddress");
  const district = watch("District");
  const state = watch("State");
  const pincode = watch("Pincode");
  const base_img_url = "https://adminv2-api-dev.intellix360.in/";
  useEffect(() => {
    if (isSameAddress) {
      setValue("PermanentAddress", residentialAddress);
      setValue("PermanentDistrict", district);
      setValue("PermanentState", state);
      setValue("PermanentPincode", pincode);
    }
  }, [isSameAddress, residentialAddress, district, state, pincode, setValue]);

  //GetEmployee
  useEffect(() => {
    dispatch(
      GetTeam({
        first_name: first_name,
        limit: TeachersPerPage,
        token,
        page: currentPage,
      })
    );
  }, [dispatch, first_name, currentPage]);

  useEffect(() => {
    dispatch(get_Deparment({ token, searchName: "" }));
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      if (deleteemployee) {
        await dispatch(
          update_Employee_Status({ id: deleteemployee, token })
        ).unwrap();

        toast.success("Employee deactivated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });

        setDelete(false);
        dispatch(
          GetTeam({
            first_name: first_name,
            limit: TeachersPerPage,
            token,
            page: currentPage,
          })
        );
        setdeleteemployee(null);
      } else {
        toast.warn("No employee ID selected for deletion", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Zoom,
        });
      }
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const TeachersPerPage = 9;

  // API ka direct data
  const teachersData = Teachers?.employees || [];
  const totalPages = Teachers?.totalPages || 1;
  const paginatedTeachers = teachersData;

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
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg px-4 sm:px-6 md:px-8 py-4">
            {/* Container flexes on lg+ screens */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Bar */}
              <div className="w-full lg:max-w-md">
                <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full">
                  <Search size={18} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="By Employee Name..."
                    className="ml-2 w-full outline-none bg-transparent text-sm"
                    value={first_name}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons Grid - 3 cols on sm & md, flex on lg+ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:flex lg:items-center lg:justify-end lg:gap-4">
                {/* Dropdown Menu */}

                {/* Departments Button */}
                <Button
                  onClick={() => navigate("/Departments")}
                  className="w-full lg:w-auto bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm"
                >
                  Departments
                </Button>

                {/* Ex-Employee Button */}
                <Button
                  onClick={() => Navigate("/Ex-Employee")}
                  className="w-full lg:w-auto bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Ex-Employee
                </Button>

                {/* Add Employee Button */}
                <Button
                  onClick={() => setTeacher(true)}
                  className="w-full lg:w-auto bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm"
                >
                  + Add Employee
                </Button>
              </div>

              {/* //First dilog */}
              <Dialog open={Addteacher} onOpenChange={setTeacher}>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-[800px] shadow-lg p-6 rounded-lg h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
                >
                  <div className="flex items-center mb-4">
                    <DialogTitle className="text-center flex-1">
                      Add Employee
                    </DialogTitle>
                  </div>
                  <hr />

                  <Form {...additionalForm}>
                    <form
                      onSubmit={additionalForm.handleSubmit(
                        handleAdditionalFormSubmit
                      )}
                      className="space-y-6"
                    >
                      {/* Centered Profile Image */}
                      <div className="flex justify-center">
                        <div className="relative w-32 h-32">
                          <Avatar className="w-full h-full shadow-md rounded-full">
                            <AvatarImage
                              src={profileImg || "/default-avatar.png"}
                              alt="Profile Image"
                              className="w-full h-full object-cover rounded-full border-4 border-blue-600"
                            />
                            <AvatarFallback className="rounded-full">
                              CN
                            </AvatarFallback>
                          </Avatar>

                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setemployee((prev) => ({
                                  ...prev,
                                  image_path: file,
                                }));

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProfileImg(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />

                          <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Two-Column Grid Layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name Field */}

                        <FormField
                          control={additionalForm.control}
                          name="Teachername"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setemployee((prev) => ({
                                        ...prev,
                                        first_name: value,
                                      }));
                                      field.onChange(value);
                                      additionalForm.trigger("Teachername"); // Trigger validation instantly
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("Teachername")
                                    } // Trigger on blur as well
                                    placeholder="John Doe"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <User size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Highest Qualification */}
                        <FormField
                          control={additionalForm.control}
                          name="highestQualification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Highest Qualification</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    placeholder="Bachelor's / Master's"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setemployee((prev) => ({
                                        ...prev,
                                        highest_qualification: value,
                                      }));
                                      field.onChange(value);
                                      additionalForm.trigger(
                                        "highestQualification"
                                      ); // Instant validation
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger(
                                        "highestQualification"
                                      )
                                    } // Validate on blur
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                  />

                                  <span className="absolute right-4 text-gray-500">
                                    <GraduationCap size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Institution */}
                        <FormField
                          control={additionalForm.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution Name</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    placeholder="Enter Institution Name"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setemployee((prev) => ({
                                        ...prev,
                                        institution_name: value,
                                      }));
                                      field.onChange(value);
                                      additionalForm.trigger("institution"); // Instant validation
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("institution")
                                    } // Validate on blur
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <GraduationCap size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Contact Number */}
                        <FormField
                          control={additionalForm.control}
                          name="contactNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    type="number"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    placeholder="Enter Contact Number"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Ensure the value is exactly 10 digits
                                      if (value.length <= 10) {
                                        setemployee((prev) => ({
                                          ...prev,
                                          contact_number: value,
                                        }));
                                        field.onChange(value);
                                        additionalForm.trigger("contactNumber"); // Instant validation
                                      }
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("contactNumber")
                                    } // Validate on blur
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <Phone size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Emergency Contact */}
                        <FormField
                          control={additionalForm.control}
                          name="emergencyContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    type="number"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    placeholder="Enter Emergency Number"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Ensure the value is exactly 10 digits
                                      if (value.length <= 10) {
                                        setemployee((prev) => ({
                                          ...prev,
                                          emergency_number: value,
                                        }));
                                        field.onChange(value);
                                        additionalForm.trigger(
                                          "emergencyContact"
                                        ); // Instant validation
                                      }
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("emergencyContact")
                                    } // Validate on blur
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <Phone size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={additionalForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    type="email"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    placeholder="Enter Email"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setemployee((prev) => ({
                                        ...prev,
                                        email: value,
                                      }));
                                      field.onChange(value);
                                      additionalForm.trigger("email"); // Instant validation
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("email")
                                    } // Validate on blur
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <Mail size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Salary  */}
                        <FormField
                          control={additionalForm.control}
                          name="Salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Enter in Hand Salary* (Per month)
                              </FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    type="number"
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    placeholder="In Hand Salary"
                                    {...field}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      setemployee((prev) => ({
                                        ...prev,
                                        salary: value,
                                      }));
                                      field.onChange(e);
                                      additionalForm.trigger("Salary"); // Instant validation
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("Salary")
                                    } // Validate on blur
                                  />
                                  <span className="absolute right-4 text-gray-500">
                                    <HandCoins size={21} />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Date (Date Picker) */}
                        <FormField
                          control={additionalForm.control}
                          name="JoiningDate"
                          render={({ field }) => {
                            const inputRef = useRef(null); // Ref for the hidden date input

                            return (
                              <FormItem className="flex flex-col mt-2">
                                <FormLabel>Joining Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className="w-[260px] flex items-center text-gray-500 justify-between border border-blue-400 rounded-xl px-4 py-2 shadow-lg"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          inputRef.current?.showPicker(); // Opens the date input
                                        }}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            "yyyy-MM-dd"
                                          )
                                        ) : (
                                          <span className="text-gray-500">
                                            Select Joining Date
                                          </span>
                                        )}
                                        <CalendarIcon className="h-5 w-5" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>

                                  {/* Hidden native date input */}
                                  <Input
                                    ref={inputRef}
                                    type="date"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setemployee((prev) => ({
                                        ...prev,
                                        joining_date: value,
                                      }));
                                      field.onChange(e);
                                      additionalForm.trigger("JoiningDate"); // Instant validation
                                    }}
                                    onBlur={() =>
                                      additionalForm.trigger("JoiningDate")
                                    } // Validate on blur
                                    className="opacity-0 cursor-pointer"
                                    value={
                                      field.value
                                        ? format(
                                          new Date(field.value),
                                          "yyyy-MM-dd"
                                        )
                                        : ""
                                    }
                                  />
                                </Popover>

                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={(e) => main(e)} // ✅ Pass event to function
                          type="button" // ✅ Prevent unwanted form submission
                          className="bg-blue-800 text-white px-9 py-2 rounded-lg hover:bg-blue-900"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* //second dilog */}
              <Dialog open={AddDetails} onOpenChange={setAddDetails}>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-[800px] shadow-lg p-6 rounded-lg h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
                >
                  {/* Back Arrow & Title */}
                  <div className="flex items-center mb-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering parent dialogs
                        setAddDetails(false);
                        setTeacher(true);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <DialogTitle className="text-center flex-1">
                      Access Control Details
                    </DialogTitle>
                  </div>
                  <hr />

                  <Form {...additionalForm2}>
                    <form
                      onSubmit={additionalForm2.handleSubmit(
                        handleAdditionalFormSubmit2
                      )}
                      className="space-y-6"
                    >
                      {/* Two-Column Grid Layout */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          Residential Address Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* District Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="District"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter District Name"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          district: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger("District"); // Instant validation
                                      }}
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* State Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="State"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter State Name"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          state: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger("State"); // Instant validation
                                      }}
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Pincode Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="Pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter Pincode"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          pincode: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger("Pincode"); // Instant validation
                                      }}
                                      type="number"
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* Residential Address Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="ResidentialAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Residential Address</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter Residential Address"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          residential_address: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger(
                                          "ResidentialAddress"
                                        ); // Instant validation
                                      }}
                                      type="String"
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <hr className="my-4 border-gray-300" />
                      <FormField
                        control={additionalForm2.control}
                        name="isresidSameAddress"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="isresidSameAddress"
                                checked={isresidSameAddress}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setisresidSameAddress(checked);

                                  if (checked) {
                                    // Copy residential address to permanent address fields
                                    setemployee((prev) => ({
                                      ...prev,
                                      permanent_address:
                                        prev.residential_address,
                                      permanent_district: prev.district,
                                      permanent_state: prev.state,
                                      permanent_pincode: prev.pincode,
                                    }));

                                    additionalForm2.setValue(
                                      "PermanentAddress",
                                      addemployee.residential_address
                                    );
                                    additionalForm2.setValue(
                                      "PermanentDistrict",
                                      addemployee.district
                                    );
                                    additionalForm2.setValue(
                                      "PermanentState",
                                      addemployee.state
                                    );
                                    additionalForm2.setValue(
                                      "PermanentPincode",
                                      addemployee.pincode
                                    );

                                    // Clear errors because fields are now filled
                                    additionalForm2.clearErrors([
                                      "PermanentAddress",
                                      "PermanentDistrict",
                                      "PermanentState",
                                      "PermanentPincode",
                                    ]);
                                  } else {
                                    // Clear permanent address fields
                                    setemployee((prev) => ({
                                      ...prev,
                                      permanent_address: "",
                                      permanent_district: "",
                                      permanent_state: "",
                                      permanent_pincode: "",
                                    }));

                                    additionalForm2.setValue(
                                      "PermanentAddress",
                                      ""
                                    );
                                    additionalForm2.setValue(
                                      "PermanentDistrict",
                                      ""
                                    );
                                    additionalForm2.setValue(
                                      "PermanentState",
                                      ""
                                    );
                                    additionalForm2.setValue(
                                      "PermanentPincode",
                                      ""
                                    );

                                    // Trigger validation to show errors for empty fields
                                    additionalForm2.trigger([
                                      "PermanentAddress",
                                      "PermanentDistrict",
                                      "PermanentState",
                                      "PermanentPincode",
                                    ]);
                                  }

                                  field.onChange(checked);
                                }}
                                className="w-4 h-4"
                              />
                              <label
                                htmlFor="isSameAddress"
                                className=" select-none"
                              >
                                Same as Residential Address
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          Permanent Address Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Permanent District Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="PermanentDistrict"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter District Name"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          permanent_district: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger(
                                          "PermanentDistrict"
                                        ); // Instant validation
                                      }}
                                      disabled={isSameAddress}
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Permanent State Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="PermanentState"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter State Name"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          permanent_state: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger(
                                          "PermanentState"
                                        ); // Instant validation
                                      }}
                                      disabled={isSameAddress}
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Permanent Pincode Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="PermanentPincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter Pincode"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          permanent_pincode: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger(
                                          "PermanentPincode"
                                        ); // Instant validation
                                      }}
                                      disabled={isSameAddress}
                                      type="number"
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Permanent Address Field */}
                          <FormField
                            control={additionalForm2.control}
                            name="PermanentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Permanent Address</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Enter Permanent Address"
                                      {...field}
                                      onChange={(e) => {
                                        setemployee({
                                          ...addemployee,
                                          permanent_address: e.target.value,
                                        });
                                        field.onChange(e);
                                        additionalForm2.trigger(
                                          "PermanentAddress"
                                        ); // Instant validation
                                      }}
                                      disabled={isSameAddress} // Disable if checkbox is checked
                                      className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                    />
                                    <span className="absolute right-4 text-gray-500">
                                      <MapPinHouse size={21} />
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Department Selection Dropdown */}
                          <FormField
                            control={additionalForm2.control}
                            name="departmentSelection"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Department*</FormLabel>
                                <FormControl>
                                  <div className="relative flex items-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          type="button"
                                          className="w-full border border-blue-300 rounded-xl p-5 shadow-lg py-2 focus:ring-1 focus:ring-blue-500 font-sm flex items-center justify-between"
                                        >
                                          <div className="flex flex-wrap gap-1 overflow-auto max-w-full">
                                            {/* Show placeholder text if no departments are selected */}
                                            {addemployee.department.length > 0
                                              ? addemployee.department.map(
                                                (departmentId) => {
                                                  const department =
                                                    departmentList.find(
                                                      (dept) =>
                                                        Number(dept.id) ===
                                                        departmentId
                                                    );
                                                  return department ? (
                                                    <span
                                                      key={departmentId}
                                                      className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                                                    >
                                                      {department.name}
                                                    </span>
                                                  ) : null;
                                                }
                                              )
                                              : "Select Department"}
                                          </div>
                                          <ChevronDown
                                            size={16}
                                            className="ml-2"
                                          />
                                        </Button>
                                      </DropdownMenuTrigger>

                                      <DropdownMenuContent
                                        align="start"
                                        className="max-h-[20vh] overflow-y-auto w-[44vh] shadow-md rounded-md mt-2 border border-gray-300"
                                      >
                                        {departmentList?.map((dept, index) => (
                                          <DropdownMenuItem
                                            key={index}
                                            onClick={() => {
                                              const deptId = Number(dept.id);
                                              setemployee({
                                                ...addemployee,
                                                department:
                                                  addemployee.department.includes(
                                                    deptId
                                                  )
                                                    ? addemployee.department.filter(
                                                      (d) => d !== deptId
                                                    ) // Remove department
                                                    : [
                                                      ...addemployee.department,
                                                      deptId,
                                                    ], // Add as number
                                              });
                                            }}
                                            className="cursor-pointer px-4 py-2 hover:bg-blue-600 hover:text-white border-b border-gray-300 text-gray-500 font-bold"
                                          >
                                            {dept.name}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Teacher/Professor or Academics Staff*/}
                      {/* <FormField
                          control={additionalForm2.control}
                          name="isTeacher"
                          render={({ field }) => (
                            <FormItem className="mt-1">
                              <FormLabel className="text-md font-semibold text-gray-800">
                                Add as a Teacher, Professor, or Academic Staff
                              </FormLabel>
                              <div className="flex items-center space-x-3 mt-2 pt-2">
                                <Checkbox
                                  id="isTeacher"
                                  className="w-4 sm:w-5 h-4 sm:h-5"
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                />
                                <Label
                                  htmlFor="isTeacher"
                                  className="text-gray-500 text-sm sm:text-sm"
                                >
                                  Add as a Teacher/Professor or Academic Staff
                                </Label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={(e) => mainSecond(e)}
                          // onClick={() => setAddBankDetails(true)}
                          type="submit"
                          className="bg-indigo-600 text-white px-9 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* //third dilog */}
              <Dialog open={AddBankDetails} onOpenChange={setAddBankDetails}>
                <DialogContent
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  className="sm:max-w-[800px] shadow-lg p-6 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
                >
                  {/* Back Arrow & Title */}
                  <div className="flex items-center mb-4">
                    <button
                      onClick={() => {
                        setAddBankDetails(false);
                        setAddDetails(true);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <DialogTitle className="text-center flex-1">
                      Bank Account Details
                    </DialogTitle>
                  </div>

                  <hr />

                  <Form {...additionalForm3}>
                    <form
                      onSubmit={additionalForm3.handleSubmit(
                        handleAdditionalFormSubmit3
                      )}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        {/* Account Number */}
                        <FormField
                          control={additionalForm3.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter Bank Account Number</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    placeholder="Enter Account Number"
                                    {...field}
                                    type="text" // type number ki jagah text
                                    maxLength={16} // max length lagana
                                    onChange={(e) => {
                                      // sirf digits allow karo aur length max 16 rakho
                                      let val = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );
                                      if (val.length <= 16) {
                                        setemployee({
                                          ...addemployee,
                                          account_number: val,
                                        });
                                        field.onChange({
                                          ...e,
                                          target: {
                                            ...e.target,
                                            value: val,
                                          },
                                        });
                                        additionalForm3.trigger(
                                          "accountNumber"
                                        ); // Instant validation
                                      }
                                    }}
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* IFSC Code */}
                        <FormField
                          control={additionalForm3.control}
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter IFSC Code</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    placeholder="Enter Bank IFSC Code"
                                    {...field}
                                    onChange={(e) => {
                                      setemployee({
                                        ...addemployee,
                                        ifsc_code: e.target.value,
                                      });
                                      field.onChange(e);
                                      additionalForm3.trigger("ifscCode"); // Instant validation
                                    }}
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Account Holder Name */}
                        <FormField
                          control={additionalForm3.control}
                          name="accountHolderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter Account Holder Name</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center">
                                  <Input
                                    placeholder="Enter Bank Account Holder Name"
                                    {...field}
                                    onChange={(e) => {
                                      setemployee({
                                        ...addemployee,
                                        account_holder_name: e.target.value,
                                      });
                                      field.onChange(e);
                                      additionalForm3.trigger(
                                        "accountHolderName"
                                      ); // Instant validation
                                    }}
                                    className="w-full border border-blue-300 rounded-xl p-5 focus:ring-4 focus:ring-blue-500 shadow-lg"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleFinalSubmit}
                          type="submit"
                          className="bg-blue-900 text-white px-9 py-2 rounded-lg hover:bg-blue-800"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          {loading ? (
            <div className="h-screen w-full flex items-center justify-center text-white">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
                <img
                  src={logo}
                  alt="Loading"
                  className="rounded-full h-28 w-28"
                />
              </div>
            </div>
          ) : teachersData?.length === 0 ? (
            <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
              <No_data_found />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {paginatedTeachers?.map((employee) => {
                const fullName = `${employee.first_name || "N/A"} ${employee.last_name || ""
                  }`.trim();
                const department =
                  employee.department_names?.length > 0
                    ? employee.department_names.join(", ")
                    : "No Department";

                return (
                  <div
                    key={employee.id}
                    className="w-full max-w-[400px] h-[360px] mx-auto p-6 rounded-xl shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col justify-between gap-4 relative"
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
                        className="w-44 bg-white dark:bg-gray-900 mt-2 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1"
                      >
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault(); // ✅ dropdown close hone se bacha lo
                            setSelectedEmployeeId(employee.id);
                            setOpenTask(true);  // ✅ dialog khol do
                          }}
                          className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 px px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          +Assign Task
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                          onClick={() => {
                            setChangeTime(true);
                            setupdatetimetime({
                              id: employee.id,
                              start_time: employee.start_time || "",
                              end_time: employee.end_time || "",
                            });
                            setInTime(employee.start_time || "");
                            setOutTime(employee.end_time || "");
                          }}
                        >
                          Change Timing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDelete(true);
                            setdeleteemployee(employee.id);
                          }}
                          className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          Deactivated
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={openTask} onOpenChange={setOpenTask}>
                      {/* <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedEmployeeId(employee.id);
                                setOpenTask(true);
                              }}
                              className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/50 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            >
                              +Assign Task
                            </DropdownMenuItem>
                          </DialogTrigger> */}
                      <DialogContent
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-2xl  text-gray-800 dark:text-gray-100">
                            Assign Task
                          </DialogTitle>
                          <div className="mt-1">
                            <span className="text-[19px] font-medium text-gray-800 dark:text-gray-100">
                              <FaRegUser className="inline-block mr-2" />{" "}
                              Employee Name : {employee.first_name}
                            </span>
                          </div>
                        </DialogHeader>
                        <form
                          onSubmit={handleTaskSubmit(onSubmitTask)}
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="title"
                              className="font-medium text-lg mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200"
                            >
                              <Book size={18} /> Task Title *
                            </label>
                            <Input
                              id="title"
                              placeholder="Task Title"
                              maxLength={100}
                              {...taskRegister("title")}
                              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            {taskErrors.title && (
                              <p className="text-red-500 text-sm">
                                {taskErrors.title.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="font-medium text-lg mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200"
                            >
                              <FileText size={18} /> Task Description *
                            </label>
                            <Textarea
                              id="description"
                              placeholder="Task Description"
                              maxLength={250}
                              {...taskRegister("description")}
                              className="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            {taskErrors.description && (
                              <p className="text-red-500 text-sm">
                                {taskErrors.description.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="file-upload"
                              className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-sm font-medium px-4 py-2 rounded-md cursor-pointer w-fit bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                            >
                              <ArrowUp size={18} /> Add Attachments
                            </label>
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
                                      alert("Only PDF files are allowed.");
                                      e.target.value = "";
                                      setFileName("");
                                      return;
                                    }
                                    if (file.size > 5 * 1024 * 1024) {
                                      alert(
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
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="due-date"
                              className="text-gray-800 dark:text-gray-200"
                            >
                              Due Date :
                            </Label>
                            <Input
                              id="due-date"
                              type="datetime-local"
                              {...taskRegister("dueDate")}
                              min={new Date().toISOString().slice(0, 16)}
                              className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-md 
               bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                              onFocus={(e) => e.target.showPicker()}
                            />
                            {taskErrors.dueDate && (
                              <p className="text-red-500 text-sm">
                                {taskErrors.dueDate.message}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-center pt-2">
                            <DialogFooter>
                              <Button
                                type="submit"
                                className="w-[250px] bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                              >
                                Assign Task
                              </Button>
                            </DialogFooter>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    {/* Top Section */}
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          employee.image_path
                            ? `${base_img_url}viewimagefromazure?filePath=${employee?.image_path}`
                            : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg"
                        }
                        alt="Employee"
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
                          <div className="max-w-[250px] scrollbar-hide overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
                            <span
                              className="inline-block text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 
                 text-blue-700 dark:text-blue-300 rounded-full font-medium"
                            >
                              {employee.department_names?.length > 0
                                ? employee.department_names.join(", ")
                                : "No Department"}
                            </span>
                          </div>

                          <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 
                   text-green-700 dark:text-green-300 rounded-full font-medium">
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
                          Navigate(`/employee/view-profile/${employee.id}`)
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

          {/*Change Time*/}
          <Dialog open={ChangeTime} onOpenChange={setChangeTime}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[425px] shadow-lg p-6 rounded-lg"
            >
              <DialogHeader>
                <DialogTitle className="text-center text-[29px]">
                  Change Time
                </DialogTitle>
                <DialogDescription className="text-center text-md">
                  Update the employee's in and/or out time.
                </DialogDescription>
              </DialogHeader>

              <hr className="mt-5" />
              <div className="flex justify-center">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTimeUpdate();
                  }}
                  className="space-y-4 w-full"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="w-1/2 pr-2">
                      <TimePicker
                        label="In Time"
                        selectedTime={formatTimeToHHMM(inTime)}
                        setSelectedTime={(val) => {
                          const formattedTime = formatTimeToHHMM(val);
                          setInTime(formattedTime);
                          setupdatetimetime((prev) => ({
                            ...prev,
                            start_time: formattedTime,
                          }));
                        }}
                      />
                    </div>
                    <div className="w-1/2 pl-2">
                      <TimePicker
                        label="Out Time"
                        selectedTime={formatTimeToHHMM(outTime)}
                        setSelectedTime={(val) => {
                          const formattedTime = formatTimeToHHMM(val);
                          setOutTime(formattedTime);
                          setupdatetimetime((prev) => ({
                            ...prev,
                            end_time: formattedTime,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-indigo-500 text-white px-5 w-full py-2 rounded-lg hover:bg-indigo-600"
                  >
                    Proceed
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={Deleteteacher} onOpenChange={setDelete}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[425px] shadow-lg p-6 rounded-lg"
            >
              <DialogHeader>
                <DialogTitle className="text-center text-[29px]">
                  Deactivate Employee
                </DialogTitle>
                <DialogDescription className="text-center text-md">
                  Are you sure you want to deactivate this employee?
                </DialogDescription>
              </DialogHeader>
              <hr className="mt-5" />
              <div className="flex justify-center">
                <Button
                  onClick={handleDelete}
                  type="submit"
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                  Deactivate Employee
                </Button>
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
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Team;
