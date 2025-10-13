import React, { useEffect, useState } from "react";
import "./Team.css";
import AppSidebar from "../../src/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import { ArrowLeft, Ellipsis, Search, User, Eye, Users } from "lucide-react";
import { Button } from "../../src/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Form, FormMessage } from "../../src/components/ui/form";
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
  CardFooter,
} from "../../src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../src/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../src/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../src/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ThankYouCard from "../Dashboard/ThankYouCard";
import {
  get_Deparment,
  create_department,
  delete_department,
  get_all_available_Access,
} from "../../../Redux_store/Api/Department";
import logo from "../../../assets/Image/intellix.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../component/src/components/ui/select";
import { toast, ToastContainer, Zoom } from "react-toastify";
import No_data_found from "../No_data_found";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../component/src/components/ui/popover";
import { Checkbox } from "../../../component/src/components/ui/checkbox";

const formSchema = z.object({
  Department: z
    .string()
    .min(2, { message: "Department must be at least 2 characters." }),
  access_control: z
    .number()
    .array()
    .nonempty({ message: "Please select at least one access control" }),
});

const Departments = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);
  const isDarkMode = true;
  const navigate = useNavigate();

  const [DeleteDepartments, setDeleteDepartments] = useState(false);
  const [addDepartment, setAddDepartment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState({});
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { Department, AllAccess, loading, error } = useSelector(
    (state) => state.Department || []
  );

  useEffect(() => {
    dispatch(get_all_available_Access(token));
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Department: "",
      access_control: [],
    },
  });

  const handleAddDepartment = async (data) => {
    try {
      const response = await dispatch(
        create_department({
          payload: {
            name: data.Department,
            access_control: data.access_control,
          },
          token,
        })
      ).unwrap();

      if (response.data) {
        toast.success("Department created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
        });
        setAddDepartment(false);
        dispatch(get_Deparment({token, searchName: searchTerm}));
        form.reset();
      }
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "An error occurred";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await dispatch(delete_department({ id, token })).unwrap();
      toast.success("Department Deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
      setDeleteDepartments(false);
      dispatch(get_Deparment({token, searchName: searchTerm}));
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "An error occurred";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
    }
  };

  useEffect(() => {
    dispatch(get_Deparment({ searchName: searchTerm, token }));
  }, [searchTerm, dispatch]);

  // const departmentsPerPage = 9;
  // const totalPages = Department
  //   ? Math.ceil(Department.length / departmentsPerPage)
  //   : 1;
  // const startIndex = (currentPage - 1) * departmentsPerPage;
  // const selectedDepartments = Department?.slice(
  //   startIndex,
  //   startIndex + departmentsPerPage
  // );

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
            <div className="flex items-center gap-3">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                onClick={() => navigate("/team")}
              >
                <ArrowLeft size={18} />
                <span className="hidden lg:inline">Back to Department</span>
              </Button>
              <Button
                onClick={() => setAddDepartment(true)}
                className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                + Add Department
              </Button>
              {/* Add Department Dialog */}
              <Dialog open={addDepartment} onOpenChange={setAddDepartment}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Department</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleAddDepartment)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="Department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Department Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="access_control"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Access Control</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="justify-between"
                                >
                                  {field.value?.length > 0
                                    ? `${field.value.length} selected`
                                    : "Select Access"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-2">
                                <div className="flex flex-col space-y-1 max-h-60 overflow-y-auto">
                                  {AllAccess?.department?.map((item) => {
                                    const isChecked = field.value?.includes(
                                      item.id
                                    );
                                    return (
                                      <div
                                        key={item.id}
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => {
                                          const newValue = isChecked
                                            ? field.value.filter(
                                                (v) => v !== item.id
                                              )
                                            : [...(field.value || []), item.id];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <Checkbox checked={isChecked} />
                                        <span>{item.name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Submit
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search Department..."
                className="ml-2 w-full outline-none bg-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="h-screen flex items-center justify-center">
              <div className="relative flex justify-center items-center">
                <div className="absolute rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                <img
                  src={logo}
                  alt="Loading"
                  className="rounded-full h-28 w-28"
                />
              </div>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-lg border border-red-600 bg-gray-800 p-5 text-sm text-red-400">
              <strong className="font-bold">Error:</strong>{" "}
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong. Please try again."}
            </div>
          ) : Department?.length === 0 ? (
            <div className="flex justify-center items-center h-64 mt-9 pt-9 text-gray-500 text-lg">
              <No_data_found />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
              {Department?.map((department) => (
                <Card
                  key={department.id}
                  className="w-full max-w-[320px]  shadow-md shadow-blue-500/50 rounded-xl p-6 relative mx-auto"
                >
                  {/* Department Name at the Top */}
                  <CardTitle className="text-lg font-extrabold">
                    <span>{department.departmentName}</span>
                  </CardTitle>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                        <Ellipsis className="text-gray-500" size={24} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 mt-1 shadow-md rounded-md"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDepartmentId(department.id);
                          setDeleteDepartments(true);
                        }}
                        className="cursor-pointer text-red-500 hover:bg-gray-100 px-4 py-2 text-md text-center "
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Delete Confirmation Dialog */}
                  <Dialog
                    open={DeleteDepartments}
                    onOpenChange={setDeleteDepartments}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Department</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to deactivate?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex justify-center mt-4">
                        <Button
                          onClick={() => {
                            handleDeleteDepartment(selectedDepartmentId);
                            setDeleteDepartments(false);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <CardHeader className="flex flex-col items-center mt-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <Users size={24} className="text-blue-500" />
                        {/* <span className="text-sm text-gray-400">
                          {department.access_control}
                        </span> */}
                        <span
                          className="text-lg font-bold inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap align-middle"
                          title={department.name}
                        >
                          {department.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Chart Section */}
                  {/* <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[180px] [&_.recharts-text]:fill-background"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent nameKey="count" hideLabel />
                          }
                        />
                        <Pie data={chartData} dataKey="count">
                          <LabelList
                            dataKey="category"
                            className="fill-background"
                            stroke="none"
                            fontSize={9}
                            formatter={(value) =>
                              chartConfig[value]
                                ? chartConfig[value].label
                                : value
                            }
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent> */}

                  {/* Card Footer Buttons */}
                  <CardFooter className="flex justify-center gap-4 mt-1">
                    <Button
                      onClick={() => navigate(`/View_User/${department.id}`)}
                      className="bg-blue-600 text-xs text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-500 transition-all"
                    >
                      <User size={18} /> View User
                    </Button>

                    <Button
                      onClick={() => {
                        navigate(`/Access/${department.id}`);
                      }}
                      className="bg-orange-500 text-xs text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-orange-600 transition-all"
                    >
                      <Eye size={18} /> Access
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* <Pagination>
          <PaginationContent className="flex justify-center gap-2 py-4">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                // className="bg-gray-700 text-gray-100 border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                // className="bg-gray-700 text-gray-100 border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Departments;
