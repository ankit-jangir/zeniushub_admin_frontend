import { AlertCircle, ArrowLeft, BookOpenCheck, Layers3 } from "lucide-react";
import { Button } from "../../../../../src/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { updateNewStudent } from "../../../../../../Redux_store/slices/StudentSlice";
import { get_course } from "../../../../../../Redux_store/Api/Academic_course";
import { useEffect } from "react";
import { fetchBatchesByCourseId } from "../../../../../../Redux_store/Api/Batches";
import { Input } from "../../../../../src/components/ui/input";

import Swal from "sweetalert2";


const validationSchema = z.object({
    selectedCourse: z.string().min(1, { message: "Course name is required" }),
    selectedBatch: z.string().min(1, { message: "Batch name is required" }),
});



const CourseDetail = () => {


    const { courseId, batchId, courseName, batchName } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const newStudent = useSelector((state) => state.students.newStudent);


    const form = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            selectedCourse: courseName || "",
            selectedBatch: batchName || "",
        },
    });

    const { register, handleSubmit, formState: { errors }, setValue, reset } = form;


    useEffect(() => {
        reset({
            selectedCourse: courseName || "",
            selectedBatch: batchName || "",
        });
    }, [courseName, batchName, reset]);




    const onSubmit = async () => {
        try {
            const payload = {
    course_id: courseId,          
    batch_id: batchId,            
    course_name: courseName,     
    batch_name: batchName,
    ...Object.keys(newStudent).reduce((acc, key) => {
        if (
            newStudent[key] &&
            key !== "course_id" &&
            key !== "batch_id" &&
            key !== "course_name" &&
            key !== "batch_name"
        ) {
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
            navigate("/Parents_Detail", { state: { formData: payload } });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to update course and batch. Please try again.",
                confirmButtonColor: "#3085d6",
            });
        }
    };


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


                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-6">
                            <label
                                htmlFor="selectedCourse"
                                className="font-semibold text-lg flex items-center gap-2 mb-2"
                            >
                                <BookOpenCheck size={18} /> Course Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="selectedCourse"
                                placeholder="Enter Course Name"

                                defaultValue={courseName}
                                readOnly
                                className={`w-full border rounded-xl p-3 shadow-sm bg-transparent focus:ring-2 focus:ring-blue-500 ${errors.selectedCourse ? "border-red-500" : "border-gray-300"
                                    }`}
                                {...register("selectedCourse")}
                            />
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
                                <Layers3 size={18} /> Batch Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="selectedBatch"
                                placeholder="Enter Batch Name"
                                readOnly
                                defaultValue={batchName}
                                className={`w-full border rounded-xl p-3 shadow-sm bg-transparent focus:ring-2 focus:ring-blue-500 ${errors.selectedBatch ? "border-red-500" : "border-gray-300"
                                    }`}
                                {...register("selectedBatch")}
                                aria-invalid={errors.selectedBatch ? "true" : "false"}
                                disabled={!courseId}
                            />


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

export default CourseDetail;
