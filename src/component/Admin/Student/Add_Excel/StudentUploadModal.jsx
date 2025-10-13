import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Label } from "../../../src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/ui/select";
import { Card, CardContent } from "../../../src/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useRef } from "react";
import { addStudentsExcel } from "../../../../Redux_store/Api/StudentsApiStore";
import { get_course } from "../../../../Redux_store/Api/Academic_course";
import { fetchBatchesByCourseId } from "../../../../Redux_store/Api/Batches";
import { Add_Batches } from "../../../../Redux_store/Api/Batches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import Swal from 'sweetalert2'; // Import SweetAlert2

// Zod schema for form validation
const studentSchema = z.object({
  course: z.string().min(1, "Course selection is required"),
  batch: z.string().min(1, "Batch selection is required"),
  file: z
    .instanceof(File)
    .refine((file) => !!file, "A file is required")
    .refine(
      (file) =>
        [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(file.type) ||
        ["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase()),
      "Only .xlsx or .xls files are allowed"
    ),
});
const batchSchema = z
  .object({
    batchName: z.string().min(1, "Batch name is required"),
    course_id: z.string().min(1, { message: "Course is required" }),
    Session_id: z.string().min(1, { message: "Session year is required" }),
    starttime: z.string().min(1, { message: "Start time is required" }),
    endtime: z.string().min(1, { message: "End time is required" }),
  })
 

export default function StudentUploadModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
 let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  // Redux state selectors
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.students || {});
  const {
    batches,
    loading: batchesLoading,
    error: batchesError,
  } = useSelector((state) => state.Batch || {});
  const {
    course: courses = { data: [] },
    loading: coursesLoading,
    error: coursesError,
  } = useSelector((state) => state.courses || {});
  const { Session } = useSelector((state) => state.session || {});

  // Form setup with react-hook-form
  const form1 = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      course: "",
      batch: "",
      file: null,
    },
  });
  const { register, handleSubmit, setValue, setError, clearErrors, control } = form1;

  // Watch the course field to trigger batch fetching
  const selectedCourse = useWatch({ control, name: "course" });

  // Fetch courses on mount if not already loaded
  useEffect(() => {
    if (!courses?.data?.length) {
      dispatch(get_course(token));
    }
  }, [dispatch, courses?.data?.length]);

  // Fetch batches when course changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourseId({courseId:selectedCourse, token}));
      setValue("batch", "");
    }
  }, [selectedCourse, dispatch, setValue]);

  const sessionID = useSelector((state) => state.session?.selectedSession);
  // Show SweetAlert2 for API errors
  // useEffect(() => {
  //   if (studentsError) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: studentsError || 'Failed to upload students. Please try again.',
  //       confirmButtonColor: '#d33',
  //     });
  //   }
  //   if (batchesError) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: batchesError || 'Failed to fetch batches. Please try again.',
  //       confirmButtonColor: '#d33',
  //     });
  //   }
  //   if (coursesError) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: coursesError || 'Failed to fetch courses. Please try again.',
  //       confirmButtonColor: '#d33',
  //     });
  //   }
  // }, [studentsError, batchesError, coursesError]);

  // Handle form submission
  
  const onSubmit = async (data) => {
    try {
      await dispatch(
        addStudentsExcel({
          file: data.file,
          batch_id: parseInt(data.batch, 10),
          course_id: parseInt(data.course, 10),
          session_id: sessionID,
          token
        })
      ).unwrap();
      navigate("/students", {
        state: { success: "Students uploaded successfully!" },
      });
    } catch (error) {
     
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error || 'Failed to upload students. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      course_id: selectedCourse || "",
      Session_id: "",

      starttime: "",
      endtime: "",
    },
  });

  useEffect(() => {
    form.setValue("course_id", selectedCourse || "");
  }, [selectedCourse, form]);

  // Handle file input change
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        setError("file", { type: "manual", message: "A file is required" });
        return;
      }
      setValue("file", file);
      clearErrors("file");
    },
    [setValue, setError, clearErrors]
  );

  const onSubmit2 = async (data) => {
    const batchPayload = {
      course_id: Number(data.course_id),
      BatchesName: data.batchName,
      StartTime: `${data.starttime}:00`,
      EndTime: `${data.endtime}:00`,
      Session_id: Number(data.Session_id),
    };

    try {
      await dispatch(Add_Batches(batchPayload)).unwrap();
      if (selectedCourse) {
        await dispatch(fetchBatchesByCourseId({courseId:selectedCourse, token}));
      }
      form.reset();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Batch added successfully!',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add batch. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div>
      <Button className="bg-blue-500 m-3" onClick={goBack}>
        <FaArrowLeftLong aria-label="Navigate back to previous page" role="button" />
        Back To Students
      </Button>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl rounded-xl p-8 shadow-md shadow-blue-500/50">
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Selection */}
              <div>
                <Label htmlFor="course" className="text-lg font-semibold">
                  Select Course <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("course", value);
                    clearErrors("course");
                  }}
                  value={selectedCourse}
                >
                  <SelectTrigger
                    id="course"
                    className="h-12 rounded-xl border-gray-300"
                    aria-describedby={form1.formState.errors.course ? "course-error" : undefined}
                  >
                    <SelectValue placeholder="--Select Course--" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesLoading && <SelectItem disabled>Loading...</SelectItem>}
                    {courses?.data?.length > 0 ? (
                      courses.data.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.course_name} 
                          {/* {course.id} */}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No courses available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {form1.formState.errors.course && (
                  <p id="course-error" className="mt-1 text-sm text-red-500">
                    {form1.formState.errors.course.message}
                  </p>
                )}
              </div>

              {/* Batch Selection */}
              <div>
                <Label htmlFor="batch" className="text-lg font-semibold">
                  Select Batch <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("batch", value);
                    clearErrors("batch");
                  }}
                >
                  <SelectTrigger
                    id="batch"
                    className="h-12 rounded-xl border-gray-300"
                    aria-describedby={form1.formState.errors.batch ? "batch-error" : undefined}
                  >
                    <SelectValue placeholder="--Select Batch--" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchesLoading && <SelectItem disabled>Loading...</SelectItem>}
                    {batches?.data?.batches?.length > 0 ? (
                      batches?.data?.batches?.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.BatchesName} 
                           {/* {batch.id} */}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No batches available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit2)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="batchName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Batch Name</FormLabel>
                                <Input placeholder="Enter Batch Name" {...field} />
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
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!!selectedCourse}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {courses?.data?.map((course) => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                          {course.course_name || `Course ${course.id}`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="Session_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Session Year</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a Session Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Session?.map((session) => (
                                        <SelectItem key={session.id} value={session.id.toString()}>
                                          {session.session_year || `Session ${session.id}`}
                                        </SelectItem>
                                      ))}
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
                                      type="time"
                                      {...field}
                                      ref={startTimeRef}
                                      onFocus={() => startTimeRef.current?.focus()}
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
                                      type="time"
                                      {...field}
                                      ref={endTimeRef}
                                      onFocus={() => endTimeRef.current?.focus()}
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
                )}
                {form1.formState.errors.batch && (
                  <p id="batch-error" className="mt-1 text-sm text-red-500">
                    {form1.formState.errors.batch.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="file" className="text-lg font-semibold">
                  Upload Excel <span className="text-red-500">*</span>
                </Label>
                <div className="mb-2 flex items-center text-lg text-blue-600">
                  <a href="/sample.xlsx" download className="underline">
                    Download Sample.xlsx
                  </a>
                  <UploadCloud className="ml-2" size={20} />
                </div>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="h-12 rounded-xl border-gray-300"
                  aria-describedby={form1.formState.errors.file ? "file-error" : undefined}
                />
                {form1.formState.errors.file && (
                  <p id="file-error" className="mt-1 text-sm text-red-500">
                    {form1.formState.errors.file.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={studentsLoading || batchesLoading || coursesLoading}
                  className="h-12 w-60 rounded-lg bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  {studentsLoading ? "Uploading..." : "Add Students"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}