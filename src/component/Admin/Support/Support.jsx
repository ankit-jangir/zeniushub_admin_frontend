import React, { useState, useEffect } from "react";
import { Button } from "../../src/components/ui/button";
import { Card } from "../../src/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../src/components/ui/tabs";
import { Input } from "../../src/components/ui/input";
import myimg from "../Support/images/ki.jpeg";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { Separator } from "../../src/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/ui/breadcrumb";
import Header from "../Dashboard/Header";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const Support = () => {
  const initialTickets = [
    {
      id: 1,
      title: "Nshans",
      description: "marksheet 1",
      status: "solved",
      image: myimg,
      solvedAt: new Date("2025-03-18T15:27:07"),
      message:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    },
    {
      id: 2,
      title: "This is complaining",
      description: "Here is doubt",
      user: "mohan",
      status: "unsolved",
      image: myimg,
      solvedAt: null,
    },
    {
      id: 3,
      title: "gone wrong",
      description: "something",
      user: "mohan",
      status: "unsolved",
      image: myimg,
      solvedAt: null,
    },
    {
      id: 4,
      title: "gone wrong",
      description: "something",
      user: "mohan",
      status: "unsolved",
      image: myimg,
      solvedAt: null,
    },
    {
      id: 10,
      title: "hans",
      description: "marksheet 2",
      status: "solved",
      image: myimg,
      solvedAt: new Date("2025-03-18T15:27:07"),
      message:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    },
    {
      id: 11,
      title: "Nshans",
      description: "marksheet 3",
      status: "solved",
      image: myimg,
      solvedAt: new Date("2025-03-18T15:27:07"),
      message:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    },
  ];

  const [activeTab, setActiveTab] = useState("unsolved");
  const [search, setSearch] = useState("");
  const [ticketData, setTicketData] = useState(initialTickets);

  // Debugging ke liye useEffect
  useEffect(() => {
    console.log("Active Tab:", activeTab);
    console.log(
      "Filtered Tickets:",
      ticketData.filter(
        (ticket) =>
          ticket.status === activeTab &&
          ticket.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [activeTab, search, ticketData]);

  return (
    <>
      <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
        <AppSidebar />
        <SidebarInset>
          <Header />

          <div className="w-full">
            <div className="p-4 md:p-8 max-w-10xl w-full">
              <div className="flex justify-between">
                <div>
                  <Tabs
                    defaultValue="unsolved"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex justify-self-start mb-4 md:mb-6"
                  >
                    <TabsList className="p-2 rounded-lg inline-flex shadow-sm">
                      <TabsTrigger
                        value="unsolved"
                        className={`px-4 md:px-6 py-2 rounded-md font-medium transition-all ${activeTab === "unsolved"
                          ? "bg-indigo-600 text-white"
                          : "hover:bg-gray-200"
                          }`}
                      >
                        Unsolved
                      </TabsTrigger>
                      <TabsTrigger
                        value="solved"
                        className={`px-4 md:px-6 py-2 rounded-md font-medium transition-all ${activeTab === "solved"
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-200"
                          }`}
                      >
                        Solved
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4 mb-4 md:mb-6">
                  <Input
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 lg:w-2/3 border-gray-300 rounded-lg px-4 py-2 shadow-sm"
                  />

                  <Button className="bg-blue-800 hover:bg-blue-900 text-white px-4 md:px-6 py-2 rounded-lg shadow-lg transition-all">
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketData
                  .filter(
                    (ticket) =>
                      ticket.status === activeTab &&
                      ticket.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="shadow-md shadow-blue-500/50 rounded-xl p-4 md:p-6 flex flex-col gap-4 items-center transition-transform hover:scale-105 w-full"
                    >
                      <img
                        src={ticket.image}
                        alt={ticket.title}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-lg border shadow-sm object-cover"
                      />
                      <div className="text-center">
                        <h2 className="text-lg md:text-xl font-semibold">
                          {ticket.title}
                        </h2>
                        <p className="text-sm">{ticket.user || "N/A"}</p>
                        <p className="text-sm mt-1 md:mt-2">
                          {ticket.description}
                        </p>
                        {ticket.status === "unsolved" && (
                          <Button className="mt-3 md:mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all">
                            Mark as Solved
                          </Button>
                        )}
                        {ticket.status === "solved" && (
                          <div className="mt-3 md:mt-4">
                            <p className="text-xs text-gray-300 flex items-center justify-center">
                              <CalendarIcon className="mr-1 h-3 w-3" />{" "}
                              {ticket.solvedAt
                                ? format(ticket.solvedAt, "yyyy-MM-dd HH:mm:ss")
                                : "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {ticket.message}
                            </p>
                            <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all">
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Support;