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
                  <Card className="shadow-none border-none p-0 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {" "}
                      {[
                        {
                          label: "Total Received",
                          count: emiData?.data?.total_received || 0,
                          borderColor: "border-l-4 border-indigo-500",
                          bgColor: "bg-indigo-50",
                          textColor: "text-indigo-700",
                          link: {
                            pathname: "/paid",
                            state: { source: "dashboard" },
                          },
                        },
                        {
                          label: "Today's Missed Fees",
                          count: emiData?.data?.totalMissedFees || 0,
                          borderColor: "border-l-4 border-rose-500",
                          bgColor: "bg-rose-50",
                          textColor: "text-rose-700",
                          link: {
                            pathname: "/missed",
                            state: { source: "dashboard" },
                          },
                        },
                        {
                          label: "Today's Upcoming Amount",
                          count: emiData?.data?.amount_to_collect || 0,
                          borderColor: "border-l-4 border-amber-500",
                          bgColor: "bg-amber-50",
                          textColor: "text-amber-700",
                          link: {
                            pathname: "/upcoming",
                            state: { source: "dashboard" },
                          },
                        },
                      ].map((item, index) => {
                        const CardContentComponent = (
                          <Card
                            key={index}
                            className={`rounded-xl shadow-sm cursor-pointer w-full ${item.borderColor} ${item.bgColor}`}
                          >
                            <CardContent className="p-5 flex justify-between items-start">
                              <div>
                                <p
                                  className={`text-sm font-medium ${item.textColor}`}
                                >
                                  {item.label}
                                </p>
                                <p className="text-2xl font-semibold mt-1 text-gray-900">
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

                <div className="flex flex-col md:flex-row gap-6 pt-4">
                  <div className="flex-[7]">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Fees Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {chartData.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            📊 No data found to display.
                          </div>
                        ) : (
                          <ChartContainer config={chartConfig}>
                            <AreaChart
                              accessibilityLayer
                              data={chartData}
                              margin={{ left: 12, right: 12 }}
                            >
                              <CartesianGrid vertical={false} />
                              <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                              />
                              <ChartTooltip
                                cursor={false}
                                content={
                                  <ChartTooltipContent indicator="dot" />
                                }
                              />
                              <Area
                                dataKey="totalExpectedAmount"
                                type="natural"
                                fill="var(--color-mobile)"
                                fillOpacity={0.4}
                                stroke="var(--color-mobile)"
                                stackId="a"
                              />
                              <Area
                                dataKey="TotalAmount"
                                type="natural"
                                fill="var(--color-desktop)"
                                fillOpacity={0.4}
                                stroke="var(--color-desktop)"
                                stackId="a"
                              />
                            </AreaChart>
                          </ChartContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex-[3] p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a]">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-black dark:text-white">
                        Department
                      </h2>
                      <a
                        href="#"
                        onClick={() => Navigate("/Departments")}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View All
                      </a>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-md">
                      <Table>
                        <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="text-black dark:text-white text-sm border-b border-gray-300 dark:border-gray-700 px-4 py-2 w-[50px]">
                              S.NO.
                            </TableHead>
                            <TableHead className="text-black dark:text-white text-sm border-b border-gray-300 dark:border-gray-700 px-4 py-2 w-[180px]">
                              Name
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {departments?.departments?.map((dept, index) => (
                            <TableRow
                              key={dept.id}
                              className={`${
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-100 dark:bg-gray-800"
                              } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                            >
                              <TableCell className="px-4 py-2 text-black dark:text-gray-100">
                                {startIndex + index + 1}   
                              </TableCell>
                              <TableCell className="px-4 py-2 text-black dark:text-gray-100 max-w-[180px] truncate">
                                <span title={dept.name}>{dept.name}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full pt-5">
                  <Card
                    className="w-full flex items-center justify-between border p-4 cursor-pointer"
                    onClick={() => navigate("/students")}
                  >
                    <div className="flex items-center gap-3 font-bold min-w-0">
                      <div className="bg-red-100 text-red-500 p-6 rounded-full">
                        <Book size={20} />
                      </div>
                      <div className="truncate ">
                        <p className="text-3xl  font-semibold text-red-500 truncate">
                          {employees?.data?.Students?.count}
                        </p>
                        <p className="text-sm  truncate">
                          Total Active Students
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-gray-500 cursor-pointer"
                      size={18}
                      onClick={() => navigate("/students")}
                    />
                  </Card>

                  <Card
                    className="w-full flex items-center justify-between border p-4 cursor-pointer"
                    onClick={() => navigate("/team")}
                  >
                    <div className="flex items-center gap-3 font-bold min-w-0">
                      <div className="bg-pink-100 text-pink-500 p-6 rounded-full">
                        <Users size={20} />
                      </div>
                      <div className="truncate">
                        <p className="text-3xl font-semibold text-emerald-500 truncate">
                          {employees?.data?.allemploye?.count}
                        </p>
                        <p className="text-sm  truncate">
                          Total Active Employees
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-gray-500 cursor-pointer"
                      size={18}
                      onClick={() => navigate("/team")}
                    />
                  </Card>
                  {/* <Card className="w-full flex items-center justify-between border p-4 bg-white dark:bg-[#0f172a]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-6">
                      <p className="text-base font-semibold text-black dark:text-white">
                        Complaints
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <p className="text-xl font-semibold text-emerald-600">
                            3
                          </p>
                          <span className="text-wrap text-gray-500 dark:text-gray-400">
                            Closed
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-xl font-semibold text-red-500">
                            11
                          </p>
                          <span className="text-wrap text-gray-500 dark:text-gray-400">
                            New
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className="text-gray-500 dark:text-gray-300 cursor-pointer"
                    size={18}
                    onClick={() => navigate("/support")}
                  />
                </Card> */}
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
