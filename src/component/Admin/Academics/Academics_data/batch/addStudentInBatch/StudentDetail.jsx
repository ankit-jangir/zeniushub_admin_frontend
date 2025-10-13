import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  setProfileImage,
  updateNewStudent,
} from "../../../../../../Redux_store/slices/StudentSlice";
import {
  ArrowLeft,
  Calendar,
  User,
  UserCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../src/components/ui/select";
import { Button } from "../../../../../src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../src/components/ui/avatar";
import { toast } from "react-toastify";
import { Label } from "../../../../../src/components/ui/label";
import Swal from "sweetalert2";
import { Input } from "../../../../../src/components/ui/input";

// Zod schema for validation
const addSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed"),
  gender: z.string().min(1, "Gender selection is required"),
  address: z.string().min(1, "Address is required"),
  dob: z
    .string()
    .min(1, "Date of Birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format"),
  joining_date: z
    .string()
    .min(1, "Joining Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining Date must be in YYYY-MM-DD format"),
});

const StudentDetail = () => {
  const { courseId, batchId, courseName, batchName, sessionId, sessionYear } =
    useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newStudent = useSelector((state) => state.students.newStudent || {});
  const inputRef = useRef(null);
  const joining_dateInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: newStudent?.name || "",
      gender: newStudent?.gender || "",
      address: newStudent?.address || "",
      dob: newStudent?.dob ? newStudent.dob.slice(0, 10) : "",
      joining_date: newStudent?.joining_date
        ? newStudent.joining_date.slice(0, 10)
        : "",
    },
  });

  useEffect(() => {
    console.log("newStudent on mount/update:", newStudent); // Debug log

    // Set form values from Redux store
    setValue("name", newStudent?.name || "");
    setValue("gender", newStudent?.gender || "");
    setValue("address", newStudent?.address || "");
    setValue("dob", newStudent?.dob ? newStudent.dob.slice(0, 10) : "");
    setValue(
      "joining_date",
      newStudent?.joining_date ? newStudent.joining_date.slice(0, 10) : ""
    );

    // Handle profile image
    if (newStudent?.profile_image && !selectedImage) {
      const imageUrl = URL.createObjectURL(newStudent.profile_image);
      setSelectedImage(imageUrl);
    }

    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [newStudent, setValue, selectedImage]);

  const validateDate = (dateValue, fieldName) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateValue)) {
      return `${
        fieldName === "dob" ? "Date of Birth" : "Joining Date"
      } must be in YYYY-MM-DD format`;
    }

    const selectedDate = new Date(dateValue);
    if (isNaN(selectedDate.getTime())) {
      return "Invalid date format";
    }

    if (fieldName === "joining_date") {
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        return "Joining date cannot be in the future.";
      }
    }

    return true;
  };

  const handleDateChange = (value, fieldName, setValueField) => {
    if (value) {
      const validationResult = validateDate(value, fieldName);
      if (validationResult === true) {
        setValue(setValueField, value, { shouldValidate: true });
        clearErrors(setValueField);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Invalid Date",
          text: validationResult,
        });
        setValue(setValueField, "", { shouldValidate: true });
      }
    } else {
      setValue(setValueField, "", { shouldValidate: true });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(setProfileImage(file));
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not assigned");
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        address: data.address,
        gender: data.gender,
        dob: new Date(data.dob).toISOString(),
        joining_date: new Date(data.joining_date).toISOString(),
        session_id: Number(sessionId),
      };
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (newStudent?.profile_image instanceof File) {
        formData.append(
          "profile_image",
          newStudent.profile_image,
          newStudent.profile_image.name
        );
      }

      dispatch(updateNewStudent(payload));
      navigate(
        `/Extra_Detail/${courseId}/${batchId}/${courseName}/${batchName}/${sessionId}/${sessionYear}`,
        { state: { formData: payload } }
      );
    } catch (error) {
      toast.error("Failed to submit student details. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 mt-5">
        <Button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2 transition duration-300 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="hidden md:inline">Back to Student</span>
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 shadow-md shadow-blue-200 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Add Student Details
        </h2>

        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <Avatar className="w-full h-full shadow-md rounded-full">
              {selectedImage ? (
                <AvatarImage
                  src={selectedImage}
                  alt="Profile Image"
                  className="rounded-full border-4 border-blue-600 object-cover"
                />
              ) : (
                <AvatarFallback className="rounded-full">CN</AvatarFallback>
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
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-9"
        >
          {/* Name */}
          <div className="relative">
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <User size={18} /> Name *
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border border-gray-300 bg-transparent rounded-xl p-3 shadow-lg ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Your name"
                />
              )}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-100 p-2 rounded-md">
                <AlertCircle size={16} />
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <UserCircle size={18} /> Select Gender *
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("gender", value, { shouldValidate: true });
                    clearErrors("gender");
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger
                    className={`w-full border border-gray-300 rounded-xl h-12 p-3 shadow-lg ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-100 p-2 rounded-md">
                <AlertCircle size={16} />
                <span>{errors.gender.message}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <User size={18} /> Enter Address *
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border border-gray-300 bg-transparent rounded-xl p-3 shadow-lg ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your address"
                />
              )}
            />
            {errors.address && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-100 p-2 rounded-md">
                <AlertCircle size={16} />
                <span>{errors.address.message}</span>
              </div>
            )}
          </div>

          {/* DOB */}
          <div className="relative">
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calendar size={18} /> Enter DOB *
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  ref={inputRef}
                  className={`w-full h-[3.3rem] border rounded-xl p-3 shadow-lg ${
                    errors.dob ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDateChange(e.target.value, "dob", "dob");
                  }}
                />
              )}
            />
            {errors.dob && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-100 p-2 rounded-md">
                <AlertCircle size={16} />
                <span>{errors.dob.message}</span>
              </div>
            )}
          </div>

          {/* Joining Date */}
          <div className="relative">
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calendar size={18} /> Enter Joining Date *
            </label>
            <Controller
              name="joining_date"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  ref={joining_dateInputRef}
                  className={`w-full h-[3.3rem] border rounded-xl p-4 shadow-lg ${
                    errors.joining_date ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={(e) => {
                    field.onChange(e);
                    handleDateChange(
                      e.target.value,
                      "joining_date",
                      "joining_date"
                    );
                  }}
                />
              )}
            />
            {errors.joining_date && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-100 p-2 rounded-md">
                <AlertCircle size={16} />
                <span>{errors.joining_date.message}</span>
              </div>
            )}
          </div>
          {/* Session Year - Readonly Input */}
          <div>
            <label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calendar size={18} /> Session Year
            </label>
            <Input
              type="text"
              value={sessionYear}
              readOnly
              className="w-full border border-gray-300 cursor-not-allowed rounded-xl p-3 py-6 shadow-lg"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-center">
            <Button
              type="submit"
              className="bg-blue-700 hover:bg-blue-500 px-10 py-3 rounded-lg text-white"
            >
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetail;
