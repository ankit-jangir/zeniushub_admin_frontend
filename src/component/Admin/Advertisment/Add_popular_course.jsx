import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../src/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import { Input } from "../../src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../src/components/ui/card";
import { ScrollArea } from "../../src/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  add_course,
  deletePopularCourse,
  get_course,
} from "../../../Redux_store/Api/Add_popular_course";
import logo from "../../../assets/Image/intellix.png";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import No_data_found from "../No_data_found";

const base_img_url = "https://adminv2-api-dev.intellix360.in/";
const isDarkMode = true;

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  desc: z.string().min(1, { message: "Description is required!" }),
  image: z
    .any()
    .refine((file) => file instanceof File, { message: "Image is required!" }),
});

const AddPopularCourse = () => {
  const token =
    useSelector((state) => state.logout.token) || localStorage.getItem("token");
  const [imagePreview, setImagePreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [addCourse, setAddCourse] = useState({
    image_path: "",
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector(
    (state) => state.courses || {}
  );
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      desc: "",
      image: null,
    },
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(get_course(token));
  }, [dispatch, token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file);
      setAddCourse({ ...addCourse, image_path: file });
    }
  };

  const refreshData = async () => {
    await dispatch(get_course(token));
    form.reset();
    setImagePreview(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddCourse = async (data) => {
    try {
      if (!data.image || !data.title || !data.desc) {
        toast.warn("All fields are required!", {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
        });
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.desc);
      formData.append("image_path", data.image);

      await dispatch(add_course({ formdata: formData, token })).unwrap();
      await refreshData();
      setOpen(false);

      toast.success("Course Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add course";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleDeleteClick = (id) => {
    setCardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      await dispatch(deletePopularCourse({ id: cardToDelete, token })).unwrap();
      await refreshData();
      setDeleteDialogOpen(false);
      toast.success("Course Deleted Successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to delete course";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    } finally {
      setCardToDelete(null);
    }
  };

  return (
    <div className="min-h-screen  text-white p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Popular Courses
          </h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="dark:bg-gray-800 bg-white text-black dark:text-white  rounded-xl max-w-lg w-full"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-center">
                  Add New Course
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddCourse)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course title"
                            className="bg-white dark:bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course description"
                            className=" bg-white dark:bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Course Image</FormLabel>
                    <FormControl>
                      <input
                        id="picture"
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={handleButtonClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                    >
                      Upload Image
                    </Button>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 w-full h-40 object-cover rounded-lg"
                      />
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                  >
                    Add Course
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <img
                src={logo}
                alt="Loading"
                className="rounded-full h-12 w-12"
              />
            </div>
          </div>
        )}
        {!loading &&
          (course?.data?.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {course.data.map((card) => (
                <Card
                  key={card.id}
                  className="w-full max-w-xs h-[450px] dark:bg-gray-800 dark:border-gray-700 dark:shadow-md shadow-lg dark:shadow-blue-500/50 transition-all duration-300 rounded-xl overflow-hidden flex flex-col"
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent truncate">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex justify-center items-center bg-black p-0">
                    <img
                      src={
                        card.image
                          ? `${base_img_url}viewimagefromazure?filePath=${card.image}`
                          : "https://via.placeholder.com/300x150?text=Banner+Image"
                      }
                      alt={card.title}
                      className="w-full h-full max-h-48 object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </CardContent>
                  <ScrollArea className="h-24 px-4 py-2">
                    <p className="text-sm dark:text-gray-300">
                      {card.description}
                    </p>
                  </ScrollArea>
                  <CardFooter className="p-4">
                    <Button
                      onClick={() => handleDeleteClick(card.id)}
                      className="w-full h-10 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-medium rounded-md"
                    >
                      <Trash2 size={18} className="mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <No_data_found />
          ))}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="bg-gray-800 text-white rounded-xl sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this course?</p>
              <p className="text-sm text-gray-400 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-600 text-black "
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddPopularCourse;
