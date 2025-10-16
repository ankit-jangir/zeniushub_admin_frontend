import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { CreditCard, Search } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { EmployeeAccount } from "../../../Redux_store/Api/team_account_api";
import No_data_found from "../No_data_found";
import logo from "../../../assets/Image/zeniushub.png";
const Employee = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch();
  const { Account, loading, error } = useSelector(
    (state) => state.salary || []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const finalAmount = Account?.data?.departments.reduce(
      (acc, emp) => acc + emp.monthly_salary,
      0
    );
    const duration = 1000;
    const step = Math.ceil(finalAmount / (duration / 50));

    let start = 0;
    const counter = setInterval(() => {
      start += step;
      if (start >= finalAmount) {
        start = finalAmount;
        clearInterval(counter);
      }
      setTotalAmount(start);
    }, 50);
  }, []);

  useEffect(() => {
    dispatch(EmployeeAccount({ token, search: searchTerm }));
  }, [searchTerm, token, dispatch]);

  //   const EmployeesPerPage = 6;
  //   const totalPages = Math.ceil(EmployeeList.length / EmployeesPerPage);
  //   const startIndex = (currentPage - 1) * EmployeesPerPage;
  //   const selectedEmployee = EmployeeList.slice(
  //     startIndex,
  //     startIndex + EmployeesPerPage
  //   );

  return (
    <div className="flex flex-col items-center p-4 space-y-8 w-full max-w-7xl mx-auto">
      {/* Total Amount Card */}
      <Card className="w-full shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            Total Amount
          </CardTitle>
          <CreditCard className="w-7 h-7 text-blue-600" />
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <span className="text-4xl font-bold text-blue-600">
            ₹{" "}
            {Number(
              totalAmount || Account?.data?.total_monthly_salary || 0
            ).toLocaleString("en-IN")}
          </span>
        </CardContent>
        <CardFooter className="justify-center pb-4">
          <CardDescription className="font-medium text-gray-600 dark:text-gray-400">
            Updated Amount
          </CardDescription>
        </CardFooter>
      </Card>

      {/* Search Bar */}
      <div className="w-full">
        <div className="flex items-center max-w-md  bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-300 dark:border-gray-700">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full outline-none bg-transparent text-sm"
          />
        </div>
      </div>

      {/* Employee Cards */}
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
            <img src={logo} alt="Loading" className="rounded-full h-28 w-28" />
          </div>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg border border-red-600 bg-gray-800 p-5 text-sm text-red-400">
          <strong className="font-bold">Error:</strong>{" "}
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong. Please try again."}
        </div>
      ) : Account?.data?.departments?.length === 0 ? (
        <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
          <No_data_found />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Account?.data?.departments.map((emp) => (
            <Card
              key={emp.department_id}
              className="rounded-xl border shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle
                  className="text-blue-600 text-lg font-bold truncate max-w-[220px]"
                  title={emp.department_name}
                >
                  Department : {emp.department_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-semibold">Amount : </span> ₹{" "}
                  {emp.monthly_salary.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Users : </span>{" "}
                  {emp.total_employees}
                </p>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    navigate(
                      `/Accounts/Department_list_Employee/${emp.department_id}`
                    )
                  }
                >
                  View Department
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination */}
      {/* <Pagination className="pt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                as="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-blue-800"
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
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  );
};

export default Employee;
