import React, { useContext, useState } from "react";
import { Button } from "../../../src/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Card } from "../../../src/components/ui/card";
import { Input } from "../../../src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../src/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/components/ui/table";
import { DownloadCloud } from "lucide-react";
import ThemeContext from "../../Dashboard/ThemeContext";

const MyLeads = () => {
  const [data, setData] = useState([
    {
      name: "John Doe",
      phone: "123-456-7890",
      email: "john.doe@example.com",
      address: "123 Main St",
      date: "2024-07-24",
      category: "Category A",
      status: "Hot",
      assigned: "Jane Smith",
    },
    {
      name: "Jane Smith",
      phone: "987-654-3210",
      email: "jane.smith@example.com",
      address: "456 Oak Ave",
      date: "2024-07-23",
      category: "Category B",
      status: "In Conversation",
      assigned: "John Doe",
    },
    {
      name: "Peter Jones",
      phone: "555-123-4567",
      email: "peter.jones@example.com",
      address: "789 Pine Ln",
      date: "2024-07-22",
      category: "Category A",
      status: "Dropped",
      assigned: "Jane Smith",
    },
    {
      name: "Mary Brown",
      phone: "111-222-3333",
      email: "mary.brown@example.com",
      address: "321 Cedar Rd",
      date: "2024-07-21",
      category: "Category C",
      status: "Converted",
      assigned: "John Doe",
    },
    {
      name: "David Wilson",
      phone: "444-555-6666",
      email: "david.wilson@example.com",
      address: "654 Birch Ct",
      date: "2024-07-20",
      category: "Category B",
      status: "Hot",
      assigned: "Jane Smith",
    },
  ]);

  const [tab, setTab] = useState("tab1");
  const [showFilters, setShowFilters] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const goBack = () => {
    window.history.back();
  };

  const getFilteredData = () => {
    switch (tab) {
      case "tab2":
        return data.filter((item) => item.status === "Hot");
      case "tab3":
        return data.filter((item) => item.status === "In Conversation");
      case "tab4":
        return data.filter((item) => item.status === "Dropped");
      case "tab5":
        return data.filter((item) => item.status === "Converted");
      default:
        return data;
    }
  };

  const handleTabClick = (selectedTab) => {
    setTab(selectedTab);
    setShowFilters(selectedTab === "tab1"); // Show filters only for "All Leads"
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-gray-50 w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <aside className="md:w-64 w-full p-6 shadow-md flex flex-col gap-4">
        <Button
          onClick={goBack}
          className="flex items-center gap-2 bg-white hover:bg-white text-black border border-gray-300"
        >
          <ArrowLeft className="w-3 h-5" /> Leads
        </Button>

        <Button
          className={`w-full text-white mb-4 mt-3 ${tab === "tab1" ? "bg-blue-600" : ""
            }`}
          onClick={() => handleTabClick("tab1")}
        >
          All Leads
        </Button>

        {/* Agar "All Leads" click kiya ho toh sab dikhao, warna sirf active tab */}
        {(showFilters || tab !== "tab1") && (
          <>
            <Button
              className={`w-full text-white mt-2 ${tab === "tab2" ? "bg-blue-600" : ""
                }`}
              onClick={() => handleTabClick("tab2")}
            >
              Hot
            </Button>
            <Button
              className={`w-full text-white mt-2 ${tab === "tab3" ? "bg-blue-600" : ""
                }`}
              onClick={() => handleTabClick("tab3")}
            >
              In Conversation
            </Button>
            <Button
              className={`w-full text-white mt-2 ${tab === "tab4" ? "bg-blue-600" : ""
                }`}
              onClick={() => handleTabClick("tab4")}
            >
              Dropped
            </Button>
            <Button
              className={`w-full text-white mt-2 ${tab === "tab5" ? "bg-blue-600" : ""
                }`}
              onClick={() => handleTabClick("tab5")}
            >
              Converted
            </Button>
          </>
        )}
      </aside>
      <div className="min-h-screen  w-full p-4">
        <Card className="p-4 mb-4 shadow-sm w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-center w-full">
            <Input type="date" className="w-full md:col-span-2 lg:col-span-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white md:col-span-2 lg:col-span-2">
                  All Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Set Default</DropdownMenuItem>
                <DropdownMenuItem>Hot</DropdownMenuItem>
                <DropdownMenuItem>In Conversation</DropdownMenuItem>
                <DropdownMenuItem>Dropped</DropdownMenuItem>
                <DropdownMenuItem>Converted</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white md:col-span-2 lg:col-span-2">
                  All Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Set Default</DropdownMenuItem>
                <DropdownMenuItem>industory2</DropdownMenuItem>
                <DropdownMenuItem>industory</DropdownMenuItem>
                <DropdownMenuItem>system</DropdownMenuItem>
                <DropdownMenuItem>tr</DropdownMenuItem>
                <DropdownMenuItem>fsfd</DropdownMenuItem>
                <DropdownMenuItem>ghd</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white md:col-span-2 lg:col-span-2">
              <DownloadCloud size={18} /> Export Data
            </Button>
          </div>

          <div className="flex justify-between mt-4 w-full">
            <Input className="w-[200px]" placeholder="Search all fields" />
            <div className="flex justify-end gap-2">
              <Button className="bg-blue-600 text-white">Search</Button>
              <Button className="bg-blue-600 text-white">Clear</Button>
            </div>
          </div>
        </Card>

        <Card className="w-full overflow-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-orange-100 to-orange-200 text-white sticky top-0 z-10 dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-500">
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredData().length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-red-500 font-medium py-4"
                  >
                    No Results Found!
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredData().map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.assigned}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <ChevronRight size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuItem>Assign Leads</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default MyLeads;
