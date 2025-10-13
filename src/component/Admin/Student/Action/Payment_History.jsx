import { Separator } from "@radix-ui/react-separator";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import Header from "../../Dashboard/Header";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/components/ui/tabs";
import { Button } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentEmi,
  getOneStudentPayment,
  updateEmiPayment,
  checkAmount,
  showEmisRecipt,
} from "../../../../Redux_store/Api/EmisApiStore";
import { getSingleStudent } from "../../../../Redux_store/Api/StudentsApiStore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Card } from "../../../src/components/ui/card";
import Swal from "sweetalert2";
import { generateReceipt } from "../../../../Redux_store/Api/recipt_download";
import { unwrapResult } from "@reduxjs/toolkit";
import { Input } from "../../../src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../component/src/components/ui/table";

/**
 * This version focuses purely on layout & responsiveness.
 * Business logic is unchanged.
 */

const Payment_History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: studentId } = useParams();
  const {
    data: emisData,
    loading: emisLoading,
    error: emisError,
    emiList,
    receiptData,
    receiptLoading,
    receiptError,
  } = useSelector((state) => state.emis);
  const {
    Profile: studentData,
    loading: studentLoading,
    error: studentError,
  } = useSelector((state) => state.students);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams] = useSearchParams();
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2025);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [showPayAllForm, setShowPayAllForm] = useState(false);
  const [payAllAmount, setPayAllAmount] = useState("");
  const [payAllDate, setPayAllDate] = useState("");
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "receipt" || tabParam === "payment") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentEmi({studentId, token}));
      dispatch(showEmisRecipt({studentId, token}));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (studentId) {
      dispatch(getSingleStudent({ id: studentId , token}));
    }
  }, [studentId, dispatch]);
 let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const handleUpdatePayment = async (id, selectedDate) => {
    if (!selectedDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a payment date!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        draggable: true,
      });
      return;
    }

    try {
      const res = await dispatch(
        updateEmiPayment({ emiId: id, paymentDate: selectedDate, token })
      ).unwrap();

      if (res?.emi?.[0] === 1) {
        dispatch(fetchStudentEmi({studentId, token}));
        dispatch(showEmisRecipt({studentId, token}));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment marked as paid successfully!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          draggable: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Payment update failed. Please try again!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          draggable: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        draggable: true,
      });
    }
  };

  // const payments = {
  //   missed:
  //     emiList?.filter((item) => {
  //       const dueDate = new Date(item.emi_duedate);
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);
  //       dueDate.setHours(0, 0, 0, 0);
  //       return item.status === "missed" && dueDate < today;
  //     }) || [],
  //   upcoming:
  //     emiList?.filter((item) => {
  //       const dueDate = new Date(item.emi_duedate);
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);
  //       dueDate.setHours(0, 0, 0, 0);
  //       return item.status === "upcoming" || dueDate >= today;
  //     }) || [],
  //   paid: emiList?.filter((item) => item.status === "paid") || [],
  //   all: emiList || [],
  //   receipt: receiptData || { data: [] },
  // };


  const payments = {
  missed: emiList?.filter((item) => {
    const dueDate = new Date(item.emi_duedate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return item.status === "missed" && dueDate < today;
  }) || [],
  upcoming: emiList?.filter((item) => {
    return item.status === "upcoming";
  }) || [],
  paid: emiList?.filter((item) => item.status === "paid") || [],
  all: emiList || [],
  receipt: receiptData || { data: [] },
};

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString();
  };

  const handleDownload = async (emiId) => {
    setLoadingDownloads((prev) => ({ ...prev, [emiId]: true }));
    try {
      const resultAction = await dispatch(generateReceipt({emiId,token}));
      const blob = await unwrapResult(resultAction);

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-emi-${emiId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Receipt for EMI ${emiId} downloaded successfully!`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          draggable: true,
        });
      } else {
        throw new Error("No blob data received");
      }
    } catch (err) {
      console.error("Error downloading receipt for EMI", emiId, ":", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to download receipt. Please try again!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        draggable: true,
      });
    } finally {
      setLoadingDownloads((prev) => ({ ...prev, [emiId]: false }));
    }
  };

  const openDatePicker = async (id) => {
    const { value: date } = await Swal.fire({
      title: "Select payment date",
      input: "date",
      didOpen: () => {
        const today = new Date().toISOString();
        Swal.getInput().min = today.split("T")[0];
      },
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      draggable: true,
    });

    if (date) {
      await handleUpdatePayment(id, date);
    }
  };

  const handlePayAllSubmit = async () => {
    if (!payAllAmount || !payAllDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter both amount and payment date!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        draggable: true,
      });
      return;
    }

    try {
      const filters = {
        id: parseInt(studentId),
        amount: payAllAmount,
        payment_date: payAllDate,
      };

      const res = await dispatch(checkAmount({filters, token})).unwrap();

      if (res) {
        dispatch(fetchStudentEmi({studentId, token}));
        dispatch(showEmisRecipt({studentId, token}));
        setShowPayAllForm(false);
        setPayAllAmount("");
        setPayAllDate("");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Remaining amount paid successfully!",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          draggable: true,
        });
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to process payment. Please try again!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
        <AppSidebar />
        <SidebarInset>
          <Header />

          {/* Action Buttons */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8  max-w-[40em]">
              <Button
                className="bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 py-2 px-3"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft />
              Back from  Payment Details
              </Button>
              <Button
                className="bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 py-2 px-3"
                onClick={() => setShowPayAllForm(true)}
              >
                Pay All Remaining
              </Button>
            </div>

            {/* Pay All Form */}
            {showPayAllForm && (
              <Card className="mb-6 p-4 sm:p-6 rounded-2xl shadow-md shadow-blue-500/30 w-full max-w-full md:max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Pay Remaining Amount
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700">
                      Amount (₹)
                    </label>
                    <Input
                      type="number"
                      value={payAllAmount}
                      onChange={(e) => setPayAllAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Date
                    </label>
                    <Input
                      type="date"
                      value={payAllDate}
                      onChange={(e) => setPayAllDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="flex gap-4 col-span-1 md:col-span-2">
                    <Button
                      className="bg-blue-500 text-white rounded-lg py-2 px-4 w-full md:w-auto"
                      onClick={handlePayAllSubmit}
                    >
                      Submit Payment
                    </Button>
                    <Button
                      className="bg-gray-300 text-gray-700 rounded-lg py-2 px-4 w-full md:w-auto"
                      onClick={() => setShowPayAllForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Student Info */}
            {studentLoading && (
              <div className="text-center text-sm sm:text-base">
                Loading student data...
              </div>
            )}
            {studentError && (
              <div className="text-center text-red-500 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle />
                <span>Error: {studentError}</span>
              </div>
            )}
            {studentData && (
              <div className="mb-6 p-4 sm:p-6 rounded-2xl backdrop-blur-md shadow-md shadow-blue-500/30 w-full max-w-full md:max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-800 truncate">
                    👤 Student : {studentData?.data?.Student?.name || "N/A"}
                  </h2>
                  <p className="text-sm sm:text-base">
                    🆔 Enrollment Id :{" "}
                    {studentData?.data?.Student?.enrollment_id || "N/A"}
                  </p>
                  <p className="text-sm sm:text-base">
                    📅 Joining Date : {studentData?.data?.joining_date || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 gap-2 md:inline-flex border-b border-gray-300 w-full md:w-auto mt-7  ">
                {["all", "missed", "upcoming", "paid", "receipt"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-4 py-2 text-xs sm:text-sm font-medium text-black dark:text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 text-center"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {emisLoading && (
                <div className="text-center py-4 font-bold">
                  Loading EMIs...
                </div>
              )}

              {!emisLoading && !emisError ? (
                <TabsContent value={activeTab} className="mt-4">
                  {/* Wrapper ensures horizontal scroll on very small screens without hiding data */}
                  <div className="w-full ">
                    {activeTab === "receipt" ? (
                      <Table className="text-xs sm:text-sm md:text-base">
                        <TableHeader className="bg-gray-200 dark:bg-gray-800 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="px-2 py-2">Sr.no</TableHead>
                            <TableHead className="px-2 py-2">
                              Amount (₹)
                            </TableHead>
                            <TableHead className="px-2 py-2">
                              Payment Date
                            </TableHead>
                            <TableHead className="px-2 py-2">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {emisData?.data?.length > 0 ? (
                            emisData.data.map((item, index) => (
                              <TableRow
                                key={index}
                                className="hover:bg-gray-100 dark:hover:bg-gray-900 "
                              >
                                <TableCell className="p-3">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="p-3 text-green-700 font-medium">
                                  ₹{item.amount}
                                </TableCell>
                                <TableCell className="p-3">
                                  {item?.payment_date || "N/A"}
                                </TableCell>
                                <TableCell className="p-3">
                                  <Button
                                    variant="link"
                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto underline disabled:opacity-50"
                                    onClick={() => handleDownload(item.id)}
                                    disabled={loadingDownloads[item.id]}
                                  >
                                    {loadingDownloads[item.id]
                                      ? "Downloading..."
                                      : "Download"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center p-4 text-gray-500"
                              >
                                No Receipts Available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table className="text-xs sm:text-sm md:text-base">
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="px-2 py-2">Sr.no</TableHead>
                            <TableHead className="px-2 py-2">
                              Amount (₹)
                            </TableHead>
                            <TableHead className="px-2 py-2">
                              Due Amount (₹)
                            </TableHead>
                            <TableHead className="px-2 py-2">
                              Payment Date
                            </TableHead>
                            <TableHead className="px-2 py-2">
                              Due Date
                            </TableHead>
                            <TableHead className="px-2 py-2">Status</TableHead>
                            <TableHead className="px-2 py-2">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments[activeTab]?.length > 0 ? (
                            payments[activeTab].map((item, index) => (
                              <TableRow
                                key={index}
                                className="hover:bg-gray-100 dark:hover:bg-gray-900 "
                              >
                                <TableCell className="p-3">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="p-3 text-green-700 font-medium">
                                  ₹{item.amount}
                                </TableCell>
                                <TableCell className="p-3 text-green-700 font-medium">
                                  ₹{item.due_amount}
                                </TableCell>
                                <TableCell className="p-3">
                                  {item.payment_date
                                    ? formatDate(item.payment_date)
                                    : "N/A"}
                                </TableCell>
                                <TableCell className="p-3">
                                  {formatDate(item.emi_duedate)}
                                </TableCell>
                                <TableCell className="p-3">
                                  <span
                                    className={`inline-block w-full md:w-[100px] px-3 py-1 cursor-pointer rounded-md text-white font-medium capitalize ${
                                      item.status === "paid"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : item.status === "upcoming"
                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </TableCell>
                                <TableCell className="p-3">
                                  {item.status !== "paid" ? (
                                    <Button
                                      variant="link"
                                      className="text-green-600 underline cursor-pointer hover:text-green-800 p-0 h-auto"
                                      onClick={() => openDatePicker(item.id)}
                                    >
                                      Mark as Paid
                                    </Button>
                                  ) : (
                                    <span className="text-blue-600 ">
                                      Already Paid
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center p-4 text-gray-500"
                              >
                                No {activeTab} payments found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </TabsContent>
              ) : (
                <div className="text-center py-4 font-bold">
                  No Student Payments Found. Please Add Payment
                  <Separator />
                </div>
              )}
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Payment_History;
