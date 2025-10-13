import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "../../../src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../../../src/components/ui/input";
import { Label } from "../../../src/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";

import ThemeContext from "../../Dashboard/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { Badge } from "../../../src/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentAttendance } from "../../../../Redux_store/Api/Stu_atten";
import { z } from "zod";
// import ThemeContext from "../Dashboard/ThemeContext";

const initialSalaryData = [
  {
    id: 1,
    name: "John Doe",
    amount: "$5,000",
    date: "2025-03-01",
    status: "Paid",
  },
  {
    id: 2,
    name: "Jane Smith",
    amount: "$4,500",
    date: "2025-02-01",
    status: "Pending",
  },
  {
    id: 3,
    name: "Robert Brown",
    amount: "$5,200",
    date: "2025-01-01",
    status: "Paid",
  },
  {
    id: 4,
    name: "Emily Johnson",
    amount: "$4,800",
    date: "2024-12-01",
    status: "Paid",
  },
];

const formSchema = z.object({
  amount: z.string().min(1, { message: "Please enter the amount!" }),
  present: z.string().min(1, { message: "Required!" }),
  absent: z.string().min(1, { message: "Required!" }),
  halfday: z.string().min(1, { message: "Required!" }),
});

const Stu_Attendance = () => {
   let token = localStorage.getItem("token");
  
    token = useSelector((state) => state.logout.token);
  const { id: enrollmentId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Attendance");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tab, setTab] = useState("tab1");
  const [open, setOpen] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [opensec, setopensec] = useState(false);
  const [Salaryhistory, setSalaryhistory] = useState(initialSalaryData);
  const [secdate, setsecdate] = useState("");
  const [secattendance, setsecattendance] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const dispatch = useDispatch();

  // Access studentAttendance from Redux store
  //   const { studentAttendance, loading, error } = useSelector((state) => ({
  //     studentAttendance: state.attendance_stu,
  //     loading: state.attendance_stu?.loading || false,
  //     error: state.attendance_stu?.error || null,
  //   }));

  const { studentAttendance, loading, error } = useSelector(
    (state) => state.attendance_stu
  );

  // const {studentAttendance} = useSelector((state)=>{state.attendance_stu})

  console.log(studentAttendance, "studentAttendance");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleViewAttendance = () => {
    if (!month || !year) {
      alert("Please select both Month and Year!");
      return;
    }

    if (!enrollmentId) {
      alert("Enrollment ID not found!");
      return;
    }

    // Dispatch the API call to fetch attendance
    dispatch(
      fetchStudentAttendance({
        enrollmentId,
        month: month.padStart(2, "0"), // Ensure month is two digits (e.g., "05")
        year,
        token
      })
    );
  };

  function capitalizeFirstLetter(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "text-green-400";
      case "half day":
        return "text-yellow-400";
      case "absent":
        return "text-red-400";
      default:
        return "text-gray-500";
    }
  };

  // const sechandleViewAttendance = () => {
  //     // Replace this with your API call or logic to fetch attendance based on date
  //     const data = {
  //         id: '12340560',
  //         status: 'Absent',
  //         date: fromDate,
  //         inTime: '--:--',
  //         outTime: '--:--',
  //     };
  //     setsecattendance(data);
  // };

  const goback = () => {
    navigate(-1);
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <aside
        className={`md:w-64 w-full p-6 shadow-md flex flex-col gap-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <Button
          onClick={goback}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border border-gray-300"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>

        {/* <h4 className="text-xl font-semibold">Manage Salary</h4> */}

        {/* <Button
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${tab === "tab2" ? "font-bold" : ""}`}
                      onClick={() => {
                          setTab("tab2");
                      }}
                  >
                      Attendance
                  </Button> */}
        {/* <Button
                      className={`w-full border-2 border-blue-700 bg-transparent hover:bg-transparent text-black dark:text-white hover:border-blue-600 mt-5 ${tab === "tab1" ? "font-bold" : ""}`}
                      onClick={() => {
                          setTab("tab1");
                      }}
                  >
                      Bulk Attendance
                  </Button> */}

        <div className="mt-6 space-y-3">
          {tab === "tab1" ? (
            <>
              <div className="w-full border-t p-4 border border-blue-200 shadow-md mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Select Date Range
                </h3>
                <Label className="mb-2 block">Month</Label>
                <Input
                  type="month"
                  ref={inputRef}
                  className="w-full p-3 cursor-pointer"
                  onClick={() => inputRef.current?.showPicker()}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-");
                    setMonth(month);
                    setYear(year);
                    setFromDate(`${year}-${month}-01`);
                    setToDate(`${year}-${month}-31`);
                  }}
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                  onClick={handleViewAttendance}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "View Attendance"}
                </Button>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
            </>
          ) : (
            // <>
            //     <div className="w-full border-t p-6 border border-blue-200 shadow-md mt-8">
            //         <h3 className="text-lg font-semibold mb-4">Select Date</h3>
            //         <Input
            //             type="date"
            //             className="w-full"
            //             value={secdate}
            //             onChange={(e) => setsecdate(e.target.value)}
            //         />
            //         <Button
            //             className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            //             onClick={sechandleViewAttendance}
            //         >
            //             View Attendance
            //         </Button>
            //     </div>
            // </>
            ""
          )}
        </div>
      </aside>

      <main className="flex-1 p-6">
        {tab === "tab1" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Card className="border shadow shadow-blue-400/40  flex flex-col items-center justify-center p-4">
                <div className="text-base text-xl font-serif  text-center">
                  Present Days
                </div>
                <div className="text-3xl font-mono tabular-nums text-green-400 text-center mt-1">
                  {studentAttendance?.filter(
                    (a) => a.status.toLowerCase() === "present"
                  ).length || 0}
                </div>
              </Card>

              <Card className="border shadow shadow-blue-400/40  flex flex-col items-center justify-center p-4">
                <div className="text-base text-xl font-serif  text-center">
                  Half Days
                </div>
                <div className="text-3xl font-mono tabular-nums text-yellow-400 text-center mt-1">
                  {studentAttendance?.filter(
                    (a) => a.status.toLowerCase() === "half day"
                  ).length || 0}
                </div>
              </Card>

              <Card className="border shadow shadow-blue-400/40  flex flex-col items-center justify-center p-4">
                <div className="text-base text-xl font-serif  text-center">
                  Absent Days
                </div>
                <div className="text-3xl font-mono tabular-nums text-red-400 text-center mt-1">
                  {studentAttendance?.filter(
                    (a) => a.status.toLowerCase() === "absent"
                  ).length || 0}
                </div>
              </Card>
            </div>

            <div className="flex gap-6 border-b pb-2 mt-5">
              {["Attendance"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 ${
                    selectedTab === status
                      ? "border-b-2 border-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedTab(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <table className="w-full mt-4 border-collapse">
              <thead>
                <tr className="border">
                  <th className="p-3">ID</th>
                  <th className="p-3">Punch-In</th>
                  <th className="p-3">Punch-Out</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {!month || !year ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center font-semibold text-xl py-4"
                    >
                      Please select month and year
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center font-semibold text-xl py-4"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : studentAttendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center font-semibold text-xl py-4"
                    >
                      No attendance data found
                    </td>
                  </tr>
                ) : (
                  studentAttendance?.map((attendance, index) => (
                    <tr key={index} className="text-center border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{attendance.in_time || "--:--"}</td>
                      <td className="p-3">{attendance.out_time || "--:--"}</td>
                      <td className="p-3">{attendance.attendance_date}</td>
                      <td
                        className={`p-3 ${getStatusClass(attendance.status)}`}
                      >
                        {capitalizeFirstLetter(attendance.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* {tab === "tab2" && secattendance && (
                      <>
                          <h2 className="text-2xl font-bold mb-4">Attendance</h2>
                          <div className="p-6 flex justify-center">
                              <Card className="p-6 shadow-md shadow-blue-500/50 rounded-2xl overflow-hidden border border-gray-100/50 w-full max-w-2xl min-h-[350px]">
                                  <div className="flex justify-between items-center mb-4">
                                      <span className="mt-2 sm:mt-0 px-3 py-2 rounded-full text-xs font-semibold uppercase bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                          {secattendance?.id}
                                      </span>
                                      <span className="mt-2 sm:mt-0 px-4 py-2 rounded-full text-xs font-semibold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                          {secattendance?.status}
                                      </span>
                                  </div>

                                  <div className="space-y-4">
                                      <div className="mt-9">
                                          <Label className="text-sm">Date</Label>
                                          <Input
                                              disabled
                                              value={secattendance?.date || ''}
                                              className="mt-1 bg-gray-100 text-gray-800 font-semibold cursor-not-allowed"
                                          />
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="mt-6">
                                              <Label className="text-sm">In-Time</Label>
                                              <Input
                                                  disabled
                                                  value={secattendance?.inTime || '--:--'}
                                                  className="mt-1 bg-gray-100 text-gray-800 font-bold cursor-not-allowed"
                                              />
                                          </div>

                                          <div className="mt-6">
                                              <Label className="text-sm">Out-Time</Label>
                                              <Input
                                                  disabled
                                                  value={secattendance?.outTime || '--:--'}
                                                  className="mt-1 bg-gray-100 text-gray-800 font-bold cursor-not-allowed"
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </Card>
                          </div>
                      </>
                  )} */}
      </main>
    </div>
  );
};

export default Stu_Attendance;
