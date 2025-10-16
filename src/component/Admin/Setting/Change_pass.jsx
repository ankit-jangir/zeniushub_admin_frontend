import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import Header from "../Dashboard/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import Update from "./Update";
import View_profile from "./View_profile";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import PasswordChange from "./PasswordChange";

const FormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

const Settings = () => {
  const [tab, setTab] = useState(1);

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      {/* Pass setActivePage to Sidebar */}
      <AppSidebar />
      <SidebarInset>
        <Header />
        {/* Main Content Section */}
        <main className="flex-1 overflow-auto">
          <div className="flex flex-1 flex-col gap-4 pt-0">
            <div className="shadow-md shadow-blue-300/30">
              <Disclosure as="nav" className="shadow">
                <div className="px-4 lg:px-8 py-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setTab(1)}
                      className={`w-full rounded-md px-3 py-2 text-[12px] font-medium ${tab === 1
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => setTab(2)}
                      className={`w-full rounded-md px-3 py-2 text-[13px] font-medium ${tab === 2
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      Change Password
                    </button>

                    <button
                      onClick={() => setTab(3)}
                      className={`w-full rounded-md px-3 py-2 text-[13px] font-medium ${tab === 3
                        ? "bg-blue-900 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </Disclosure>
            </div>

            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              {tab === 1 && (
                <div className="pt-6">
                  <View_profile />
                </div>
              )}

              {tab === 2 && <PasswordChange />}

              {tab === 3 && <Update />}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Settings;
