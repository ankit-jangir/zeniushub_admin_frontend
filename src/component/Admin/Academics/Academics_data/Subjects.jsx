// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import AppSidebar from "../../../src/components/ui/app-sidebar";

// import {
//   SidebarInset,
//   SidebarProvider,
// } from "../../../src/components/ui/sidebar";
// import Header from "../../Dashboard/Header";
// import { Button } from "../../../src/components/ui/button";
// import { ArrowLeft, CheckIcon, Edit, Search, Trash } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../../../src/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../../src/components/ui/form";
// import { Input } from "../../../src/components/ui/input";
// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../../src/components/ui/card";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "../../../src/components/ui/pagination";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ToastContainer, toast, Zoom } from "react-toastify";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "../../../../component/src/components/ui/popover";
// import { Checkbox } from "../../../../component/src/components/ui/checkbox";
// import { Label } from "../../../../component/src/components/ui/label";
// import {
//   Add_subject,
//   delete_subject,
//   fetchSubjectCourses,
//   get_subject,
//   update_Subject,
// } from "../../../../Redux_store/Api/Subject";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router";
// import { get_course } from "../../../../Redux_store/Api/Academic_course";
// import { Textarea } from "../../../../component/src/components/ui/textarea";
// import { Description } from "@radix-ui/react-dialog";
// import No_data_found from "../../No_data_found";

// const formSchema = z.object({
//   subject_name: z.string().trim().min(1, "Subject name is required"),
//   course_id: z.array(z.number()).min(1, "Select at least one course"),
// });

// const Subjects = () => {
//    let token = localStorage.getItem("token");

//   token = useSelector((state) => state.logout.token);
//   const [AddSubjects, setAddSubjects] = useState(false);
//   const [EditSubjects, setEditSubjects] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openDeleteId, setOpenDeleteId] = useState(null);

//   const dispatch = useDispatch();
//   const { subjects, meta } = useSelector((state) => state.subj);
//   const { course: courses = { data: [] } } = useSelector(
//     (state) => state.courses
//   );

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       subject_name: "",
//       course_id: [],
//     },
//   });

//   const { subjectId } = useParams();
//   const navigate = useNavigate();
//   const back = () => navigate("/Academics");

//   useEffect(() => {
//     if (subjectId) {
//       dispatch(fetchSubjectCourses({ subjectId, token }));
//     }
//   }, [subjectId, dispatch, token]);

//   useEffect(() => {
//     dispatch(get_course(token));
//     dispatch(
//       get_subject({token,
//         page: currentPage,
//         limit: meta?.limit || 16,
//         search: searchTerm,
//       })
//     );
//   }, [currentPage, searchTerm, dispatch, meta?.limit]);

//   const Subjectsdata = subjects?.data || [];
//   const SubjectsPerPage = meta?.limit || 16;
//   const totalRecords = meta?.totalRecords || 0;
//   const totalPages = meta?.totalPages || 1;

//   const handleEditSubject = (subject) => {
//     setSelectedSubject(subject);
//     const courseIds = subject.Courses?.map((course) => course.id) || [];
//     form.reset({
//       subject_name: subject.subject_name,
//       course_id: courseIds,
//     });
//     setEditSubjects(true);
//   };

//   const handleUpdateSubject = async () => {
//     try {
//       const currentSubjectName = form.getValues("subject_name");
//       const selectedCourseIds = form.getValues("course_id") || [];
//       const existingCourseIds =
//         selectedSubject?.Courses?.map((course) => course.id) || [];
//       const newCourseIdsToAdd = selectedCourseIds.filter(
//         (id) => !existingCourseIds.includes(id)
//       );
//       const courseIdsToRemove = existingCourseIds.filter(
//         (id) => !selectedCourseIds.includes(id)
//       );

//       const payload = {
//         id: selectedSubject.id,
//         subject_name: currentSubjectName,
//         course_id: newCourseIdsToAdd,
//         // remove_course_ids: courseIdsToRemove, // Uncomment if backend supports removal
//       };

//       await dispatch(update_Subject(payload)).unwrap();
//       dispatch(
//         get_subject({token,

//           page: currentPage,
//           limit: SubjectsPerPage,
//           search: searchTerm,
//         })
//       );

//       toast.success("Subject updated successfully!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });

//       setEditSubjects(false);
//     } catch (error) {
//       console.error("Failed to update subject:", error);
//       const errorMessage =
//         error?.error?.length > 0
//           ? error?.error?.[0]?.message
//           : error?.message || "Failed to update subject";
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });
//     }
//   };

//   const handleAddSubject = async (data) => {
//     try {
//       await dispatch(Add_subject(data)).unwrap();
//       dispatch(
//         get_subject({token,
//           page: currentPage,
//           limit: SubjectsPerPage,
//           search: searchTerm,
//         })
//       );

//       toast.success("Subject added successfully!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });

//       // Explicitly reset form fields to initial values
//       form.reset({
//         subject_name: "",
//         course_id: [],
//       });
//       setAddSubjects(false);
//     } catch (error) {
//       console.error("Failed to add subject:", error);
//       const errorMessage =
//         error?.error?.length > 0
//           ? error?.error?.[0]?.message
//           : error?.message || "Failed to add subject";
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await dispatch(delete_subject(id)).unwrap();
//       dispatch(
//         get_subject({token,
//           page: currentPage,
//           limit: SubjectsPerPage,
//         })
//       );

//       toast.success("Subject deleted successfully!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });
//     } catch (error) {
//       const errorMessage =
//         error?.error?.length > 0
//           ? error?.error?.[0]?.message
//           : error?.message || "Failed to delete subject";
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         theme: isDarkMode ? "dark" : "light",
//         transition: Zoom,
//       });
//       console.error("Failed to delete subject:", error);
//     }
//   };

//   const isDarkMode = true;

//   return (
//     <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
//       <AppSidebar />
//       <SidebarInset>
//         <Header />
//         <main className="flex-1 overflow-auto">
//           <ToastContainer
//             position="top-right"
//             autoClose={5000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick={false}
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme={isDarkMode ? "dark" : "light"}
//             transition={Zoom}
//           />

//           <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
//             <div className="flex items-center gap-3">
//               <Button
//                 onClick={back}
//                 className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
//               >
//                 <ArrowLeft size={18} />
//                 <span className="hidden md:inline">Back to Academics</span>
//               </Button>
//               <Button
//                 onClick={() => {
//                   form.reset({ subject_name: "", course_id: [] }); // Reset form before opening Add dialog
//                   setAddSubjects(true);
//                 }}
//                 className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
//               >
//                 <span className="text-lg">+</span>
//                 <span>Add Subjects</span>
//               </Button>
//             </div>

//             <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full sm:max-w-md">
//               <Search size={18} className="text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="By Subjects Name..."
//                 className="ml-2 w-full outline-none bg-transparent text-sm"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1); // Reset to page 1 on search
//                 }}
//               />
//             </div>
//           </div>

//           <div className="w-full p-6">
//             {Subjectsdata?.length === 0 ? (
//               <No_data_found />
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {Subjectsdata?.map((sub) => (
//                   <Card
//                     key={sub.id}
//                     className="relative w-full max-w-xs sm:max-w-sm mx-auto shadow-md shadow-blue-500/30 rounded-2xl border"
//                   >
//                     <Dialog
//                       open={openDeleteId === sub.id}
//                       onOpenChange={(isOpen) => {
//                         if (!isOpen) setOpenDeleteId(null);
//                       }}
//                     >
//                       <DialogContent
//                         onPointerDownOutside={(e) => e.preventDefault()}
//                         onEscapeKeyDown={(e) => e.preventDefault()}
//                         className="sm:max-w-md rounded-2xl"
//                       >
//                         <DialogHeader>
//                           <DialogTitle className="text-red-600">
//                             Delete Subject
//                           </DialogTitle>
//                           <DialogDescription>
//                             Are you sure you want to delete{" "}
//                             <strong>
//                               <div
//                                 className="break-all font-bold"
//                                 title={sub.subject_name}
//                               >
//                                 {sub.subject_name}
//                               </div>
//                             </strong>
//                           </DialogDescription>
//                         </DialogHeader>

//                         <div className="flex justify-end gap-3 mt-6">
//                           <Button
//                             variant="outline"
//                             onClick={() => setOpenDeleteId(null)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             className="bg-red-600 hover:bg-red-500 text-white"
//                             onClick={async () => {
//                               await handleDelete(sub.id);
//                               setOpenDeleteId(null);
//                             }}
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </DialogContent>
//                     </Dialog>

//                     <CardHeader className="border-b">
//                       <CardTitle
//                         className="text-lg font-semibold text-center truncate"
//                         title={sub.subject_name}
//                       >
//                         {sub.subject_name}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardDescription className="px-4  pt-2 pb-4 text-sm text-gray-600 dark:text-white  border-b">
//                       <h4 className="font-medium">Course</h4>
//                       {sub?.Courses?.length ? (
//                         <ul
//                           className="h-[60px] overflow-y-auto custom-scrollbar"
//                           title={sub.Courses.map((c) => c.course_name).join(
//                             "\n"
//                           )}
//                         >
//                           {sub.Courses.map((course) => (
//                             <li key={course.id} className="truncate">
//                               {course.course_name}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="h-[49px]">No Course</p>
//                       )}
//                     </CardDescription>

//                     <CardFooter className="flex flex-col sm:flex-row gap-2 px-4 py-4">
//                       <Button
//                         className="w-full"
//                         onClick={() => handleEditSubject(sub)}
//                       >
//                         <Edit className="mr-2 h-4 w-4" /> Edit
//                       </Button>
//                       <Button
//                         className="w-full"
//                         variant="destructive"
//                         onClick={() => setOpenDeleteId(sub.id)}
//                       >
//                         <Trash className="mr-2 h-4 w-4" /> Delete
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

//           <Dialog open={EditSubjects} onOpenChange={setEditSubjects}>
//             <DialogContent
//               onPointerDownOutside={(e) => e.preventDefault()}
//               onEscapeKeyDown={(e) => e.preventDefault()}
//               className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto shadow-lg p-4 sm:p-6 rounded-lg"
//             >
//               <DialogHeader>
//                 <DialogTitle className="text-center">
//                   Update Subject
//                 </DialogTitle>
//               </DialogHeader>

//               <Form {...form}>
//                 <form
//                   onSubmit={form.handleSubmit(handleUpdateSubject)}
//                   className="space-y-4"
//                 >
//                   {/* Subject Name */}
//                   <FormField
//                     control={form.control}
//                     name="subject_name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Enter subject name</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             rows={1}
//                             className="resize-none h-9 px-3 py-1 text-sm leading-tight break-words"
//                             title={field.value}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Course Selection with Icon */}
//                   <FormField
//                     control={form.control}
//                     name="course_id"
//                     render={({ field }) => {
//                       const existingCourseIds =
//                         selectedSubject?.Courses?.map((c) => c.id) || [];
//                       const availableCourses =
//                         courses?.data?.filter(
//                           (course) => !existingCourseIds.includes(course.id)
//                         ) || [];

//                       const selectedCourseNames = field.value
//                         ?.map(
//                           (id) =>
//                             courses?.data?.find((c) => c.id === id)?.course_name
//                         )
//                         .filter(Boolean)
//                         .join(", ");

//                       return (
//                         <FormItem>
//                           <FormLabel>Select Courses</FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 className="w-full min-h-[60px] justify-between text-left whitespace-normal break-words flex items-center px-4 py-2"
//                                 title={selectedCourseNames || "Select courses"}
//                               >
//                                 <span>
//                                   {selectedCourseNames || "Select courses"}
//                                 </span>
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-5 w-5 text-muted-foreground"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M19 9l-7 7-7-7"
//                                   />
//                                 </svg>
//                               </Button>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-full sm:w-[400px] max-h-[300px] overflow-y-auto p-2">
//                               {availableCourses.length ? (
//                                 availableCourses.map((course) => (
//                                   <div
//                                     key={course.id}
//                                     className="flex items-center space-x-2"
//                                   >
//                                     <Checkbox
//                                       id={`course-${course.id}`}
//                                       checked={field.value?.includes(course.id)}
//                                       onCheckedChange={(checked) => {
//                                         const newValue = checked
//                                           ? [...(field.value || []), course.id]
//                                           : field.value?.filter(
//                                               (id) => id !== course.id
//                                             );
//                                         field.onChange(newValue);
//                                       }}
//                                     />
//                                     <Label
//                                       htmlFor={`course-${course.id}`}
//                                       className="flex items-center gap-2 break-words"
//                                       title={course.course_name}
//                                     >
//                                       <CheckIcon className="w-4 h-4 text-muted-foreground" />
//                                       {course.course_name ||
//                                         `Course ${course.id}`}
//                                     </Label>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <p className="text-sm text-muted-foreground">
//                                   No additional courses available
//                                 </p>
//                               )}
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage />
//                         </FormItem>
//                       );
//                     }}
//                   />

//                   {/* Submit Button */}
//                   <Button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white"
//                   >
//                     Confirm
//                   </Button>
//                 </form>
//               </Form>
//             </DialogContent>
//           </Dialog>

//           <Dialog open={AddSubjects} onOpenChange={setAddSubjects}>
//             <DialogContent
//               onPointerDownOutside={(e) => e.preventDefault()}
//               onEscapeKeyDown={(e) => e.preventDefault()}
//               className="sm:max-w-[500px] shadow-lg p-6 rounded-lg min-h-[300px]"
//             >
//               <DialogHeader>
//                 <DialogTitle className="text-center">
//                   Add New Subject
//                 </DialogTitle>
//               </DialogHeader>
//               <Form {...form}>
//                 <form
//                   onSubmit={form.handleSubmit(handleAddSubject)}
//                   className="space-y-10"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="subject_name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Enter subject name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="e.g. Mathematics" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="course_id"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Courses</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-start text-left"
//                             >
//                               {field.value?.length
//                                 ? `Selected (${field.value.length})`
//                                 : "Select Courses"}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-[300px] max-h-[250px] overflow-y-auto">
//                             {courses?.data?.length ? (
//                               courses.data.map((course) => (
//                                 <div
//                                   key={course.id}
//                                   className="flex items-center space-x-2"
//                                 >
//                                   <Checkbox
//                                     id={`course-${course.id}`}
//                                     checked={field.value?.includes(course.id)}
//                                     onCheckedChange={(checked) => {
//                                       const newValue = checked
//                                         ? [...(field.value || []), course.id]
//                                         : field.value?.filter(
//                                             (id) => id !== course.id
//                                           );
//                                       field.onChange(newValue);
//                                     }}
//                                   />
//                                   <Label htmlFor={`course-${course.id}`}>
//                                     {course.course_name ||
//                                       `Course ${course.id}`}
//                                   </Label>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No courses available</p>
//                             )}
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white"
//                   >
//                     Add Subject
//                   </Button>
//                 </form>
//               </Form>
//             </DialogContent>
//           </Dialog>

//           <Pagination>
//             <PaginationContent className="mt-6">
//               <PaginationItem>
//                 <PaginationPrevious
//                   href="#"
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                 />
//               </PaginationItem>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <PaginationItem key={i}>
//                   <PaginationLink
//                     href="#"
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-4 py-2 rounded-md ${
//                       currentPage === i + 1
//                         ? "bg-blue-600 text-white"
//                         : "hover:bg-blue-500 hover:text-white"
//                     }`}
//                   >
//                     {i + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}
//               <PaginationItem>
//                 <PaginationNext
//                   href="#"
//                   onClick={() =>
//                     setCurrentPage(Math.min(totalPages, currentPage + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// };

// export default Subjects;



import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppSidebar from "../../../src/components/ui/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import Header from "../../Dashboard/Header";
import { Button } from "../../../src/components/ui/button";
import { ArrowLeft, CheckIcon, Edit, Search, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../src/components/ui/form";
import { Input } from "../../../src/components/ui/input";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../src/components/ui/pagination";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast, Zoom } from "react-toastify";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../component/src/components/ui/popover";
import { Checkbox } from "../../../../component/src/components/ui/checkbox";
import { Label } from "../../../../component/src/components/ui/label";
import {
  Add_subject,
  delete_subject,
  fetchSubjectCourses,
  get_subject,
  update_Subject,
} from "../../../../Redux_store/Api/Subject";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { get_course } from "../../../../Redux_store/Api/Academic_course";
import { Textarea } from "../../../../component/src/components/ui/textarea";
import { Description } from "@radix-ui/react-dialog";
import No_data_found from "../../No_data_found";

const formSchema = z.object({
  subject_name: z.string().trim().min(1, "Subject name is required"),
  course_id: z.array(z.number()).min(1, "Select at least one course"),
});

const Subjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subjectId } = useParams();

  // ✅ Always pick token from redux
  const token = useSelector((state) => state.logout.token);

  const [AddSubjects, setAddSubjects] = useState(false);
  const [EditSubjects, setEditSubjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteId, setOpenDeleteId] = useState(null);

  const { subjects, meta } = useSelector((state) => state.subj);
  const { course: courses = { data: [] } } = useSelector(
    (state) => state.courses
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject_name: "",
      course_id: [],
    },
  });

  const back = () => navigate("/Academics");

  // ✅ fetch subject courses if subjectId available
  useEffect(() => {
    if (subjectId && token) {
      dispatch(fetchSubjectCourses({ subjectId, token }));
    }
  }, [subjectId, token, dispatch]);

  // ✅ load subjects and courses
  useEffect(() => {
    if (token) {
      dispatch(get_course(token));
      dispatch(
        get_subject({
          token,
          page: currentPage,
          limit: meta?.limit || 16,
          search: searchTerm,
        })
      );
    }
  }, [token, currentPage, searchTerm, dispatch, meta?.limit]);

  const Subjectsdata = subjects?.data || [];
  const SubjectsPerPage = meta?.limit || 16;
  const totalRecords = meta?.totalRecords || 0;
  const totalPages = meta?.totalPages || 1;

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    const courseIds = subject.Courses?.map((course) => course.id) || [];
    form.reset({
      subject_name: subject.subject_name,
      course_id: courseIds,
    });
    setEditSubjects(true);
  };

  const handleUpdateSubject = async () => {
    try {
      const currentSubjectName = form.getValues("subject_name");
      const selectedCourseIds = form.getValues("course_id") || [];
      const existingCourseIds =
        selectedSubject?.Courses?.map((course) => course.id) || [];
      const newCourseIdsToAdd = selectedCourseIds.filter(
        (id) => !existingCourseIds.includes(id)
      );

      const payload = {
        data: {
          id: selectedSubject.id,
          subject_name: currentSubjectName,
          course_id: newCourseIdsToAdd,
        },
        token,
      };

      await dispatch(update_Subject(payload)).unwrap();
      dispatch(
        get_subject({
          token,
          page: currentPage,
          limit: SubjectsPerPage,
          search: searchTerm,
        })
      );

      toast.success("Subject updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setEditSubjects(false);
    } catch (error) {
      console.error("Failed to update subject:", error);
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to update subject";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleAddSubject = async (data) => {
    try {
      await dispatch(Add_subject({ data, token })).unwrap();
      dispatch(
        get_subject({
          token,
          page: currentPage,
          limit: SubjectsPerPage,
          search: searchTerm,
        })
      );

      toast.success("Subject added successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      form.reset({
        subject_name: "",
        course_id: [],
      });
      setAddSubjects(false);
    } catch (error) {
      console.error("Failed to add subject:", error);
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add subject";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(delete_subject({ id, token })).unwrap();
      dispatch(
        get_subject({
          token,
          page: currentPage,
          limit: SubjectsPerPage,
        })
      );

      toast.success("Subject deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to delete subject";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
      console.error("Failed to delete subject:", error);
    }
  };

  const isDarkMode = true;

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
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

          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
            <div className="flex items-center gap-3">
              <Button
                onClick={back}
                className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to Academics</span>
              </Button>
              <Button
                onClick={() => {
                  form.reset({ subject_name: "", course_id: [] }); // Reset form before opening Add dialog
                  setAddSubjects(true);
                }}
                className="bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>Add Subjects</span>
              </Button>
            </div>

            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="By Subjects Name..."
                className="ml-2 w-full outline-none bg-transparent text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
            </div>
          </div>

          <div className="w-full p-6">
            {Subjectsdata?.length === 0 ? (
              <No_data_found />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Subjectsdata?.map((sub) => (
                  <Card
                    key={sub.id}
                    className="relative w-full max-w-xs sm:max-w-sm mx-auto shadow-md shadow-blue-500/30 rounded-2xl border"
                  >
                    <Dialog
                      open={openDeleteId === sub.id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) setOpenDeleteId(null);
                      }}
                    >
                      <DialogContent
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                        className="sm:max-w-md rounded-2xl"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-red-600">
                            Delete Subject
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>
                              <div
                                className="break-all font-bold"
                                title={sub.subject_name}
                              >
                                {sub.subject_name}
                              </div>
                            </strong>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex justify-end gap-3 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setOpenDeleteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-500 text-white"
                            onClick={async () => {
                              await handleDelete(sub.id);
                              setOpenDeleteId(null);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <CardHeader className="border-b">
                      <CardTitle
                        className="text-lg font-semibold text-center truncate"
                        title={sub.subject_name}
                      >
                        {sub.subject_name}
                      </CardTitle>
                    </CardHeader>
                    <CardDescription className="px-4  pt-2 pb-4 text-sm text-gray-600 dark:text-white border-b">
                      <h4 className="font-medium">Course</h4>
                      {sub?.Courses?.length ? (
                        <ul
                          className="h-[60px] overflow-y-auto scrollbar-none"
                          title={sub.Courses.map((c) => c.course_name).join(
                            "\n"
                          )}
                        >
                          {sub.Courses.map((course) => (
                            <li key={course.id} className="truncate">
                              {course.course_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="h-[49px]">No Course</p>
                      )}
                    </CardDescription>

                    <CardFooter className="flex flex-col sm:flex-row gap-2 px-4 py-4">
                      <Button

                        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                        onClick={() => handleEditSubject(sub)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => setOpenDeleteId(sub.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Dialog open={EditSubjects} onOpenChange={setEditSubjects}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto shadow-lg p-4 sm:p-6 rounded-lg"
            >
              <DialogHeader>
                <DialogTitle className="text-center">
                  Update Subject
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdateSubject)}
                  className="space-y-4"
                >
                  {/* Subject Name */}
                  <FormField
                    control={form.control}
                    name="subject_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter subject name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            rows={1}
                            className="resize-none h-9 px-3 py-1 text-sm leading-tight break-words"
                            title={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Course Selection with Icon */}
                  <FormField
                    control={form.control}
                    name="course_id"
                    render={({ field }) => {
                      const existingCourseIds =
                        selectedSubject?.Courses?.map((c) => c.id) || [];
                      const availableCourses =
                        courses?.data?.filter(
                          (course) => !existingCourseIds.includes(course.id)
                        ) || [];

                      const selectedCourseNames = field.value
                        ?.map(
                          (id) =>
                            courses?.data?.find((c) => c.id === id)?.course_name
                        )
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <FormItem>
                          <FormLabel>Select Courses</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full min-h-[60px] h-100 justify-between text-left whitespace-normal break-words flex items-center px-4 py-2"
                                title={selectedCourseNames || "Select courses"}
                              >
                                <span>
                                  {selectedCourseNames || "Select courses"}
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-muted-foreground"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full sm:w-[400px] max-h-[300px] overflow-y-auto p-2">
                              {availableCourses.length ? (
                                availableCourses.map((course) => (
                                  <div
                                    key={course.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`course-${course.id}`}
                                      checked={field.value?.includes(course.id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...(field.value || []), course.id]
                                          : field.value?.filter(
                                            (id) => id !== course.id
                                          );
                                        field.onChange(newValue);
                                      }}
                                    />
                                    <Label
                                      htmlFor={`course-${course.id}`}
                                      className="flex items-center gap-2 break-words"
                                      title={course.course_name}
                                    >
                                      <CheckIcon className="w-4 h-4 text-muted-foreground" />
                                      {course.course_name ||
                                        `Course ${course.id}`}
                                    </Label>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No additional courses available
                                </p>
                              )}
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    Confirm
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={AddSubjects} onOpenChange={setAddSubjects}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[500px] shadow-lg p-6 rounded-lg min-h-[300px]"
            >
              <DialogHeader>
                <DialogTitle className="text-center">
                  Add New Subject
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddSubject)}
                  className="space-y-10"
                >
                  <FormField
                    control={form.control}
                    name="subject_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter subject name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Courses</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              {field.value?.length
                                ? `Selected (${field.value.length})`
                                : "Select Courses"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] max-h-[250px] overflow-y-auto">
                            {courses?.data?.length ? (
                              courses.data.map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`course-${course.id}`}
                                    checked={field.value?.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...(field.value || []), course.id]
                                        : field.value?.filter(
                                          (id) => id !== course.id
                                        );
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <Label htmlFor={`course-${course.id}`}>
                                    {course.course_name ||
                                      `Course ${course.id}`}
                                  </Label>
                                </div>
                              ))
                            ) : (
                              <p>No courses available</p>
                            )}
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white"
                  >
                    Add Subject
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Pagination>
            <PaginationContent className="mt-6">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Subjects;
