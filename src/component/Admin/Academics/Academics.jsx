import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAcademicsdata } from "../../../Redux_store/Api/AcademicsApi";
import { SidebarProvider, SidebarInset } from "../../src/components/ui/sidebar";
import AppSidebar from "../../src/components/ui/app-sidebar";
import Header from "../Dashboard/Header";
import {
  Book,
  BookOpen,
  CalendarCheck,
  Users,
  ChevronRight,
} from "lucide-react";
import logo from "../../../assets/Image/intellix.png";

const iconClasses = "w-8 h-8 text-white drop-shadow-md";
const circleBase =
  "flex items-center justify-center w-14 h-14 rounded-xl shadow-lg";

const Academics = () => {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.academics || {}
  );

  useEffect(() => {
    dispatch(getAllAcademicsdata(token));
  }, [dispatch]);

  const cardData = [
    {
      title: "Courses / Classes",
      value: data?.data?.activeCoursesCount || 0,
      icon: <Book className={iconClasses} />,
      iconBg: "bg-gradient-to-tr from-pink-600 to-pink-400",
      link: "/Courses",
      label: "Total Courses Active",
    },
    {
      title: "Sessions",
      value: data?.data?.sessionsCount || 0,
      icon: <CalendarCheck className={iconClasses} />,
      iconBg: "bg-gradient-to-tr from-green-600 to-green-400",
      link: "/Sessions",
      label: "Total Sessions",
    },
    {
      title: "Subjects",
      value: data?.data?.subjectsCount || 0,
      icon: <BookOpen className={iconClasses} />,
      iconBg: "bg-gradient-to-tr from-purple-600 to-purple-400",
      link: "/Subjects",
      label: "Total Subjects Active",
    },
    {
      title: "Batches / Sections",
      value: data?.data?.batchesCount || 0,
      icon: <Users className={iconClasses} />,
      iconBg: "bg-gradient-to-tr from-yellow-600 to-yellow-400",
      link: "/Batches",
      label: "Total Batches",
    },
  ];

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
          <div className="m-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ">
              Academics Overview
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              A summary of all active academic elements including courses,
              sessions, batches, and subjects.
            </p>
          </div>
          {loading ? (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
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
            <div className="col-span-full text-red-700 border border-red-300 p-4 rounded bg-red-50 text-center m-10">
              <strong>Error:</strong> {error?.message || "Something went wrong"}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 -mt-7 sm:grid-cols-1 gap-10 p-2 max-w-6xl mx-auto">
                {cardData.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(card.link)}
                    className="cursor-pointer flex justify-between items-center p-6 border border-gray-200 rounded-2xl shadow-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg "
                  >
                    <div className="flex items-center gap-5">
                      <div className={`${card.iconBg} ${circleBase}`}>
                        {card.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {card.title}
                        </h2>
                        <p className="text-md text-gray-600 dark:text-gray-300 mt-1">
                          {card.label}:{" "}
                          <span className="font-semibold">{card.value}</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Academics;
