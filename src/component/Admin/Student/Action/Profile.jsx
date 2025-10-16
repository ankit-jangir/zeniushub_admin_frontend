import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getSingleStudent,
  updateStudent,
} from "../../../../Redux_store/Api/StudentsApiStore";
import {
  fetchBatchesByCourseId,
  Add_Batches,
} from "../../../../Redux_store/Api/Batches";
import {
  get_course,
  update_course,
} from "../../../../Redux_store/Api/Academic_course";
import { Card, CardContent } from "../../../src/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../src/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import { Separator } from "../../../src/components/ui/separator";
import { Button } from "@headlessui/react";
import { ArrowLeft, Eye, Pencil, Plus } from "lucide-react";
import Header from "../../Dashboard/Header";
import avatar from "../dummy-avatar (1).jpg";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Input } from "../../../src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../src/components/ui/form";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../src/components/ui/dialog";
import Swal from "sweetalert2";
import { toast, Zoom } from "react-toastify";
import logo from "../../../../assets/Image/intellix.png";
import Viewdetail from "../../Academics/Academics_data/batch/Viewdetail";

const threeYearsAgo = new Date();
threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
// Zod schema for student form validation
const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must not exceed 80 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .max(160, "Address must not exceed 160 characters")
    .optional(),

  fatherName: z
    .string()
    .min(1, "father Name is required")
    .max(80, "father Name must not exceed 80 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed")
    .optional(),
  email: z.string().email("Invalid email address.").optional(),
  adharNo: z
    .string()
    .length(12, "Aadhaar must be 12 digits")
    .regex(/^[2-9]\d{11}$/, "Aadhaar must start with digits 2-9 and be numeric")
    .refine((val) => !/^(\d)\1{11}$/.test(val), {
      message:
        "Aadhaar number cannot have all digits the same (e.g., 111111111111).",
    })
    .optional(),

  contactNo: z
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
    })
    .optional(),
  motherName: z
    .string()
    .min(1, "mother Name is required")
    .max(80, "mother Name must not exceed 80 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed")
    .optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format")
    .refine(
      (value) => {
        const date = new Date(value);
        return date <= threeYearsAgo;
      },
      { message: "Date of Birth must be at least 3 years earlier" }
    )
    .optional(),

  joining_date: z
    .string()
    .min(1, "Joining Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining Date must be in YYYY-MM-DD format")
    .optional(),
  gender: z
    .enum(["Male", "Female", "Other"], {
      required_error: "Gender is required",
    })
    .optional(),
  rt: z.boolean().optional(),
  selectedCourse: z.string().min(1, "Course is required"),
  selectedBatch: z.string().min(1, "Batch is required"),
  parentAdharNo: z
    .string()
    .optional()
    .refine((value) => !value || /^[0-9]{12}$/.test(value), {
      message: "Parent Aadhar number must be 12 digits",
    }),

  parentAccountNo: z
    .string()
    .optional()
    .refine((value) => !value || /^[0-9]{9,18}$/.test(value), {
      message: "Parent account number must be between 9 to 18 digits",
    }),

  pancardNo: z
    .string()
    .optional()
    .refine((value) => !value || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value), {
      message: "Invalid PAN card format ",
    }),

  ifscNo: z
    .string()
    .optional()
    .refine((value) => !value || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value), {
      message: "Invalid IFSC code format ",
    }),

  exSchool: z.string().min(1, "School name is required"),

  adharUploadFile: z.any().refine((file) => file instanceof File, {
    message: "Please adhar upload a file",
  }),

  pancardUploadFile: z.any().refine((file) => file instanceof File, {
    message: "Please pancard upload a file",
  }),
});

// Zod schema for batch form validation
const batchSchema = z.object({
  batchName: z.string().min(1, "Batch name is required"),
  course_id: z.string().min(1, { message: "Course is required" }),
  starttime: z.string().min(1, { message: "Start time is required" }),
  endtime: z.string().min(1, { message: "End time is required" }),
});

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editedCourseNames, setEditedCourseNames] = useState({});
  const [addBatches, setAddBatches] = useState(false);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  // Main form for editing student
  const methods = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      address: "",
      fatherName: "",
      email: "",
      adharNo: "",
      contactNo: "",
      motherName: "",
      adharUploadFile: "",
      pancardUploadFile: "",
      parentAdharNo: "",
      parentAccountNo: "",
      pancardNo: "",
      ifscNo: "",
      exSchool: "",

      dob: "",
      joining_date: "",
      gender: "",
      rt: false,
      selectedCourse: "",
      selectedBatch: "",
    },
    mode: "onChange",
  });

  // Batch form for adding new batch
  const batchMethods = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      course_id: selectedCourseId ? selectedCourseId.toString() : "",
      starttime: "",
      endtime: "",
    },
  });
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const { handleSubmit: formHandleSubmit, watch, control, reset } = methods;
  const {
    control: batchControl,
    handleSubmit: batchHandleSubmit,
    reset: batchReset,
    setValue: setBatchValue,
  } = batchMethods;

  const { Profile, loading, error } = useSelector((state) => state.students);
  const {
    course: courses = { data: [] },
    loading: coursesLoading,
    error: coursesError,
  } = useSelector((state) => state.courses);
  const {
    batches,
    loading: batchesLoading,
    error: batchesError,
  } = useSelector((state) => state.Batch);

  const selectedCourse = watch("selectedCourse");
  //  let token = localStorage.getItem("token");
  // Fetch student data
  useEffect(() => {
    if (id) {
      dispatch(getSingleStudent({ id, token }));
    }
  }, [id, dispatch]);

  // Fetch courses
  useEffect(() => {
    dispatch(get_course(token)).catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch courses. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    });
  }, [dispatch]);

  // Fetch batches when the modal opens or course changes
  useEffect(() => {
    if (showModal && Profile?.data?.course_id) {
      dispatch(
        fetchBatchesByCourseId({ courseId: Profile?.data?.course_id, token })
      ).catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch batches. Please try again.",
          confirmButtonColor: "#3085d6",
        });
      });
    }
  }, [showModal, Profile?.data?.course_id, dispatch]);

  // Set form default values when Profile data is available and batches are fetched
  useEffect(() => {
    if (Profile?.data && showModal && !batchesLoading) {
      setTimeout(() => {
        reset({
          name: Profile?.data?.Student?.name || "",
          address: Profile?.data?.Student?.address || "",
          fatherName: Profile?.data?.Student?.father_name || "",
          email: Profile?.data?.Student?.email || "",
          adharNo: Profile?.data?.Student?.adhar_no || "",
          contactNo: Profile?.data?.Student?.contact_no || "",
          motherName: Profile?.data?.Student?.mother_name || "",
          adharUploadFile: Profile?.data?.Student?.adhar_front_back || "",
          pancardUploadFile: Profile?.data?.Student?.pancard_front_back || "",

          parentAdharNo: Profile?.data?.Student?.parent_adhar_no || "",
          parentAccountNo: Profile?.data?.Student?.parent_account_no || "",
          pancardNo: Profile?.data?.Student?.pancard_no || "",
          ifscNo: Profile?.data?.Student?.ifsc_no || "",
          exSchool: Profile?.data?.Student?.ex_school || "",

          dob: Profile?.data?.Student?.dob
            ? Profile?.data?.Student?.dob.split("T")[0]
            : "",
          joining_date: Profile?.data?.joining_date
            ? Profile?.data?.joining_date.split("T")[0]
            : "",
          gender: Profile?.data?.Student?.gender || "",
          rt: Profile?.data?.Student?.rt || false,
          selectedCourse: Profile?.data?.course_id
            ? String(Profile?.data?.course_id)
            : "",
          selectedBatch: Profile?.data?.batch_id
            ? String(Profile?.data?.batch_id)
            : "",
        });
      }, 100); // Small delay to ensure batches are loaded
    }
  }, [Profile, showModal, batchesLoading, reset]);

  // Fetch batches when selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(
        fetchBatchesByCourseId({ courseId: selectedCourse, token })
      ).catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch batches. Please try again.",
          confirmButtonColor: "#3085d6",
        });
      });
    }
  }, [selectedCourse, dispatch]);

  // Update batch form course_id when selectedCourseId changes
  useEffect(() => {
    if (selectedCourseId) {
      setBatchValue("course_id", selectedCourseId.toString());
    }
  }, [selectedCourseId, setBatchValue]);

  const goBack = () => window.history.back();

  const onSubmit = async (data) => {
    const watchedValues = watch();

    // Compare current form values with the original Profile.data
    const isFormChanged =
      JSON.stringify(watchedValues) !==
      JSON.stringify({
        name: Profile?.data?.Student?.name || "",
        address: Profile?.data?.Student?.address || "",
        fatherName: Profile?.data?.Student?.father_name || "",
        email: Profile?.data?.Student?.email || "",
        adharNo: Profile?.data?.Student?.adhar_no || "",
        contactNo: Profile?.data?.Student?.contact_no || "",
        motherName: Profile?.data?.Student?.mother_name || "",
        adharUploadFile: Profile?.data?.Student?.adhar_front_back || "",
        pancardUploadFile: Profile?.data?.Student?.pancard_front_back || "",

        parentAdharNo: Profile?.data?.Student?.parent_adhar_no || "",
        parentAccountNo: Profile?.data?.Student?.parent_account_no || "",
        pancardNo: Profile?.data?.Student?.pancard_no || "",
        ifscNo: Profile?.data?.Student?.ifsc_no || "",
        exSchool: Profile?.data?.Student?.ex_school || "",

        dob: Profile?.data?.Student?.dob
          ? Profile?.data?.Student?.dob.split("T")[0]
          : "",
        joining_date: Profile?.data?.Student?.joining_date
          ? Profile?.data?.Student?.joining_date.split("T")[0]
          : "",
        gender: Profile?.data?.Student?.gender || "",
        rt: Profile?.data?.Student?.rt || false,
        selectedCourse: Profile?.data?.course_id
          ? String(Profile?.data?.course_id)
          : "",
        selectedBatch: Profile?.data?.batch_id
          ? String(Profile?.data?.batch_id)
          : "",
      });

    if (!isFormChanged && !file) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No changes were made to the student data.",
        confirmButtonColor: "#3085d6",
        timer: 2000,
      });
      setShowModal(false);
      return;
    }

    try {
      const studentData = {
        name: data.name,
        course_id: parseInt(data.selectedCourse),
        batch_id: parseInt(data.selectedBatch),
        email: data.email || "",
        address: data.address || "",
        father_name: data.fatherName || "",
        adhar_no: data.adharNo || "",
        contact_no: data.contactNo || "",
        mother_name: data.motherName || "",
        adhar_front_back: data.adharUploadFile || "",
        pancard_front_back: data.pancardUploadFile || "",
        parent_adhar_no: data.parentAdharNo || "",
        parent_account_no: data.parentAccountNo || "",
        pancard_no: data.pancardNo || "",
        ifsc_no: data.ifscNo || "",
        ex_school: data.exSchool || "",

        dob: data.dob || "",
        joining_date: data.joining_date || "",
        gender: data.gender || "",
        rt: data.rt !== undefined ? data.rt : false,
        ...(file && { file }),
      };
      console.log(studentData, "updateStudent");
      await dispatch(updateStudent({ studentData, id, token })).unwrap();
      setShowModal(false);
      setFile(null);
      dispatch(getSingleStudent({ id, token }));
      Swal.fire({
        title: "Success!",
        text: "Student updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "Failed to update student. Please try again.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const onSubmit2 = async (data) => {
    const batchPayload = {
      course_id: Number(data.course_id),
      BatchesName: data.batchName,
      StartTime: `${data.starttime}:00`,
      EndTime: `${data.endtime}:00`,
    };

    try {
      await dispatch(Add_Batches(batchPayload)).unwrap();
      if (selectedCourse) {
        await dispatch(
          fetchBatchesByCourseId({ courseId: selectedCourse, token })
        ).unwrap();
      }
      batchReset();
      setAddBatches(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Batch added successfully!",
        confirmButtonColor: "#3085d6",
        timer: 3000,
      });
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add batch. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFile(null);
  };

  const handleImageChange = async () => {
    const { value: selectedFile } = await Swal.fire({
      title: "Select image",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
    });

    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Your uploaded picture",
          imageUrl: e.target.result,
          imageAlt: "The uploaded picture",
          timer: 2000,
          showConfirmButton: false,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleViewCourseDetails = (id) => {
    setSelectedCourseId(id);
    setShowCourseModal(true);
  };

  const handleViewSubjects = (courseId) => {
    Swal.fire({
      icon: "info",
      title: "Not Implemented",
      text: "Subject viewing functionality is not implemented yet.",
      confirmButtonColor: "#3085d6",
    });
  };

  const profileData = Profile?.data;

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex gap-5 mt-2 ms-2">
          <Button
            className="text-white w-[200px] bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2"
            onClick={goBack}
          >
            <ArrowLeft size={18} />
            <span className="hidden md:inline text-white">Back to Student</span>
          </Button>
          {profileData?.status !== false && (
            <Button
              className="w-[160px] text-white bg-blue-900 hover:bg-blue-800 px-4 py-1.5 rounded-md text-sm flex items-center justify-center"
              onClick={openModal}
            >
              Edit
            </Button>
          )}
        </div>

        {!showModal ? (
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 w-full h-screen flex flex-col items-center">
              {loading ? (
                <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
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
                <div>Error: {error}</div>
              ) : !Profile?.data ? (
                <div>No student data available</div>
              ) : (
                <Card className="w-full max-w-4xl shadow-md border rounded-xl">
                  <div className="relative w-full h-40 bg-orange-600 rounded-t-xl flex items-center px-6">
                    <div className="ml-32 mt-10" style={{ cursor: "pointer" }}>
                      <PhotoProvider>
                        <PhotoView
                          src={
                            Profile.data?.Student?.profile_image
                              ? `${import.meta.env.VITE_BASE_URL
                              }/viewimagefromazure?filePath=${Profile.data?.Student?.profile_image
                              }`
                              : avatar
                          }
                        >
                          <Avatar className="w-24 h-24 border-4 border-white shadow-lg absolute -bottom-12 left-6 cursor-pointer">
                            <AvatarImage
                              className="rounded-full border-4 border-orange-600"
                              src={
                                Profile.data?.Student?.profile_image
                                  ? `${import.meta.env.VITE_BASE_URL
                                  }/viewimagefromazure?filePath=${Profile.data?.Student?.profile_image
                                  }`
                                  : avatar
                              }
                              alt={Profile.data?.Student?.name || "student"}
                            />
                            <AvatarFallback>
                              <img src={avatar} alt="" />
                            </AvatarFallback>
                          </Avatar>
                        </PhotoView>
                      </PhotoProvider>
                      <div className="max-w-2xl">
                        <h2
                          className="text-2xl font-bold text-white truncate cursor-pointer hover:text-blue-200 transition-colors"
                          onClick={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            Swal.fire({
                              title: "Student Name",
                              text: Profile?.data?.Student?.name || "N/A",
                              customClass: {
                                popup:
                                  "w-[400px] rounded-xl shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
                                title: "text-2xl font-semibold",
                                content: "text-lg",
                                confirmButton: "hidden",
                              },
                              showConfirmButton: false,
                              backdrop: "rgba(0, 0, 0, 0.6)",
                              position: "top-start", // Changed to position near the element
                              allowOutsideClick: true,
                              allowEscapeKey: true,
                              didOpen: (popup) => {
                                // Position the popup near the clicked element
                                popup.style.position = "absolute";
                                popup.style.top = `${rect.bottom + window.scrollY + 5
                                  }px`; // Slightly below the name
                                popup.style.left = `${rect.left + window.scrollX
                                  }px`; // Aligned with the name
                              },
                            });
                          }}
                        >
                          Name: {Profile?.data?.Student?.name || "N/A"}
                        </h2>
                      </div>

                      <div
                        className="flex items-center gap-2 text-md opacity-80 text-white cursor-pointer hover:text-blue-200 transition-colors"
                        onClick={() =>
                          Profile?.data?.course_id
                            ? handleViewCourseDetails(Profile?.data?.course_id)
                            : Swal.fire({
                              icon: "error",
                              title: "Error",
                              text: "Course ID not found",
                            })
                        }
                        title="View course details"
                      >
                        <span>
                          Course:{" "}
                          {Profile?.data?.Course?.course_name?.length > 60
                            ? `${Profile?.data?.Course?.course_name.slice(
                              0,
                              60
                            )}...`
                            : Profile?.data?.Course?.course_name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Details Modal */}
                  <Dialog
                    open={showCourseModal}
                    onOpenChange={setShowCourseModal}
                  >
                    <DialogContent
                      className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl"
                      onPointerDownOutside={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">
                          Course Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedCourseId && (
                        <>
                          {coursesLoading ? (
                            <div>Loading course details...</div>
                          ) : coursesError ? (
                            <div>Error: {coursesError}</div>
                          ) : (
                            (() => {
                              const course = courses?.data?.find(
                                (c) => c.id === Number(selectedCourseId)
                              );
                              if (!course) {
                                return <div>No course data found</div>;
                              }
                              return (
                                <div className="mt-6 space-y-6">
                                  {course?.status === "active" && (
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                      <Button
                                        className="bg-blue-600 text-white hover:bg-blue-500 text-sm px-4 py-2 flex items-center gap-2 transition duration-200"
                                        onClick={() =>
                                          setEditingCourseId(course.id)
                                        }
                                      >
                                        <Pencil className="w-4 h-4" /> Edit
                                        Course
                                      </Button>
                                      <Button
                                        className="bg-blue-600 text-white hover:bg-blue-500 text-sm px-4 py-2 flex items-center gap-2 transition duration-200"
                                        onClick={() => setAddBatches(true)}
                                      >
                                        <Plus className="w-4 h-4" /> Add Batch
                                      </Button>
                                    </div>
                                  )}

                                  {editingCourseId === course.id ? (
                                    <div className="mb-6">
                                      <input
                                        type="text"
                                        value={
                                          editedCourseNames[course.id] ??
                                          course.course_name
                                        }
                                        onChange={(e) =>
                                          setEditedCourseNames((prev) => ({
                                            ...prev,
                                            [course.id]: e.target.value,
                                          }))
                                        }
                                        className="border px-4 py-3 rounded-md w-full bg-transparent mb-4 shadow-sm"
                                      />
                                      <div className="flex gap-3">
                                        <Button
                                          className="bg-blue-600 hover:bg-blue-500 text-white transition duration-200"
                                          onClick={async () => {
                                            const updatedName =
                                              editedCourseNames[course.id];
                                            if (!updatedName?.trim()) return;

                                            const payload = {
                                              id: course.id,
                                              course_Name: updatedName.trim(),
                                            };

                                            try {
                                              await dispatch(
                                                update_course(payload)
                                              ).unwrap();
                                              toast.success(
                                                "Course Edit Successfully",
                                                {
                                                  position: "top-right",
                                                  autoClose: 5000,
                                                  hideProgressBar: false,
                                                  closeOnClick: false,
                                                  pauseOnHover: true,
                                                  draggable: true,
                                                  theme: "light",
                                                  transition: Zoom,
                                                }
                                              );
                                              await dispatch(get_course(token));
                                              setEditingCourseId(null);
                                            } catch (error) {
                                              const errorMessage =
                                                error?.error?.length > 0
                                                  ? error?.error?.[0]?.message
                                                  : error?.message ||
                                                  "Failed To Update Course";
                                              toast.error(errorMessage, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: false,
                                                pauseOnHover: true,
                                                draggable: true,
                                                theme: "light",
                                                transition: Zoom,
                                              });
                                            }
                                          }}
                                        >
                                          Submit
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="text-gray-500 border-gray-400"
                                          onClick={() =>
                                            setEditingCourseId(null)
                                          }
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                      Course: {course.course_name}
                                    </h2>
                                  )}

                                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-6">
                                    <div className="text-lg font-medium text-gray-700 dark:text-white">
                                      Duration:{" "}
                                      {course.course_duration
                                        ? (() => {
                                          const years = Math.floor(
                                            course.course_duration / 12
                                          );
                                          const months =
                                            course.course_duration % 12;
                                          return (
                                            `${years > 0
                                              ? `${years} year${years > 1 ? "s" : ""
                                              } `
                                              : ""
                                              }${months > 0
                                                ? `${months} month${months > 1 ? "s" : ""
                                                }`
                                                : ""
                                              }`.trim() || "0 months"
                                          );
                                        })()
                                        : "N/A"}
                                    </div>
                                    <div className="text-lg font-medium text-gray-700 text-end dark:text-white">
                                      Price: ₹{course.course_price ?? "N/A"}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="text-lg font-medium text-gray-700 dark:text-white">
                                      Mode: {course.course_type}
                                    </div>
                                    <div className="text-right text-lg font-medium text-gray-700 dark:text-white">
                                      Batches:{" "}
                                      {batches?.data?.batches?.length ?? 0}
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
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {batches?.data?.batches?.length > 0 ? (
                                          batches.data.batches.map(
                                            (batch, index) => (
                                              <tr
                                                key={batch.id}
                                                className="border-t hover:bg-blue-50 dark:hover:bg-gray-900 transition duration-150"
                                              >
                                                <td className="p-3 whitespace-nowrap">
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
                                                  {batch.StartTime}
                                                </td>
                                                <td className="whitespace-nowrap pe-4">
                                                  <Viewdetail
                                                    batchid={batch.id}
                                                    cn={
                                                      batch.Course.course_name
                                                    }
                                                    courseid={batch.course_id}
                                                    s={batch.StartTime}
                                                    e={batch.EndTime}
                                                    n={batch.BatchesName}
                                                    a={batch.status}
                                                  />
                                                </td>
                                              </tr>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="4"
                                              className="text-center p-3 text-gray-500"
                                            >
                                              No Data Found
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <Dialog
                                    open={addBatches}
                                    onOpenChange={setAddBatches}
                                  >
                                    <DialogContent
                                      className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto shadow-lg p-6 rounded-lg"
                                      onPointerDownOutside={(e) =>
                                        e.preventDefault()
                                      }
                                      onEscapeKeyDown={(e) =>
                                        e.preventDefault()
                                      }
                                    >
                                      <DialogHeader>
                                        <DialogTitle className="text-center text-xl font-semibold">
                                          Add Batch
                                        </DialogTitle>
                                      </DialogHeader>
                                      <FormProvider {...batchMethods}>
                                        <form
                                          onSubmit={batchHandleSubmit(
                                            onSubmit2
                                          )}
                                          className="space-y-6"
                                        >
                                          <FormField
                                            control={batchControl}
                                            name="batchName"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Batch Name
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="Enter Batch Name"
                                                    {...field}
                                                    className="mt-1 w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={batchControl}
                                            name="course_id"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Course</FormLabel>
                                                <FormControl>
                                                  <Select
                                                    onValueChange={
                                                      field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    disabled={true}
                                                  >
                                                    <SelectTrigger className="w-full">
                                                      <SelectValue placeholder="Select a Course" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel>
                                                          Courses
                                                        </SelectLabel>
                                                        {Array.isArray(
                                                          courses?.data
                                                        ) &&
                                                          courses.data.map(
                                                            (course) => (
                                                              <SelectItem
                                                                key={course.id}
                                                                value={course.id.toString()}
                                                              >
                                                                {course.course_name ||
                                                                  `Course ${course.id}`}
                                                              </SelectItem>
                                                            )
                                                          )}
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
                                              control={batchControl}
                                              name="starttime"
                                              render={({ field }) => (
                                                <FormItem className="w-full">
                                                  <FormLabel>
                                                    Start Time
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      type="time"
                                                      {...field}
                                                      ref={startTimeRef}
                                                      className="mt-1 w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={batchControl}
                                              name="endtime"
                                              render={({ field }) => (
                                                <FormItem className="w-full">
                                                  <FormLabel>
                                                    End Time
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      type="time"
                                                      {...field}
                                                      ref={endTimeRef}
                                                      className="mt-1 w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                          <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-md"
                                          >
                                            Confirm
                                          </Button>
                                        </form>
                                      </FormProvider>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })()
                          )}
                        </>
                      )}
                    </DialogContent>
                  </Dialog>

                  <CardContent className="mt-16 px-4 sm:px-6 pb-6">
                    <div className="flex flex-col sm:flex-row gap-6 mt-6">
                      <div className="flex-1 shadow-md rounded-2xl p-3">
                        <h2 className="text-2xl font-bold mb-6">
                          Student Details
                        </h2>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-6">
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Enrollment ID</p>
                            <p className="text-lg font-semibold">
                              {Profile?.data?.Student?.enrollment_id || "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Joining Date</p>
                            <p className="text-lg font-semibold">
                              {Profile?.data?.joining_date
                                ? new Date(
                                  Profile.data?.joining_date
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Date of Birth</p>
                            <p className="text-lg font-semibold">
                              {Profile.data?.Student?.dob
                                ? new Date(
                                  Profile.data?.Student?.dob
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Gender</p>
                            <p className="text-lg font-semibold">
                              {Profile.data?.Student?.gender || "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Email</p>
                            <p className="text-lg font-semibold break-words whitespace-normal max-w-[250px]">
                              {Profile.data?.Student?.email || "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Contact Number</p>
                            <p className="text-lg font-semibold">
                              {Profile.data?.Student?.contact_no || "N/A"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <p className="text-sm">Status</p>
                            <p className="text-lg font-semibold">
                              {Profile.data?.status === true
                                ? "Active"
                                : Profile.data?.status === false
                                  ? "Inactive"
                                  : "False"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <div className="p-6 border rounded-2xl mt-6">
                      <h2 className="text-2xl font-bold mb-6">
                        Permanent Address
                      </h2>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-6">
                        <div className="flex-1 min-w-[200px] max-w-full break-words">
                          <p className="text-sm">Address</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">
                      Parent Details
                    </h3>
                    <div className="p-6 border rounded-2xl mt-6">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-6">
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Father's Name</p>
                          <p className="text-lg font-semibold">
                            <span
                              className="cursor-pointer hover:text-blue-200 transition-colors"
                              onClick={(e) => {
                                const rect = e.target.getBoundingClientRect();
                                Swal.fire({
                                  title: "Father's Name",
                                  text:
                                    Profile?.data?.Student?.father_name ||
                                    "N/A",
                                  icon: "info",
                                  customClass: {
                                    popup:
                                      "w-[400px] rounded-xl shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
                                    title: "text-2xl font-semibold",
                                    content: "text-lg",
                                    confirmButton: "hidden",
                                  },
                                  showConfirmButton: false,
                                  backdrop: "rgba(0, 0, 0, 0.6)",
                                  position: "top-start",
                                  allowOutsideClick: true,
                                  allowEscapeKey: true,
                                  didOpen: (popup) => {
                                    popup.style.position = "absolute";
                                    popup.style.top = `${rect.bottom + window.scrollY + 5
                                      }px`;
                                    popup.style.left = `${rect.left + window.scrollX
                                      }px`;
                                  },
                                });
                              }}
                            >
                              {Profile?.data?.Student?.father_name?.length > 20
                                ? `${Profile?.data?.Student?.father_name.slice(
                                  0,
                                  20
                                )}...`
                                : Profile?.data?.Student?.father_name || "N/A"}
                            </span>
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Mother's Name</p>
                          <p className="text-lg font-semibold">
                            <span
                              className="cursor-pointer hover:text-blue-200 transition-colors"
                              onClick={(e) => {
                                const rect = e.target.getBoundingClientRect();
                                Swal.fire({
                                  title: "Mother's Name",
                                  text:
                                    Profile?.data?.Student?.mother_name ||
                                    "N/A",
                                  customClass: {
                                    popup:
                                      "w-[400px] rounded-xl shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
                                    title: "text-2xl font-semibold",
                                    content: "text-lg",
                                    confirmButton: "hidden",
                                  },
                                  showConfirmButton: false,
                                  backdrop: "rgba(0, 0, 0, 0.6)",
                                  position: "top-start",
                                  allowOutsideClick: true,
                                  allowEscapeKey: true,
                                  didOpen: (popup) => {
                                    popup.style.position = "absolute";
                                    popup.style.top = `${rect.bottom + window.scrollY + 5
                                      }px`;
                                    popup.style.left = `${rect.left + window.scrollX
                                      }px`;
                                  },
                                });
                              }}
                            >
                              {Profile?.data?.Student?.mother_name?.length > 20
                                ? `${Profile?.data?.Student?.mother_name.slice(
                                  0,
                                  20
                                )}...`
                                : Profile?.data?.Student?.mother_name || "N/A"}
                            </span>
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Parent Aadhar No</p>
                          <p className="text-lg font-semibold">
                            <span
                              className="cursor-pointer hover:text-blue-200 transition-colors"
                              onClick={(e) => {
                                const rect = e.target.getBoundingClientRect();
                                Swal.fire({
                                  title: "Parent Aadhar Number",
                                  text:
                                    Profile?.data?.Student?.parent_adhar_no ||
                                    "N/A",
                                  customClass: {
                                    popup:
                                      "w-[400px] rounded-xl shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
                                    title: "text-2xl font-semibold",
                                    content: "text-lg",
                                    confirmButton: "hidden",
                                  },
                                  showConfirmButton: false,
                                  backdrop: "rgba(0, 0, 0, 0.6)",
                                  position: "top-start",
                                  allowOutsideClick: true,
                                  allowEscapeKey: true,
                                  didOpen: (popup) => {
                                    popup.style.position = "absolute";
                                    popup.style.top = `${rect.bottom + window.scrollY + 5
                                      }px`;
                                    popup.style.left = `${rect.left + window.scrollX
                                      }px`;
                                  },
                                });
                              }}
                            >
                              {Profile?.data?.Student?.parent_adhar_no?.length >
                                20
                                ? `${Profile?.data?.Student?.parent_adhar_no.slice(
                                  0,
                                  20
                                )}...`
                                : Profile?.data?.Student?.parent_adhar_no ||
                                "N/A"}
                            </span>
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Parent Account No</p>
                          <p className="text-lg font-semibold">
                            <span
                              className="cursor-pointer hover:text-blue-200 transition-colors"
                              onClick={(e) => {
                                const rect = e.target.getBoundingClientRect();
                                Swal.fire({
                                  title: "Parent Account Number",
                                  text:
                                    Profile?.data?.Student?.parent_account_no ||
                                    "N/A",
                                  customClass: {
                                    popup:
                                      "w-[400px] rounded-xl shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
                                    title: "text-2xl font-semibold",
                                    content: "text-lg",
                                    confirmButton: "hidden",
                                  },
                                  showConfirmButton: false,
                                  backdrop: "rgba(0, 0, 0, 0.6)",
                                  position: "top-start",
                                  allowOutsideClick: true,
                                  allowEscapeKey: true,
                                  didOpen: (popup) => {
                                    popup.style.position = "absolute";
                                    popup.style.top = `${rect.bottom + window.scrollY + 5
                                      }px`;
                                    popup.style.left = `${rect.left + window.scrollX
                                      }px`;
                                  },
                                });
                              }}
                            >
                              {Profile?.data?.Student?.parent_account_no
                                ?.length > 20
                                ? `${Profile?.data?.Student?.parent_account_no.slice(
                                  0,
                                  20
                                )}...`
                                : Profile?.data?.Student?.parent_account_no ||
                                "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">
                      Personal Details
                    </h3>
                    <div className="p-6 border rounded-2xl mt-6">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-6">
                        <div className="flex-1 min-w-[200px]">
                          <p
                            onClick={() =>
                              Swal.fire({
                                title: "View Payment History?",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate(`/student-payment-history/${id}`);
                                }
                              })
                            }
                            className="flex items-center gap-2 text-md font-semibold opacity-90 cursor-pointer hover:text-blue-900 transition-colors duration-200"
                            title="View payment history"
                          >
                            Count EMI
                          </p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.number_of_emi || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Aadhar Card No</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.adhar_no || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Pancard No</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.pancard_no || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">IFSC No</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.ifsc_no || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Ex School</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.ex_school || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Discount Amount</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.discount_amount || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">Final Amount</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.fees || "N/A"}
                          </p>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-sm">RT</p>
                          <p className="text-lg font-semibold">
                            {Profile.data?.Student?.rt === true
                              ? "YES"
                              : Profile.data?.Student?.rt === false
                                ? "N/A"
                                : "False"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        ) : (
          <div className="w-full flex items-center justify-center p-6 min-h-screen">
            <div className="p-8 sm:p-10 rounded-2xl max-w-2xl w-full dark:shadow-md dark:shadow-blue-500/50 shadow-lg transform transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold dark:text-gray-500">
                  Edit Student
                </h2>
                <button
                  onClick={closeModal}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 text-sm font-semibold transition-colors duration-200"
                >
                  <ArrowLeft size={18} />
                  <span>Back to profile</span>
                </button>
              </div>

              <FormProvider {...methods}>
                <form
                  onSubmit={formHandleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-6 mb-8">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Profile"
                        className="w-28 h-28 object-cover rounded-full border-4 border-indigo-100 shadow-sm transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <Avatar className="w-28 h-28 border-4 border-indigo-100 shadow-sm">
                        <AvatarImage
                          src={
                            Profile?.data?.Student?.profile_image
                              ? `${import.meta.env.VITE_BASE_URL
                              }/viewimagefromazure?filePath=${Profile?.data?.Student?.profile_image
                              }`
                              : avatar
                          }
                          alt="Profile"
                        />
                        <AvatarFallback>
                          <img src={avatar} alt="Fallback" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Button
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-200"
                      onClick={handleImageChange}
                    >
                      Upload Image
                    </Button>
                  </div>
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Student Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter student name"
                            {...field}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter address"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Father's Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter father's name"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="adharNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Aadhar Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Aadhar number"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter contact number"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Mother's Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter mother's name"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="parentAdharNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          parent Aadhar no.
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="parent Aadhar no."
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="parentAccountNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          parent Account no.
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="parent Account no.."
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="pancardNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          pancard no.
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="pancard no."
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="ifscNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          IFSC no.
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="IFSC no."
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="exSchool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Ex School
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ex School"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                            cursor-pointer dark:text-white dark:[color-scheme:dark]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="joining_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Joining Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                            className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                            cursor-pointer dark:text-white dark:[color-scheme:dark]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="adharUploadFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Adhar Upload Document
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="pancardUploadFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          pancard Upload Document
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Gender
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full mt-2 border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="selectedCourse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Course
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              methods.setValue("selectedBatch", "");
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full mt-2 border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500">
                              <SelectValue placeholder="--Select Course--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Courses</SelectLabel>
                                {coursesLoading ? (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    Loading courses...
                                  </div>
                                ) : coursesError ? (
                                  <div className="px-3 py-2 text-sm text-red-500">
                                    Error loading courses
                                  </div>
                                ) : Array.isArray(courses?.data) &&
                                  courses.data.length > 0 ? (
                                  courses.data.map((course) => (
                                    <SelectItem
                                      key={course.id}
                                      value={course.id.toString()}
                                    >
                                      {course.course_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    No courses available
                                  </div>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="selectedBatch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Batch
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              !selectedCourse ||
                              batchesLoading ||
                              !Array.isArray(batches?.data?.batches) ||
                              batches.data.batches.length === 0
                            }
                          >
                            <SelectTrigger className="w-full mt-2 border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500">
                              <SelectValue placeholder="--Select Batch--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Batches</SelectLabel>
                                {batchesLoading ? (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    Loading batches...
                                  </div>
                                ) : batchesError ? (
                                  <div className="px-3 py-2 text-sm text-red-500">
                                    Error loading batches
                                  </div>
                                ) : Array.isArray(batches?.data?.batches) &&
                                  batches.data.batches.length > 0 ? (
                                  batches.data.batches.map((batch) => (
                                    <SelectItem
                                      key={batch.id}
                                      value={batch.id.toString()}
                                    >
                                      {batch.BatchesName}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    No batches available
                                  </div>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  {Array.isArray(batches?.data?.batches) &&
                    batches.data.batches.length === 0 &&
                    selectedCourse && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md"
                            variant="outline"
                          >
                            + Add Batch
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto shadow-2xl p-8 rounded-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-center text-2xl font-semibold text-gray-900">
                              Add Batch
                            </DialogTitle>
                          </DialogHeader>

                          <FormProvider {...batchMethods}>
                            <form
                              onSubmit={batchHandleSubmit(onSubmit2)}
                              className="space-y-6"
                            >
                              <FormField
                                control={batchControl}
                                name="batchName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">
                                      Batch Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter Batch Name"
                                        {...field}
                                        className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm mt-1" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={batchControl}
                                name="course_id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 font-medium">
                                      Course
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={selectedCourse}
                                        disabled={true}
                                      >
                                        <SelectTrigger className="w-full mt-2 border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500">
                                          <SelectValue placeholder="Select a Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectLabel>Courses</SelectLabel>
                                            {Array.isArray(courses?.data) &&
                                              courses.data.map((course) => (
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
                                    <FormMessage className="text-red-500 text-sm mt-1" />
                                  </FormItem>
                                )}
                              />

                              <div className="flex items-center gap-4">
                                <FormField
                                  control={batchControl}
                                  name="starttime"
                                  render={({ field }) => (
                                    <FormItem className="w-full">
                                      <FormLabel className="text-gray-700 font-medium">
                                        Start Time
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="time"
                                          {...field}
                                          ref={startTimeRef}
                                          className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={batchControl}
                                  name="endtime"
                                  render={({ field }) => (
                                    <FormItem className="w-full">
                                      <FormLabel className="text-gray-700 font-medium">
                                        End Time
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="time"
                                          {...field}
                                          ref={endTimeRef}
                                          className="mt-2 w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-white transition-all duration-500 transform hover:-translate-y-0.5 shadow-md"
                              >
                                Confirm
                              </Button>
                            </form>
                          </FormProvider>
                        </DialogContent>
                      </Dialog>
                    )}

                  <FormField
                    control={control}
                    name="rt"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormLabel className="text-gray-700 font-medium">
                          RT
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 px-6 rounded-lg py-3 text-sm font-semibold text-white transition-all duration-200 transform shadow-md disabled:opacity-60 disabled:hover:bg-indigo-600"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Update Profile"}
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;
