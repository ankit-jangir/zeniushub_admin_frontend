import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStudent } from "../../../Redux_store/Api/StudentsApiStore";
import {
  updateNewStudent,
  resetNewStudent,
} from "../../../Redux_store/slices/StudentSlice";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import { Label } from "../../src/components/ui/label";
import { Card, CardContent } from "../../src/components/ui/card";
import { ArrowLeft, Hash } from "lucide-react";
import Swal from "sweetalert2";

// Zod schema for validation
const zodSchema = z.object({
  mother_name: z
    .string()
    .min(1, "mother Name is required")
    .max(80, "mother Name must not exceed 80 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed"),
      father_name: z
    .string()
    .min(1, "father Name is required")
    .max(80, "father Name must not exceed 80 characters")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets (A-Z, a-z) and spaces are allowed"),
});

const ParentDetails = () => {
   let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { newStudent, loading } = useSelector((state) => state.students);
  const profile_image = useSelector((state) => state.students.profile_image);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      father_name: newStudent.father_name || "",
      mother_name: newStudent.mother_name || "",
    },
     mode: "onChange",
  });

  // Reset form with latest Redux state when newStudent changes
  React.useEffect(() => {
    reset({
      father_name: newStudent.father_name || "",
      mother_name: newStudent.mother_name || "",
    });
  }, [newStudent, reset]);

  const onSubmit = async (data) => {
    // Dynamically get all fields from newStudent, excluding father_name, mother_name, and profile_image
    const requiredFields = Object.keys(newStudent).filter(
      (key) =>
        key !== "father_name" &&
        key !== "mother_name" &&
        key !== "profile_image"
    );

    // Check for missing or empty fields in newStudent
    const missingFields = requiredFields.filter(
      (field) =>
        !newStudent[field] || newStudent[field].toString().trim() === ""
    );

    // Check if form fields (father_name, mother_name) are valid
    if (missingFields.length > 0 || errors.father_name || errors.mother_name) {
      // Prepare the message for missing fields
      let errorMessage = "Please fill in all required fields:";
      if (missingFields.length > 0) {
        errorMessage += `<br/> - ${missingFields.join("<br/> - ")}`;
      }
      if (errors.father_name) {
        errorMessage += `<br/> - Father's Name: ${errors.father_name.message}`;
      }
      if (errors.mother_name) {
        errorMessage += `<br/> - Mother's Name: ${errors.mother_name.message}`;
      }

      // Show SweetAlert2 error message
      await Swal.fire({
        icon: "error",
        title: "Missing Fields",
        html: errorMessage,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return; // Prevent form submission
    }

    try {
      const payload = {
        father_name: data.father_name,
        mother_name: data.mother_name,
        ...Object.keys(newStudent).reduce((acc, key) => {
          if (
            newStudent[key] &&
            key !== "father_name" &&
            key !== "mother_name"
          ) {
            acc[key] = newStudent[key];
          }
          return acc;
        }, {}),
      };

      const formData = new FormData();
      // Append the payload as a JSON string
      formData.append("payload", JSON.stringify(payload));
      dispatch(updateNewStudent(payload));
      const completeData = { ...newStudent, ...data, profile_image };

      const result = await dispatch(addStudent({studentData:completeData, token})).unwrap();

      if (result) {
        dispatch(resetNewStudent());
        // SweetAlert2 Success Alert with timer
        await Swal.fire({
          title: "Success!",
          text: "Student added successfully",
          icon: "success",
          draggable: true,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Navigate after alert closes
        navigate("/students", { replace: true });
      }
    } catch (error) {
      console.log(error, "raw error");

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        html: error || "An error occurred while updating the student",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const goBack = () => {
    // Update Redux store with current form values before navigating back
    const currentFormValues = getValues();
    dispatch(
      updateNewStudent({
        ...newStudent,
        father_name: currentFormValues.father_name,
        mother_name: currentFormValues.mother_name,
      })
    );
    navigate(-1);
  };

  return (
    <div>
      <Button
        onClick={goBack}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2 transition duration-300 shadow-md mt-3"
      >
        <ArrowLeft size={18} />
        <span className="hidden md:inline">Back</span>
      </Button>

      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-4xl rounded-2xl shadow-md shadow-blue-500/50 p-8 mt-5">
          <CardContent>
            <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">
              Enter Parent Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
              {/* Father's Name */}
              <div className="relative">
                <Label className="font-semibold text-lg sm:text-xl mb-2 flex items-center gap-2">
                  <Hash size={20} /> Father's Name
                </Label>
                <Input
                  {...register("father_name")}
                  className={`w-full pl-10 border ${
                    errors.father_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl p-3 sm:p-5`}
                  placeholder="Enter Father's Name"
                  aria-invalid={errors.father_name ? "true" : "false"}
                />
                {errors.father_name && (
                  <p className="text-red-500">{errors.father_name.message}</p>
                )}
              </div>

              {/* Mother's Name */}
              <div className="relative">
                <Label className="font-semibold text-lg sm:text-xl mb-2 flex items-center gap-2">
                  <Hash size={20} /> Mother's Name
                </Label>
                <Input
                  {...register("mother_name")}
                  className={`w-full pl-10 border ${
                    errors.mother_name ? "border-red-500" : "border-gray-300"
                  } rounded-xl p-3 sm:p-5`}
                  placeholder="Enter Mother's Name"
                  aria-invalid={errors.mother_name ? "true" : "false"}
                />
                {errors.mother_name && (
                  <p className="text-red-500">{errors.mother_name.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <Button
                  type="submit"
                  className="w-56 bg-blue-700 text-white text-lg py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Add Parent Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDetails;
