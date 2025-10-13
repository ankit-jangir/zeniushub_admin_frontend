
import { AlertCircle, ArrowLeft, BookOpenCheck, Layers3 } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { updateNewStudent } from "../../../Redux_store/slices/StudentSlice";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import { useEffect, useRef } from "react";
import { fetchBatchesByCourseId } from "../../../Redux_store/Api/Batches";
import { Input } from "../../src/components/ui/input";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { Add_Batches } from "../../../Redux_store/Api/Batches";
import Swal from "sweetalert2";

// Zod Validation Schema for Course and Batch Selection
const validationSchema = z.object({
  selectedCourse: z.string().min(1, { message: "Course selection is required" }),
  selectedBatch: z.string().min(1, { message: "Batch selection is required" }),
});

// Zod Validation Schema for Adding a Batch
const batchSchema = z
  .object({
    batchName: z.string().min(1, "Batch name is required"),
    course_id: z.string().min(1, { message: "Course is required" }),
    Session_id: z.string().min(1, { message: "Session year is required" }),
    starttime: z.string().min(1, { message: "Start time is required" }),
    endtime: z.string().min(1, { message: "End time is required" }),
  })

const StudentSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  // Redux state
  const newStudent = useSelector((state) => state.students.newStudent);
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
  const { Session } = useSelector((state) => state.session || {});
 let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  // Main form for course and batch selection
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      selectedCourse: newStudent?.course_id?.toString() || "",
      selectedBatch: newStudent?.batch_id?.toString() || "",
    },
  });

  const selectedCourse = watch("selectedCourse");

  // Sync form with newStudent when it changes
  useEffect(() => {
    reset({
      selectedCourse: newStudent?.course_id?.toString() || "",
      selectedBatch: newStudent?.batch_id?.toString() || "",
    });
  }, [newStudent, reset]);

  // Fetch courses on mount
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

  // Fetch batches when selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourseId({courseId:selectedCourse, token})).catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch batches. Please try again.",
          confirmButtonColor: "#3085d6",
        });
      });
      // Only reset batch if the course has changed
      if (newStudent?.course_id?.toString() !== selectedCourse) {
        setValue("selectedBatch", "");
      }
    }
  }, [selectedCourse, dispatch, setValue, newStudent?.course_id]);

  // Handle main form submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        course_id: Number(data.selectedCourse),
        batch_id: Number(data.selectedBatch),
        ...Object.keys(newStudent).reduce((acc, key) => {
          if (newStudent[key] && key !== "course_id" && key !== "batch_id") {
            acc[key] = newStudent[key];
          }
          return acc;
        }, {}),
      };

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (newStudent.profile_image && newStudent.profile_image instanceof File) {
        formData.append("profile_image", newStudent.profile_image);
      }

      await dispatch(updateNewStudent(payload));
      navigate("/ParentDetails", { state: { formData: payload } });
      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
      //   text: "Course and batch updated successfully!",
      //   confirmButtonColor: "#3085d6",
      //   timer: 3000,
      // });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update course and batch. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Batch creation form
  const batchForm = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      course_id: selectedCourse || "",
      Session_id: "",
      starttime: "",
      endtime: "",
    },
  });

  // Update batch form's course_id when selectedCourse changes
  useEffect(() => {
    batchForm.setValue("course_id", selectedCourse || "");
  }, [selectedCourse, batchForm]);

  // Handle batch form submission
  const onSubmitBatch = async (data) => {
    const batchPayload = {
      course_id: Number(data.course_id),
      BatchesName: data.batchName,
      StartTime: `${data.starttime}:00`,
      EndTime: `${data.endtime}:00`,
      Session_id: Number(data.Session_id),
    };

    try {
      await dispatch(Add_Batches(batchPayload));
      if (selectedCourse) {
        await dispatch(fetchBatchesByCourseId({courseId:selectedCourse, token}));
      }
      batchForm.reset();
      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
      //   text: "Batch added successfully!",
      //   confirmButtonColor: "#3085d6",
      //   timer: 3000,
      // });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to add batch. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Handle form validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((err) => err.message)
        .join(", ");
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessages || "Please fix the form errors and try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  }, [errors]);

  // Handle Redux state errors
  useEffect(() => {
    if (coursesError || batchesError) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: coursesError || batchesError || "Something went wrong",
        confirmButtonColor: "#3085d6",
      });
    }
  }, [coursesError, batchesError]);

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-4 p-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2 transition duration-300 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="md:inline">Back</span>
        </Button>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="rounded-2xl w-full max-w-md p-8 shadow-md shadow-blue-500/50">
          {(coursesLoading || batchesLoading) && (
            <p className="text-center text-gray-600">Loading...</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-6">
              <label
                htmlFor="selectedCourse"
                className="font-semibold text-lg flex items-center gap-2 mb-2"
              >
                <BookOpenCheck size={18} /> Select Course{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="selectedCourse"
                className={`w-full border rounded-xl p-3 shadow-sm bg-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.selectedCourse ? "border-red-500" : "border-gray-300"
                }`}
                {...register("selectedCourse")}
              >
                <option  className="dark:text-black" value="">--Select Course--</option>
                {courses?.data?.map((course) => (
                  <option
                    className="text-black"
                    key={course.id}
                    value={course.id}
                  >
                    {course.course_name}
                  </option>
                ))}
              </select>
              {errors.selectedCourse && (
                <div className="mt-1 flex items-center gap-2 text-red-600 text-sm border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle size={16} />
                  <span>{errors.selectedCourse.message}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="selectedBatch"
                className="font-semibold text-lg flex items-center gap-2 mb-2"
              >
                <Layers3 size={18} /> Select Batch{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="selectedBatch"
                className={`w-full border rounded-xl p-3 shadow-sm bg-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.selectedBatch ? "border-red-500" : "border-gray-300"
                }`}
                {...register("selectedBatch")}
                aria-invalid={errors.selectedBatch ? "true" : "false"}
                disabled={!selectedCourse || batchesLoading}
              >
                <option className="dark:text-black" value="">--Select Batch--</option>
                {batches?.data?.batches?.length > 0 ? (
                  batches?.data?.batches?.map((batch) => (
                    <option
                      className="text-black"
                      key={batch.id}
                      value={batch.id}
                    >
                      {batch.BatchesName} 
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No batches available
                  </option>
                )}
              </select>

              {batches?.data?.batches?.length === 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      variant="outline"
                    >
                      + Add Batch
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
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
                        onSubmit={batchForm.handleSubmit(onSubmitBatch)}
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
                              <FormLabel>Course</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!!selectedCourse}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Course" />
                                  </SelectTrigger>
                                  <SelectContent>
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

                        <FormField
                          control={batchForm.control}
                          name="Session_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Year</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Session Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Sessions</SelectLabel>
                                      {Session?.map((session) => (
                                        <SelectItem
                                          key={session.id}
                                          value={session.id.toString()}
                                        >
                                          {session.session_year ||
                                            `Session ${session.id}`}
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
                            control={batchForm.control}
                            name="starttime"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    ref={startTimeRef}
                                    onFocus={() =>
                                      startTimeRef.current?.focus()
                                    }
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
                                    type="time"
                                    {...field}
                                    ref={endTimeRef}
                                    onFocus={() =>
                                      endTimeRef.current?.focus()
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                          Confirm
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}

              {errors.selectedBatch && (
                <div className="mt-1 flex items-center gap-2 text-red-600 text-sm border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle size={16} />
                  <span>{errors.selectedBatch.message}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg w-full max-w-xs h-10 text-lg disabled:opacity-50"
                disabled={coursesLoading || batchesLoading}
              >
                Proceed
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectionPage;