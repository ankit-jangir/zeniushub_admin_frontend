import React, { useState } from "react";
import "./sidebar.css";
import zeniushub_icon from "../../../assets/Image/zeniushub.png";
import { X, Grip, Home, Inbox, User, Users, Wallet, ChartColumnIncreasing, CircleHelp, Settings, Coins } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../src/components/ui/sidebar";
 
export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Expenses", url: "/Expenses", icon: Coins },
    { title: "Inbox", url: "/inbox", icon: Inbox },
    { title: "Teacher", url: "/teacher", icon: User },
    { title: "Students", url: "/students", icon: Users },
    { title: "Accounts", url: "/accounts", icon: Wallet },
    { title: "Attendance", url: "/attendance", icon: ChartColumnIncreasing },
    { title: "Team", url: "/team", icon: Users },
    { title: "Support", url: "/support", icon: CircleHelp },
    { title: "Settings", url: "/settings", icon: Settings },
  ];
  
  return (
    <SidebarProvider>
      <div className="relative">
        <button 
          onClick={toggleSidebar}
          className="absolute -right-6 bg-white dark:bg-gray-900 p-6 shadow-m"
        >
          {isOpen  ?<Grip size={24} className="" /> :<X size={24} className="none" />  }
        </button>
        <Sidebar className={`fixed left-0 top-0 h-full shadow-xl transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
          <SidebarHeader>
            <div className="flex items-center gap-3 ps-2">
             <img sizes={25} className="w-15 h-10 " src={zeniushub_icon} alt="zeniushub Logo" />
              {isOpen && <h5 className="text-xl font-semibold">zeniushub</h5>}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {items.map(({ title, url, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={url}
                        className="flex items-center gap-4 p-3 rounded-lg transition-all  hover:bg-blue-600 hover:text-white "
                      >
                        <Icon className=" hover:text-white" size={25} />
                        {isOpen && (
                          <span className="text-lg font-medium">{title}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 text-center text-sm text-gray-400">© 2024 zeniushub</div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}

export default AppSidebar;
