
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { AlertCircle, ArrowLeft, IdCard, Phone } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { Label } from "../../src/components/ui/label";
import { Input } from "../../src/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNewStudent } from "../../../Redux_store/slices/StudentSlice";
import { check } from "../../../Redux_store/Api/StudentsApiStore";
import Swal from "sweetalert2";
import { useState } from "react";

// Zod schema for validation
// Verhoeff checksum implementation
const d = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];

const p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,9,3,0,1],
  [2,7,9,3,8,0,4,6,1,5],
  [7,0,4,6,9,1,3,2,5,8]
];

function validateVerhoeff(num) {
  let c = 0;
  const myArray = num.split("").reverse().map(Number);
  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[(i % 8)][myArray[i]]];
  }
  return c === 0;
}

const schema = z.object({
  contact_no: z
        .string({
            required_error: 'Mobile number is required.',
            invalid_type_error: 'Mobile number must be a string.',
        })
        .regex(
            /^[6-9][0-9]{9}$/,
            'Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9 (only digits allowed).'
        ).refine(
            (val) => !/^(\d)\1{9}$/.test(val),
            {
                message: 'Mobile number cannot have all digits the same (e.g., 6666666666).',
            }
        ),
  adhar_no: z
    .string()
    .length(12, "Aadhaar must be 12 digits")
    .regex(/^[2-9]\d{11}$/, "Aadhaar must start with digits 2-9 and be numeric")
    .refine((val) => validateVerhoeff(val), {
      message: "Invalid Aadhaar number (checksum failed)"
    }),
});


const ProceedModal = () => {
   let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newStudent = useSelector((state) => state.students.newStudent);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      contact_no: newStudent.contact_no || "",
      adhar_no: newStudent.adhar_no || "",
    },
     mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Step 1: Check Aadhaar and Contact Number via API
      const checkResult = await dispatch(
        check({studentData: { adhar_no: data.adhar_no, contact_no: data.contact_no }, token})
      ).unwrap();

      // Step 2: Check if Aadhaar or Contact Number already exists
      if (checkResult.exists === true) {
        throw new Error(
          checkResult.message || "Aadhaar or Contact Number already exists"
        );
      }

      // Step 3: Proceed if no match is found
      const { contact_no, adhar_no, ...otherFields } = newStudent;
      const payload = {
        contact_no: data.contact_no,
        adhar_no: data.adhar_no,
        ...Object.fromEntries(
          Object.entries(otherFields).filter(([_, value]) => value)
        ),
      };

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("payload", JSON.stringify(payload));

      // Append file fields if they exist
      if (newStudent.profile_image && newStudent.profile_image instanceof File) {
        formDataToSend.append("profile_image", newStudent.profile_image);
      }

      // Log FormData for debugging
      // for (let [key, value] of formDataToSend.entries()) {
      //   console.log(key, value);
      // }

      // Dispatch updateNewStudent
      dispatch(updateNewStudent(payload));

      // Navigate to the next page
      navigate("/StudentSelectionPage", { state: { formData: payload } });
    } catch (error) {
      

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error || "Something went wrong while checking Aadhaar or Contact number",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
 
    } finally {
      setIsLoading(false);
    }
  };

  const goback = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex items-center gap-4 p-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2 transition duration-300 shadow-md"
          onClick={goback}
        >
          <ArrowLeft size={18} />
          <span className="hidden md:inline">Back</span>
        </Button>
      </div>
      <div className="mx-auto border rounded-2xl h-auto min-h-[320px] max-w-4xl shadow-md shadow-blue-500/50 p-8 mt-5">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">
          Enter Additional Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Number Field */}
          <div>
            <Label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Phone size={18} /> Enter Contact No. *
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              {...register("contact_no")}
              className={`w-full h-12 border rounded-xl p-3 bg-transparent ${
                errors.contact_no ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Phone number"
              maxLength={10}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.contact_no && (
              <div className="mt-1 flex items-center gap-2 text-red-600 text-sm border border-red-200 rounded-md px-3 py-2">
                <AlertCircle size={16} />
                <span>{errors.contact_no.message}</span>
              </div>
            )}
          </div>

          {/* Aadhaar Number Field */}
          <div>
            <Label className="font-semibold text-lg mb-2 flex items-center gap-2">
              <IdCard size={18} /> Enter Aadhaar Number *
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              {...register("adhar_no")}
              className={`w-full h-12 border rounded-xl p-3 bg-transparent ${
                errors.adhar_no ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Aadhaar number (12 digits)"
              maxLength={12}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.adhar_no && (
              <div className="mt-1 flex items-center gap-2 text-red-600 text-sm border border-red-200 rounded-md px-3 py-2">
                <AlertCircle size={16} />
                <span>{errors.adhar_no.message}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white px-10 py-3 rounded-lg w-full sm:w-[200px] text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Proceed"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProceedModal;
