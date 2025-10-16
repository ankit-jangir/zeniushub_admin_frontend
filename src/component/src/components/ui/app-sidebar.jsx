import React from "react";
import { useNavigate } from "react-router-dom";
import zeniushub from "../../../../assets/Image/intellix.png";
import { Grip, Home, User, Users, Wallet, ChartColumnIncreasing, CircleHelp, Settings, Clipboard, ListFilterPlus, FileBadge, X, Coins } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarRail,
} from "../ui/sidebar";
import { NavMain } from "./nav-main";

const AppSidebar = ({ ...props }) => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();

  const data = [
    { title: "Dashboard", url: "/Dashboard", icon: Home },
    { title: "Expenses", url: "/Expenses", icon: Coins },
    { title: "Academics", url: "/Academics", icon: FileBadge },
    { title: "Students", url: "/students", icon: Users },
    { title: "Accounts", url: "/Accounts", icon: Wallet },
    { title: "Attendance", url: "/attendance", icon: ChartColumnIncreasing },
    { title: "Team", url: "/team", icon: Users },
    { title: "Leads", url: "/leads", icon: ListFilterPlus },
    { title: "Advertisement", url: "/Advertisement", icon: Clipboard },
    { title: "Support", url: "/support", icon: CircleHelp },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (

    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="  bg-white dark:bg-gray-900">

        {/* Sidebar Logo & Close Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4"

          >
            <img className="w-10 h-10 " src={zeniushub} alt="zeniushub Logo" />
            {!isOpen && <h5 className="text-xl font-semibold">Zeniushub</h5>}
          </div>
          <button
            onClick={() => toggleSidebar(false)}
            className="block sm:hidden p-2 z-50 h-10 w-10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        © 2025 Zeniushub
      </SidebarFooter>
      <SidebarRail />


    </Sidebar>
  );
};

export default AppSidebar;
