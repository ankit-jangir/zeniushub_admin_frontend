import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../src/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Input } from "../../src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../src/components/ui/dialog";
import { Label } from "../../src/components/ui/label";
import { Textarea } from "../../src/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "../../src/components/ui/card";
import { ScrollArea } from "../../src/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/Image/zeniushub.png";
import {
  add_notification,
  delete_notify,
  get_notification,
} from "../../../Redux_store/Api/Notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import {
  fetchBatchesByCourseId,
  get_Batches,
} from "../../../Redux_store/Api/Batches";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { Checkbox } from "../../src/components/ui/checkbox";
import "react-toastify/dist/ReactToastify.css";
import { Badge } from "../../../component/src/components/ui/badge";
import { get_course } from "../../../Redux_store/Api/Academic_course";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../component/src/components/ui/dropdown-menu";
import No_data_found from "../No_data_found";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required!").max(255, "Title must be at most 255 characters!"),
  desc: z.string().min(1, "Description is required!"),
  batchId: z.string().optional(),
  isPublic: z.boolean({ required_error: "Please select visibility type" }),
});

const isDarkMode = true;

const Notification = () => {
  const token =
    useSelector((state) => state.logout.token) || localStorage.getItem("token");
  const [date, setDate] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { notii, loading } = useSelector((s) => s.notify);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const { course } = useSelector((s) => s.acad_courses);
  const batches = useSelector((state) => state.Batch);
  console.log(batches?.batches?.data?.batches, "!@@@@@@@@@@@@@@@@");

  const [filterState, setFilterState] = useState({
    courseId: "",
    batchId: "",
    page: 1,
  });

  console.log(filterState, "*********************");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isPublic: null,
      batchId: "",
      courseId: "",
    },
  });

  useEffect(() => {
    dispatch(get_notification(token));
    dispatch(get_Batches({ token }));
    dispatch(get_course(token));
  }, [dispatch]);

  const onSubmit = async (data) => {
    const payload = {
      head: data.title,
      description: data.desc,
      date: date,
      batchId: data.isPublic
        ? null
        : filterState.batchId
          ? parseInt(filterState.batchId)
          : null,
      course_id: data.isPublic
        ? null
        : filterState.courseId
          ? parseInt(filterState.courseId)
          : null,
      status: data.isPublic ? "public" : "private",
    };

    console.log(payload, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    try {
      const resultAction = await dispatch(
        add_notification({ notificationData: payload, token })
      );
      if (!resultAction.error) {
        setDate(null);
        setEditProfileOpen(false);
        dispatch(get_notification(token));
        reset();
        setSelectedCourse("Select Course");
        setSelectedBatch("");
        setFilterState({ courseId: "", batchId: "", page: 1 });
        toast.success("Notification Added Successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add notification.";
      console.error(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const onInvalid = (errors) => {
    if (errors.title) {
      toast.error(errors.title.message, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
    if (errors.desc) {
      toast.error(errors.desc.message, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }

  };

  const confirmDelete = async () => {
    if (notificationToDelete !== null) {
      try {
        const resultAction = await dispatch(
          delete_notify({ id: notificationToDelete, token })
        );
        if (resultAction.meta.requestStatus === "fulfilled") {
          toast.success("Notification deleted successfully.", {
            position: "top-right",
            autoClose: 3000,
            theme: isDarkMode ? "dark" : "light",
            transition: Zoom,
          });
          dispatch(get_notification(token));
        } else {
          throw new Error("Failed to delete");
        }
      } catch (error) {
        const errorMessage =
          error?.error?.length > 0
            ? error?.error?.[0]?.message
            : error?.message || "An error occurred while deleting.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
      } finally {
        setDeleteDialogOpen(false);
        setNotificationToDelete(null);
      }
    }
  };

  const handleVisibilitySelection = () => {
    if (isPublic === null) {
      setValue("isPublic", null);
      return;
    }
    setValue("isPublic", isPublic);
    setVisibilityDialogOpen(false);
    setEditProfileOpen(true);
  };

  const handleSelectCourse = (courseName, courseId) => {
    setSelectedCourse(courseName === "" ? "Select Course" : courseName);
    setSelectedBatch("");
    setFilterState((prev) => ({
      ...prev,
      courseId,
      batchId: "",
      page: 1,
    }));
    setValue("batchId", "");

    if (courseId !== "") {
      dispatch(fetchBatchesByCourseId({ courseId, token }));
    }
  };

  const handleSelectBatch = (batchId, batchName) => {
    console.log(batchId, "####################");

    setSelectedBatch(batchName);
    setFilterState((prev) => ({
      ...prev,
      batchId: String(batchId),
      page: 1,
    }));
    setValue("batchId", String(batchId));
    console.log(batchId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <ToastContainer />
      <div className="w-full max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <Dialog
            open={visibilityDialogOpen}
            onOpenChange={setVisibilityDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all">
                <Plus className="h-5 w-5 mr-2" /> Add Notification
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-md w-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-6"
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Select Notification Mode
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <Checkbox
                    id="public"
                    checked={isPublic === true}
                    onCheckedChange={() => setIsPublic(true)}
                    className="border-2 border-gray-300 dark:border-gray-900 h-5 w-5"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="public"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                    >
                      public
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Visible to all users
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <Checkbox
                    id="private"
                    checked={isPublic === false}
                    onCheckedChange={() => setIsPublic(false)}
                    className="border-2 border-gray-300 dark:border-gray-900 h-5 w-5"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="private"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                    >
                      Private
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Visible to selected course & batch only
                    </p>
                  </div>
                </div>
                {errors.isPublic && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.isPublic.message}
                  </p>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setVisibilityDialogOpen(false);
                    setIsPublic(null);
                    setValue("isPublic", null);
                  }}
                  className="rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVisibilitySelection}
                  className="rounded-lg bg-blue-800 hover:bg-blue-900 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all"
                  disabled={isPublic === null}
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent
            className="max-w-md w-full rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Create Notification
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5 mt-4">
              <div className="space-y-1">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  {...register("title")}
                  className="rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="desc"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Description
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Enter notification description"
                  {...register("desc")}
                  className="rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  rows={4}
                />
                {errors.desc && (
                  <p className="text-xs text-red-500">{errors.desc.message}</p>
                )}
              </div>

              {isPublic === false && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Course & Batch
                  </Label>
                  <div className="flex gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 w-full justify-between"
                        >
                          {selectedCourse}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuGroup>
                          {Array.isArray(course?.data) &&
                            course.data.length > 0 ? (
                            course.data.map((c) => (
                              <DropdownMenuItem
                                key={c.course_id}
                                onClick={() =>
                                  handleSelectCourse(c.course_name, c.id)
                                }
                                className="hover:bg-blue-50 dark:hover:bg-gray-700"
                              >
                                {c.course_name}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              No courses available
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={filterState.courseId === ""}
                        asChild
                      >
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 w-full justify-between"
                          disabled={filterState.courseId === ""}
                        >
                          {selectedBatch || "Select Batch"}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {filterState.courseId === "" ? (
                          <DropdownMenuItem disabled>
                            Please select course first
                          </DropdownMenuItem>
                        ) : batches?.batches?.data?.batches?.length > 0 ? (
                          batches?.batches?.data?.batches?.map((batch) => (
                            <DropdownMenuItem
                              key={batch.id}
                              onClick={() =>
                                handleSelectBatch(
                                  batch.id ?? "",
                                  batch.BatchesName
                                )
                              }
                              className="hover:bg-blue-50 dark:hover:bg-gray-700"
                            >
                              {batch.BatchesName}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>
                            No batches available
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {errors.batchId && (
                    <p className="text-xs text-red-500">
                      {errors.batchId.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Notification Date
                </Label>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-between rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.showPicker();
                  }}
                >
                  {date
                    ? format(new Date(date), "MMM dd, yyyy")
                    : "Select Date"}
                  <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <Input
                  ref={inputRef}
                  type="date"
                  value={date || ""}
                  onChange={(e) => setDate(e.target.value)}
                  className="opacity-0 absolute -z-10"
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-spin h-20 w-20 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              <img
                src={logo}
                alt="Loading"
                className="h-12 w-12 rounded-full"
              />
            </div>
          </div>
        )}


        {!loading && (
          <>
            {notii?.data?.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {notii.data.map((notif) => (
                  <Card
                    key={notif.id}
                    className="border shadow-xl rounded-2xl bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold truncate">
                          {notif.head}
                        </h3>
                        <Button
                          onClick={() => {
                            setNotificationToDelete(notif.id);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={loading}
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>
                      <ScrollArea className="h-[120px] w-full border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {notif.description}
                        </p>
                      </ScrollArea>
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {notif.date
                              ? format(new Date(notif.date), "MMM dd, yyyy")
                              : "No Date"}
                          </span>
                        </div>
                        <Badge
                          className={
                            notif.status === "public"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {notif.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <No_data_found />
            )}
          </>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent
            className="max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-200">
                Are you sure you want to delete this notification?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white transition-all"
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

export default Notification;
