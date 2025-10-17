import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Checkbox } from "../../src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { addEmis, addOneShotEmis, showEmis } from "../../../Redux_store/Api/EmisApiStore";
import { getSingleStudent } from "../../../Redux_store/Api/StudentsApiStore";
import { hideStatus, showStatus } from "../../../Redux_store/slices/Status_slice";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";

// Zod schema for form validation
const baseSchema = {
  student_id: z.number().min(1, "Student ID is required"),
  grandTotal: z
    .number({ invalid_type_error: "Grand Total is required" })
    .min(1, "Grand Total must be greater than 0"),
  discount: z
    .number({ invalid_type_error: "Discount amount is required" })
    .min(0, "Discount cannot be negative"),
};

const emiSchema = z.object({
  ...baseSchema,
  paymentType: z.literal("Pay in EMIs"),
  emi_frequency: z.enum(["1", "4", "6", "12"], {
    errorMap: () => ({ message: "EMI Frequency is required" }),
  }),
});

const oneShotSchema = z.object({
  ...baseSchema,
  paymentType: z.literal("Pay in One Shot"),
  dueDate: z.string().nonempty("Due date is required"),
});

const PaymentSchema = z.discriminatedUnion("paymentType", [
  emiSchema,
  oneShotSchema,
]);

const Add_Payment = ({ studentId, back, studentEnrollmentId }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dueInputRef = useRef(null);

  const [selected, setSelected] = useState("Pay in EMIs");
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [coursePrice, setCoursePrice] = useState(0);
  let token = localStorage.getItem("token");
  // Select Redux states
  const { loading: emisLoading, error: emisError, data: emisData } = useSelector(
    (state) => state.emis || {}
  );
  const {
    data: studentCourseData,
    loading: courseLoading,
    error: courseError,
    students,
  } = useSelector((state) => state.students || {});

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      student_id: studentId,
      grandTotal: 0,
      discount: 0,
      paymentType: "Pay in EMIs",
      emi_frequency: "",
      dueDate: "",
    },
  });

  const emi_frequency = watch("emi_frequency");
  const discount = watch("discount");

  // Fetch student data if not available
  useEffect(() => {
    if (!students?.data && !courseLoading && !courseError) {
      dispatch(getSingleStudent({ id: studentEnrollmentId, token },));
    }
  }, [dispatch, studentId, students, courseLoading, courseError, studentEnrollmentId]);

  // Set course price and grand total
  useEffect(() => {
    const selectedStudent = students?.data?.find((el) => studentId == el.id);
    const price = selectedStudent?.enrollment?.Course?.course_price || 0;
    setCoursePrice(price);
    setValue("grandTotal", price, { shouldValidate: true });
  }, [students, studentId, setValue]);

  // Fetch EMI schedule when emi_frequency and discount are provided
  useEffect(() => {
    if (
      selected === "Pay in EMIs" &&
      emi_frequency &&
      studentId &&
      discount >= 0
    ) {
      const fetchEmiSchedule = async () => {
        try {
          const filters = {
            id: studentEnrollmentId,
            emi_frequency: parseInt(emi_frequency),
            discount_percentage: parseInt(discount),
          };
          console.log("Calling showEmis with filters:", filters);
          const result = await dispatch(showEmis({ filters, token })).unwrap();
          console.log("showEmis response:", result);
          if (result && result.data && Array.isArray(result.data.emi_preview)) {
            const currentDate = new Date();
            setEmiSchedule(
              result.data.emi_preview.map((emi, index) => {
                const dueDate = new Date(emi.due_date);
                return {
                  emiId: index + 1,
                  studentId: studentId,
                  amount: emi.amount.toFixed(2),
                  paymentStatus: "Unpaid",
                  paymentDate: "N/A",
                  dueDate: format(dueDate, "M/d/yyyy"),
                  status: dueDate < currentDate ? "Missed" : "Upcoming",
                };
              })
            );
          } else {
            throw new Error("Invalid API response: 'emi_preview' array not found");
          }
        } catch (err) {
          console.error("showEmis API error:", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Failed to fetch EMI schedule: ${err.message || "Unknown error"}`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      };
      fetchEmiSchedule();
    } else {
      setEmiSchedule([]);
    }
  }, [emi_frequency, discount, studentId, selected, dispatch]);

  // Form submission handler
  const onSubmit = async (data) => {
    // Check if EMIs already exist
    if (emisData && Array.isArray(emisData) && emisData.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "EMIs already exist for this student!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      dispatch(hideStatus());
      return;
    }

    // Prepare EMI data for API
    const emiData = {
      enrollment_id: data.student_id,
      amount: parseInt(data.grandTotal),
      ...(data.paymentType === "Pay in EMIs" && {
        discount_percentage: parseInt(data.discount),
        emi_frequency: parseInt(data.emi_frequency),
        emis: emiSchedule.map((emi) => ({
          id: emi.emiId,
          due_date: format(new Date(emi.dueDate), "yyyy-MM-dd"),
          amount: parseInt(emi.amount),
        })),
      }),
      ...(data.paymentType === "Pay in One Shot" && {
        discount_percentage: parseInt(data.discount),
        emi_duedate: data.dueDate,
        student_id: studentEnrollmentId
      }),
    };

    console.log("Submitting data:", emiData);

    try {
      let result;
      if (data.paymentType === "Pay in EMIs") {
        result = await dispatch(addEmis({ emiData, token })).unwrap();
        console.log("addEmis successful:", result, "emisLoading:", emisLoading);
      } else {
        result = await dispatch(addOneShotEmis({ emiData, token })).unwrap();
        console.log(
          "addOneShotEmis successful:",
          result,
          "emisLoading:",
          emisLoading
        );
      }

      // Show success notification
      await Swal.fire({
        title: "Success!",
        text: "Payment added successfully!",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Dispatch success status and navigate
      dispatch(
        showStatus({ type: "success", message: "Payment added successfully!" })
      );
      navigate(`/student-payment-history/${studentEnrollmentId}`);
    } catch (err) {
      console.log(err, "######################################");

      console.error(
        data.paymentType === "Pay in EMIs"
          ? "addEmis API error:"
          : "addOneShotEmis API error:",
        err,
        "emisLoading:",
        emisLoading
      );

      // Show error notification
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to add payment: ${err || "Unknown error"}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Dispatch error status
      dispatch(
        showStatus({
          type: "error",
          message: `Failed to add payment: ${err || "Unknown error"}`,
        })
      );
      setTimeout(() => dispatch(hideStatus()), 3000);
    }
  };

  // Handle "Mark as Paid" (not implemented)
  const handleMarkAsPaid = (emiId) => {
    Swal.fire({
      icon: "info",
      title: "Feature Not Implemented",
      text: "Mark as Paid functionality is not yet implemented.",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  // Handle back navigation
  const goback = () => {
    if (back) {
      back();
    } else {
      navigate("/Batches");
    }
  };

  const selectedStudent = students?.data?.find((el) => studentId == el.id);
  console.log(selectedStudent, "!!!!!!!!!!!!!!!!!!!!!!!!!!");


  return (
    <div className="p-6">
      {/* Student Details */}
      {selectedStudent && (
        <div className="shadow-lg p-4 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800">
            Student Details
          </h3>
          <div className="mt-2">
            <p className="text-gray-600  dark:text-white">
              <span className="font-medium">Name:</span> {selectedStudent.name}
            </p>
            <p className="text-gray-600 dark:text-white">
              <span className="font-medium">Enrollment ID:</span>{" "}
              {selectedStudent.enrollment_id}
            </p>
            <p className="text-gray-600 dark:text-white">
              <span className="font-medium">Joining Date:</span>{" "}
              {selectedStudent.joining_date}
            </p>
          </div>
        </div>
      )}

      {/* Payment Setup Form */}
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Setup Payment
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 p-6 rounded-lg shadow-md"
      >
        {/* Grand Total */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700 dark:text-white  ">
            Grand Total <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="₹"
            value={coursePrice}
            className="w-full h-14 text-lg border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
            {...register("grandTotal", { valueAsNumber: true })}
            disabled={courseLoading}
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.grandTotal?.message}
          </p>
          {courseError && (
            <p className="text-red-500 text-sm mt-1">
              Failed to fetch course price: {courseError}
            </p>
          )}
        </div>

        {/* Payment Type Selection */}
        <div className="flex flex-wrap gap-4">
          {["Pay in EMIs", "Pay in One Shot"].map((type) => (
            <div
              key={type}
              className={`flex items-center gap-3 px-5 py-3 border rounded-xl shadow-sm cursor-pointer transition-all ${selected === type
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
                }`}
            >

              <Checkbox
                id={type}
                checked={selected === type}
                onCheckedChange={() => {
                  setSelected(type);
                  setValue("paymentType", type, { shouldValidate: true });
                }}
              />
              <label
                htmlFor={type}
                className="text-base font-medium text-gray-700 cursor-pointer"
                onClick={() => {
                  setSelected(type);
                  setValue("paymentType", type, { shouldValidate: true });
                }}
              >
                {type}
              </label>
            </div>
          ))}
        </div>

        {/* EMI or One Shot Fields */}
        {selected === "Pay in EMIs" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Percentage */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700 dark:text-white">
                Discount Percentage <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter Percentage"
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                {...register("discount", { valueAsNumber: true })}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.discount?.message}
              </p>
            </div>

            {/* EMI Frequency */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700 dark:text-white">
                EMI Frequency <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  setValue("emi_frequency", value, { shouldValidate: true });
                }}
                value={emi_frequency || ""}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md">
                  <SelectValue placeholder="Select EMI Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monthly</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="6">Semester</SelectItem>
                  <SelectItem value="12">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm mt-1">
                {errors.emi_frequency?.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Percentage */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700 dark:text-white">
                Discount Percentage <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter Percentage"
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                {...register("discount", { valueAsNumber: true })}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.discount?.message}
              </p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-lg font-medium mb-1 text-gray-700 dark:text-white">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  dueInputRef.current?.showPicker();
                }}
                className="w-full justify-between text-gray-700 border-gray-300 rounded-md"
              >
                {watch("dueDate")
                  ? format(new Date(watch("dueDate")), "dd/MM/yyyy")
                  : "Pick a date"}
                <CalendarIcon className="w-5 h-5 ml-2" />
              </Button>
              <Input
                type="date"
                ref={dueInputRef}
                className="absolute opacity-0 -z-10"
                onChange={(e) =>
                  setValue("dueDate", e.target.value, { shouldValidate: true })
                }
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate?.message}
              </p>
            </div>
          </div>
        )}

        {/* EMI Schedule Table */}
        {selected === "Pay in EMIs" && emiSchedule.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              EMI Schedule
            </h3>
            <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="w-full table-auto">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border-b border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      Sr no
                    </th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      Amount (₹)
                    </th>
                    <th className="border-b border-gray-300 px-4 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emiSchedule.map((emi, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="border-b border-gray-200 px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                        ₹{emi.amount}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {emi.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="px-8 py-3 text-xl bg-blue-900 hover:bg-blue-800 text-white rounded-md"
            disabled={emisLoading || !isValid}
          >
            {emisLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Add_Payment;