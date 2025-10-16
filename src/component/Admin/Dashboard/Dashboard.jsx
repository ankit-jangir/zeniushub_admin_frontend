import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../src/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";
import { ChevronRight } from "lucide-react";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import {
  Employesss,
  Department,
  Emi,
  todaysummary,
} from "../../../Redux_store/Api/Dashboard.Api";
import {
  fetchEmis,
  getEmisTotalAmounts,
} from "../../../Redux_store/Api/EmisApiStore";
import { Users, Book } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = ({ children }) => {
  const [page, setPage] = useState(1);
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const dispaatch = useDispatch();
  const Navigate = useNavigate();
  const sessionID = useSelector((state) => state.session?.selectedSession);
  const { employees, loading, error } = useSelector(
    (state) => state.Employesss || {}
  );
  const departments = useSelector((state) => state.Employesss || []);
  const emi = useSelector((state) => state.Employesss.emi || "Loading");

  useEffect(() => {
    dispaatch(Department(token));
  }, [dispaatch]);

  useEffect(() => {
    if (sessionID != null) {
      dispaatch(Employesss({ sessionID, token }));
    }
  }, [dispaatch, sessionID]);

  useEffect(() => {
    if (sessionID != null) {
      dispaatch(Emi({ sessionID, token }));
    }
  }, [dispaatch, sessionID]);

  const { data } = useSelector((state) => state.emis);

  const emiData = useSelector((state) => state.Employesss.emiData || []);
  console.log(emiData);

  useEffect(() => {
    dispaatch(todaysummary(token));
  }, [dispaatch]);
  const chartData =
    emi?.data?.monthlyData?.map((item) => ({
      month: item.month.split(" ")[0],
      TotalAmount: item.totalReceivedAmount,
      totalExpectedAmount: item.totalExpectedAmount,
    })) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <>
      <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col md:flex-row min-h-screen">
              {/* Main Content */}
              <div className="flex-1 p-4">
                {/* Stats Cards */}
                <div className="w-full">
                  <Card className="shadow-none border-none p-0 mt-4 bg-white dark:bg-[#0B1120]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        {
                          label: "Total Received",
                          count: emiData?.data?.total_received || 0,
                          borderColor: "border-l-4 border-orange-500",
                          bgColor: "bg-orange-50 dark:bg-orange-900/20",
                          textColor: "text-orange-700 dark:text-orange-400",
                          hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
                          link: {
                            pathname: "/paid",
                            state: { source: "dashboard" },
                          },
                        },
                        {
                          label: "Today's Missed Fees",
                          count: emiData?.data?.totalMissedFees || 0,
                          borderColor: "border-l-4 border-rose-500",
                          bgColor: "bg-rose-50 dark:bg-rose-900/20",
                          textColor: "text-rose-700 dark:text-rose-400",
                          hover: "hover:bg-rose-100 dark:hover:bg-rose-900/30",
                          link: {
                            pathname: "/missed",
                            state: { source: "dashboard" },
                          },
                        },
                        {
                          label: "Today's Upcoming Amount",
                          count: emiData?.data?.amount_to_collect || 0,
                          borderColor: "border-l-4 border-indigo-600",
                          bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
                          textColor: "text-indigo-700 dark:text-indigo-400",
                          hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
                          link: {
                            pathname: "/upcoming",
                            state: { source: "dashboard" },
                          },
                        },
                      ].map((item, index) => {
                        const CardContentComponent = (
                          <Card
                            key={index}
                            className={`rounded-xl shadow-md transition-all duration-300 cursor-pointer w-full ${item.borderColor} ${item.bgColor} ${item.hover}`}
                          >
                            <CardContent className="p-6 flex justify-between items-start">
                              <div>
                                <p className={`text-sm font-semibold ${item.textColor}`}>
                                  {item.label}
                                </p>
                                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                                  {item.count}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );

                        return item.link ? (
                          <Link to={item.link} key={index}>
                            {CardContentComponent}
                          </Link>
                        ) : (
                          CardContentComponent
                        );
                      })}
                    </div>
                  </Card>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 pt-4">
                  {/* ===== Fees Overview Chart Section ===== */}
                  <div className="flex-[7]">
                    <Card className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-orange-50 dark:bg-[#1e293b] rounded-t-lg">
                        <CardTitle className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                          Fees Overview
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-6">
                        {chartData.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            📊 No data found to display.
                          </div>
                        ) : (
                          <ChartContainer config={chartConfig}>
                            <AreaChart
                              data={chartData}
                              margin={{ left: 8, right: 8, top: 12, bottom: 8 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(0,0,0,0.1)"
                                opacity={0.5}
                              />
                              <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                tickFormatter={(value) => value.slice(0, 3)}
                              />
                              <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                              />
                              <Area
                                dataKey="totalExpectedAmount"
                                type="monotone"
                                stroke="#f97316"
                                fill="#f97316"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Area
                                dataKey="TotalAmount"
                                type="monotone"
                                stroke="#2563eb"
                                fill="#2563eb"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                            </AreaChart>
                          </ChartContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* ===== Department Table Section ===== */}
                  <div className="flex-[3] bg-white dark:bg-[#0f172a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Department
                      </h2>
                      <button
                        onClick={() => Navigate("/Departments")}
                        className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-md custom-scrollbar">
                      <Table>
                        <TableHeader className="bg-orange-50 dark:bg-[#1e293b] sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="text-gray-800 dark:text-gray-100 text-sm border-b border-gray-300 dark:border-gray-700 px-4 py-2 w-[60px]">
                              #
                            </TableHead>
                            <TableHead className="text-gray-800 dark:text-gray-100 text-sm border-b border-gray-300 dark:border-gray-700 px-4 py-2">
                              Name
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {departments?.departments?.map((dept, index) => (
                            <TableRow
                              key={dept.id}
                              className={`transition-colors duration-200 ${index % 2 === 0
                                ? "bg-white dark:bg-gray-900"
                                : "bg-gray-50 dark:bg-gray-800"
                                } hover:bg-orange-50 dark:hover:bg-[#1e293b]`}
                            >
                              <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100">
                                {startIndex + index + 1}
                              </TableCell>
                              <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                                <span title={dept.name}>{dept.name}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-5">
                  {/* ===== Active Students Card ===== */}
                  <Card
                    onClick={() => navigate("/students")}
                    className="group relative overflow-hidden w-full rounded-3xl p-6 cursor-pointer 
      bg-gradient-to-br from-orange-50 to-white dark:from-[#1a202c] dark:to-[#111827] 
      border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 
          text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                          <Book size={24} />
                        </div>
                        <div className="truncate">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                            {employees?.data?.Students?.count}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            Total Active Students
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                    {/* Optional subtle background pattern */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-200/20 dark:bg-orange-500/10 rounded-full pointer-events-none"></div>
                  </Card>

                  {/* ===== Active Employees Card ===== */}
                  <Card
                    onClick={() => navigate("/team")}
                    className="group relative overflow-hidden w-full rounded-3xl p-6 cursor-pointer 
      bg-gradient-to-br from-blue-50 to-white dark:from-[#1a202c] dark:to-[#111827] 
      border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 
          text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          <Users size={24} />
                        </div>
                        <div className="truncate">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                            {employees?.data?.allemploye?.count}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            Total Active Employees
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 transition-colors">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full pointer-events-none"></div>
                  </Card>
                </div>

              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default Dashboard;
