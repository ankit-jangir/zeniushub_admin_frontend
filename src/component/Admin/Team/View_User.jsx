import React, { useEffect, useState } from "react";
import "./Team.css";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import {
  ArrowLeft,
  Calendar,
  Eye,
  GraduationCap,
  Mail,
  Search,
} from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
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
} from "../../src/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { view_department_users } from "../../../Redux_store/Api/Department";
import logo from "../../../assets/Image/intellix.png";
import { Badge } from "../../src/components/ui/badge";
import No_data_found from "../No_data_found";

const View_User = () => {
  const base_img_url = "https://adminv2-api-dev.intellix360.in/";
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { Department, loading, error } = useSelector(
    (state) => state.Department
  );

  useEffect(() => {
    if (urlId) {
      dispatch(view_department_users({ body: { id: Number(urlId) }, token }));
    }
  }, [dispatch, urlId]);

  const departmentId = Number(urlId);
  const employees = Array.isArray(Department)
    ? Department
    : Department?.users || [];
  const filteredEmployees = employees.filter((user) =>
    user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserPerPage = 12;
  const totalPages = Math.ceil(filteredEmployees.length / UserPerPage);
  const startIndex = (currentPage - 1) * UserPerPage;
  const selectedUser = filteredEmployees.slice(
    startIndex,
    startIndex + UserPerPage
  );

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          {/* Top Header */}
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
            <Button
              className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back to Department</span>
            </Button>

            {/* Search Input */}
            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-auto sm:w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="By Employee Name..."
                className="ml-2 w-full outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Loading, Error or Cards */}
          {/* {loading ? (
                    <div className="h-screen w-full flex items-center justify-center text-white">
                      <div className="relative flex justify-center items-center">
                        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                        <img
                          src={logo}
                          alt="Loading"
                          className="rounded-full h-28 w-28"
                        />
                      </div>
                    </div>
                  ) : error ? (
                    <div>Error: {error?.message ? (
                      <div className="text-red-700"> {error.message}</div>
                    ) : ""}</div>
                  ) : ( */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {selectedUser.length > 0 ? (
              selectedUser.map((user) => (
                <div
                  key={user.id}
                  className="max-w-sm w-full shadow-lg border p-0 overflow-hidden rounded-lg dark:shadow-md dark:shadow-blue-500/40"
                >
                  {/* Card Header */}
                  <div className="flex flex-row items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.image_path
                            ? `${base_img_url}viewimagefromazure?filePath=${user?.image_path}`
                            : "https://img.freepik.com/premium-vector/man-profile_1083548-15963.jpg"
                        }
                        alt="user"
                        className="w-16 h-16 rounded-full border-2 border-blue-500 dark:border-blue-400 object-cover"
                      />
                      <h2
                        className="text-base font-semibold dark:text-gray-400 text-gray-800 truncate max-w-[120px]"
                        title={user.first_name || "No Name"}
                      >
                        {user.first_name || "No Name"}
                      </h2>
                    </div>
                    <Badge
                      className={`text-xs px-3 py-0.5 rounded-full ${user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {user.status || "Inactive"}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 text-sm dark:text-gray-500 text-gray-700">
                    <div className="flex gap-2">
                      <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-medium">Email:</span>
                        <span
                          className="truncate text-sm font-semibold text-gray-700"
                          title={user.email || "N/A"}
                        >
                          {user.email || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="flex flex-col max-w-[150px]">
                        <span className="font-medium">Join Date:</span>
                        <span
                          className="truncate text-sm font-semibold text-gray-700"
                          title={
                            user.joining_date
                              ? new Date(user.joining_date).toLocaleDateString()
                              : "N/A"
                          }
                        >
                          {user.joining_date
                            ? new Date(user.joining_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="flex flex-col max-w-[180px]">
                        <span className="font-medium">Qualification:</span>
                        <span
                          className="truncate text-sm font-semibold text-gray-700"
                          title={user.highest_qualification || "N/A"}
                        >
                          {user.highest_qualification || "N/A"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/employee/view-profile/${user.id}`)
                      }
                      className="w-full mt-4 py-2 text-sm font-medium text-white rounded-md bg-blue-900 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-lg">
                <No_data_found />
              </div>
            )}
          </div>

          {/* )} */}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="flex justify-center mt-6 mb-4">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      as="button"
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
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

export default View_User;
