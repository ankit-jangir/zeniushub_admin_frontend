
import React, { useEffect, useState } from "react";
import { Button } from "../../../../src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../src/components/ui/dialog";
import { Input } from "../../../../src/components/ui/input";
import { Label } from "../../../../src/components/ui/label";
import { Eye, Pencil } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../src/components/ui/table";
import { ScrollArea } from "../../../../src/components/ui/scroll-area";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  get_Batches,
  update_Batches,
} from "../../../../../Redux_store/Api/Batches";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add_Payment from "../../../Student/Add_Payment";
import { fetchSessions } from "../../../../../Redux_store/Api/SessionApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";

const Viewdetail = ({ batchid, s, e, n, a, courseid, cn }) => {
  const [openFirst, setOpenFirst] = useState(false);
  const [openSec, setOpenSec] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const currentYear = new Date().getFullYear();
  let token = useSelector((state) => state.logout.token) || localStorage.getItem("token");

  const { Session, loading: sessionsLoading } = useSelector(
    (state) => state.session || {}
  );
  const selectedSession = Session?.find((s) => s.id.toString() === sessionId);
  const sessionYear = selectedSession?.session_year;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [batchDetails, setBatchDetails] = useState({
    id: batchid,
    batchName: n || "",
    startTime: s || "",
    endTime: e || "",
    course: courseid || "", // Added course to match API
  });

  useEffect(() => {
    console.log("Batch ID:", batchid, "Course ID:", courseid, "Course Name:", cn); // Debug log
    if (!batchid || isNaN(batchid)) {
      toast.error("Invalid batch ID. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    dispatch(fetchSessions(token));
  }, [dispatch, token, batchid]);

  useEffect(() => {
    setBatchDetails((prev) => ({
      ...prev,
      id: batchid,
      batchName: n || "",
      startTime: s || "",
      endTime: e || "",
      course: courseid || "",
    }));
  }, [batchid, n, s, e, courseid]);

  const isDarkMode = true;

  const handleChange = (field, value) => {
    setBatchDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const batchName = batchDetails.batchName || n;
    const startTime = batchDetails.startTime || s;
    const endTime = batchDetails.endTime || e;

    if (!batchName) {
      toast.warning("Batch name is required!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    setBatchDetails({
      id: batchid,
      batchName,
      startTime,
      endTime,
      course: courseid,
    });

    setOpenFirst(false);
    setTimeout(() => setOpenSec(true), 50);
  };

  useEffect(() => {
    if (openFirst && sessionId) {
      dispatch(fetchStudents({ batchid, Session_id: sessionId, token }));
    }
  }, [sessionId, openFirst, batchid, token, dispatch]);

  const handleDialogOpen = (open) => {
    setOpenFirst(open);
  };

  useEffect(() => {
    if (Session?.length && !sessionId) {
      const defaultSession = Session.find(
        (s) => s.session_year === currentYear
      );
      if (defaultSession) {
        setSessionId(defaultSession.id.toString());
      }
    }
  }, [Session, sessionId]);

  const { students, error, loading } = useSelector((s) => s.Batch);

  const handleSave = async () => {
    if (!batchDetails.id || isNaN(batchDetails.id)) {
      toast.error("Invalid batch ID. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    if (!batchDetails.batchName) {
      toast.warning("Batch name is required.", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    const payload = {
      id: Number(batchDetails.id),
      batchName: batchDetails.batchName,
      startTime: batchDetails.startTime,
      endTime: batchDetails.endTime,
      course: Number(batchDetails.course), // Include course ID
    };

    try {
      console.log("Saving batch with payload:", payload); // Debug log
      await dispatch(update_Batches({ payload, token })).unwrap();

      setOpenSec(false);

      await dispatch(
        get_Batches({
          token,
          querystatus: "active",
        })
      );

      toast.success("Batch updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });

      setTimeout(() => {
        setOpenFirst(true);
      }, 300);
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to update batch. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });
      console.error("Update Batch Error:", error);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/view/profile/${id}`);
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme={isDarkMode ? "dark" : "light"}
        transition={Zoom}
      />
      {/* First Dialog */}
      <div>
        <Dialog open={openFirst} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full bg-blue-900 text-white hover:bg-blue-800 transition duration-200"
            >
              <Eye className="w-4 h-4" />
              Detail
            </Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-5xl w-full rounded-2xl p-6"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Batch Details
              </DialogTitle>
            </DialogHeader>

            {a === "active" ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
                <Button
                  onClick={handleNext}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    const selectedSession = Session?.find(
                      (s) => s.id.toString() === sessionId
                    );
                    const sessionYear = selectedSession?.session_year;

                    navigate(
                      `/Student_Detail/${students?.data?.students?.course_id ||
                      students?.data?.students[0]?.course_id ||
                      courseid
                      }/${batchid}/${students?.data?.students?.Course?.course_name ||
                      students?.data?.students[0]?.Batch?.Course?.course_name ||
                      cn
                      }/${students?.data?.students?.BatchesName ||
                      students?.data?.students[0]?.Batch?.BatchesName ||
                      n
                      }/${sessionId}/${sessionYear}`
                    );
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Add student
                </Button>

                <div className="flex justify-end w-full mb-4">
                  <div className="w-64">
                    <Label className="mb-1 block text-sm font-medium">
                      Select Session
                    </Label>
                    <Select
                      value={sessionId}
                      onValueChange={(value) => {
                        setSessionId(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session" />
                      </SelectTrigger>
                      <SelectContent>
                        {Session?.map((session) => (
                          <SelectItem
                            key={session.id}
                            value={session.id.toString()}
                          >
                            {session.session_year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : null}

            {/* <div className="bg-white dark:bg-gray-800  min-h-[120px] mt-5 ml-5">
                  <p className="text-sm font-medium mb-2 flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="mr-2 h-4 w-4" />
                    Batches:
                  </p>

                  <ul className="max-h-24 overflow-y-auto list-disc list-inside ml-1 scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {Array.isArray(exam.batches) && exam.batches.length > 0 ? (
                      exam.batches.map((batch, idx) => (
                        <li className="truncate w-[150px]" key={idx} title={batch}>
                          {batch}
                        </li>
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div> */}

            <div className="flex flex-col md:flex-row justify-between items-center mt-6">
              {/* <p className="font-semibold">
                Batch Name:{" "}
                {Array.isArray(students?.data?.students)
                  ? students?.data?.students[0]?.Batch?.BatchesName || n
                  : students?.data?.students?.BatchesName || n}
              </p> 


              <p>
                Course Name:{" "}
                {Array.isArray(students?.data?.students)
                  ? students?.data?.students[0]?.Batch?.Course?.course_name || cn
                  : students?.data?.students?.Course?.course_name || cn}
              </p> */}


              <div className="w-10">
                <p className="font-semibold truncate w-[360px] inline-block" title={
                  Array.isArray(students?.data?.students)
                    ? students?.data?.students[0]?.Batch?.BatchesName || n
                    : students?.data?.students?.BatchesName || n
                }>
                  Batch Name:{" "}
                  {Array.isArray(students?.data?.students)
                    ? students?.data?.students[0]?.Batch?.BatchesName || n
                    : students?.data?.students?.BatchesName || n}
                </p>
              </div>



              <div className="ml-80">
                <p
                  className="font-semibold truncate w-[300px] inline-block"
                  title={
                    Array.isArray(students?.data?.students)
                      ? students?.data?.students[0]?.Batch?.Course?.course_name || cn
                      : students?.data?.students?.Course?.course_name || cn
                  }
                >
                  Course Name:{" "}
                  {Array.isArray(students?.data?.students)
                    ? students?.data?.students[0]?.Batch?.Course?.course_name || cn
                    : students?.data?.students?.Course?.course_name || cn}
                </p>

              </div>

              <p className="font-semibold text-right md:text-left ">
                Total No. Of Students: {students?.data?.students?.length || 0}
              </p>
            </div>

            <ScrollArea className="mt-6 border rounded-md max-h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Payments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.data?.students?.length > 0 ? (
                    students?.data?.students?.map((student) => (
                      <TableRow
                        key={student.id}
                        onClick={() => handleRowClick(student.id)}
                        className="cursor-pointer"
                      >
                        <TableCell>{student?.Student?.enrollment_id || "N/A"}</TableCell>
                        <TableCell
                          title={student?.Student?.name}
                          className="max-w-[150px] truncate"
                        >
                          {student?.Student?.name || "N/A"}
                        </TableCell>
                        <TableCell>{s || "N/A"}</TableCell>
                        <TableCell>{e || "N/A"}</TableCell>
                        <TableCell>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/student-payment-history/${student?.id}`
                              );
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Payment History
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-red-600 py-10"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            <DialogFooter className="mt-6 flex justify-center">
              <Button
                onClick={() => setOpenFirst(false)}
                className="bg-blue-800 hover:bg-blue-700 px-8 text-white"
              >
                Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment add */}
      <Dialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-[90vw] max-w-[825px] max-h-[90vh] overflow-x-hidden"
        >
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Fill out the payment details for the student.
            </DialogDescription>
          </DialogHeader>

          <Add_Payment
            studentId={selectedStudentId}
            closeDialog={() => setOpenPaymentDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Second Dialog */}
      <Dialog open={openSec} onOpenChange={setOpenSec}>
        <DialogContent
          className="sm:max-w-2xl w-full rounded-2xl p-6 shadow-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Edit Batch</DialogTitle>
            <DialogDescription className="text-md mt-1">
              Update the batch information below and save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium text-gray-700">
                Batch Name:
              </Label>
              <Input
                value={batchDetails.batchName}
                onChange={(e) => handleChange("batchName", e.target.value)}
                placeholder="Enter batch name"
                className="col-span-3 px-4 py-2 border rounded-md bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium text-gray-700">
                Start Time:
              </Label>
              <Input
                type="time"
                value={batchDetails.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="col-span-3 px-4 py-2 border rounded-md bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium text-gray-700">
                End Time:
              </Label>
              <Input
                type="time"
                value={batchDetails.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="col-span-3 px-4 py-2 border rounded-md bg-transparent shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label className="md:text-right text-left font-medium text-gray-700">
                Course ID:
              </Label>
              <Input
                value={batchDetails.course}
                readOnly
                className="col-span-3 px-4 py-2 border rounded-md bg-gray-100 shadow-sm"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Viewdetail;