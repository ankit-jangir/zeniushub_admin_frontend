import React, { useEffect, useState } from "react";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../src/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../src/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";

import No_data_found from "../No_data_found";
import { fetch_department_list } from "../../../Redux_store/Api/team_account_api";
 const base_img_url = "https://adminv2-api-dev.intellix360.in/";
 let token = localStorage.getItem("token");
 const Department_list_Employee = () => {
  const goBack = () => {
    window.history.back();
  };
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.salary);
  const { id } = useParams();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(
        fetch_department_list({
          department: id,
          name: search,
          limit: 10,
          page: currentPage,
          token
        })
      );
    }
  }, [id, search, currentPage, dispatch]);

  const Employees = data?.data?.employees || [];
  const totalPages = data?.data?.totalPages || 1;
  const page = data?.data?.currentPage || 1;
  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          {/* Top bar */}
          <div className="w-full rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3 border-b shadow-sm shadow-gray-500/50">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              onClick={goBack}
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">
                Back to Employees Account
              </span>
            </Button>
            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-auto sm:w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="By Employee Name..."
                className="ml-2 w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Employee cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {Employees.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg font-medium py-12">
                <No_data_found />
              </div>
            ) : (
              Employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="w-full max-w-sm rounded-xl border shadow-md shadow-gray-500/50 transition-shadow duration-300 mx-auto"
                >
                  <CardHeader className="flex flex-col items-center text-center pt-6 px-6">
                    <Avatar className="w-24 h-24 shadow-lg rounded-full border-4 border-blue-600">
                    <AvatarImage
                      src={
                          employee.img
                            ? `${base_img_url}viewimagefromazure?filePath=${employee?.img}`
                            : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg"
                        }
                      alt={employee.name}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback className="text-lg font-semibold text-white bg-blue-600">
                      {employee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                    <CardTitle
                      className="mt-4 text-[20px] font-semibold truncate w-[170px] text-gray-900 dark:text-white "
                      title={employee.name}
                    >
                      {employee.name}
                    </CardTitle>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Employee
                    </p>
                  </CardHeader>
                  
                  <CardContent className="mt-4 px-6 space-y-3">
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white  font-medium ">
                      <span>Salary</span>
                      <span className="text-blue-600 font-semibold truncate w-[70px] inline-block" title={parseFloat(employee.salary).toLocaleString("en-IN")}>
                        ₹ {parseFloat(employee.salary).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-900 dark:text-white  font-medium">
                      <span>Total Transaction</span>
                      <span className="text-blue-600 font-semibold">
                        ₹ {employee.total_transactions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white  font-medium">
                      <span>Total Amount</span>
                      <span className="text-blue-600 font-semibold">
                        ₹{" "}
                        {parseFloat(employee.total_salary).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-4">
                    <Button
                      onClick={() => navigate(`/manage_salary/${employee.id}`)}
                      variant="outline"
                      className="w-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 font-medium text-sm py-2"
                    >
                      View Transactions
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && Employees.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      as="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-md ${
                        page === i + 1
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Department_list_Employee;
