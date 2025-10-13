import React, { useEffect, useState } from "react";
import Header from "../Dashboard/Header";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { Button } from "@headlessui/react";
import { ArrowLeft, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "../../src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../src/components/ui/form";
import { Input } from "../../src/components/ui/input";
import Students from "./Students";
import Employee from "./Employee";
import { useLocation } from "react-router";

const Account = () => {
  // const [activeTab, setActiveTab] = useState('');

  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const fromAccounts = location?.state?.from === "accounts"; 
    if (fromAccounts) return "Student";
    return localStorage.getItem("activeTab") || "Student";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
            <div className="flex items-center gap-3">
              {/* <button
                                className={`rounded-md px-9 py-2 text-sm font-medium ${activeTab === 'Student' ? 'bg-blue-600 text-white' :  'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}`}
                                onClick={() => setActiveTab('Student')}
                            >
                              Students Account
                            </button>
                            <button
                               className={`rounded-md px-9 py-2 text-sm font-medium ${activeTab === 'Employee' ? 'bg-blue-600 text-white' :  'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}`}
                                onClick={() => setActiveTab('Employee')}
                            >
                                Employee Account
                            </button> */}

              <button
                className={`rounded-md px-9 py-2 text-sm font-medium ${
                  activeTab === "Student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => handleTabChange("Student")}
              >
                Students Account
              </button>

              <button
                className={`rounded-md px-9 py-2 text-sm font-medium ${
                  activeTab === "Employee"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => handleTabChange("Employee")}
              >
                Employee Account
              </button>
            </div>
          </div>

          <div className="mt-6 p-4">
            {activeTab === "Student" ? (
              <div>
                <Students />
              </div>
            ) : (
              <div>
                <Employee />
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Account;
