import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  assignAccessDepartments,
  fetchAccessDepartments,
  get_available_Access,
  updateAccessDepartment,
} from "../../../Redux_store/Api/Department";

import { Button } from "../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Header from "../Dashboard/Header";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentAccess = () => {
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);

  const isDarkMode = true;
  const { id } = useParams();
  const dispatch = useDispatch();

  const { grantedAccess, availableAccess, loading } = useSelector(
    (state) => state.Department || {}
  );

  const handleUpdate = async (accessControlId) => {
    if (!accessControlId) return;

    try {
      const res = await dispatch(
        updateAccessDepartment({
          id,
          accessControlIds: [accessControlId],
          token,
        })
      );

      if (updateAccessDepartment.fulfilled.match(res)) {
        toast.success("Access removed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });

        dispatch(fetchAccessDepartments({ id, token }));
        dispatch(get_available_Access({ id, token }));
      } else {
        throw res.payload || new Error("Failed to remove access.");
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
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  const handleAddAccess = async (departmentId) => {
    try {
      const result = await dispatch(
        assignAccessDepartments({ id, array: [departmentId], token })
      );

      if (assignAccessDepartments.fulfilled.match(result)) {
        toast.success("Access granted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });

        dispatch(fetchAccessDepartments({ id, token }));
        dispatch(get_available_Access({ id, token }));
      } else {
        throw result.payload || new Error("Failed to grant access.");
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
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchAccessDepartments({ id, token }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(get_available_Access({ id, token }));
    }
  }, [dispatch, id]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex to-blue-50">
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
              theme={isDarkMode ? "dark" : "light"}
              transition={Zoom}
            />
            <div className="p-6">
              <Button
                onClick={goBack}
                className="hover:bg-blue-900 bg-blue-800 hover:text-white flex items-center gap-3 px-6 py-4 mb-8 rounded-lg shadow-md transition duration-300"
              >
                <ArrowLeft size={22} /> Go Back
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Granted Access */}
                <Card className="shadow-md rounded-xl overflow-hidden shadow-blue-400/50 h-[33em] mt-4">
                  <CardHeader className="bg-blue-500 text-white py-5 text-center">
                    <CardTitle className="text-xl font-bold tracking-wide">
                      Granted Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[30em] overflow-y-auto scrollbar-hide">
                    <ul>
                      {grantedAccess?.accessControls?.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center px-6 py-4 border-b last:border-none"
                        >
                          <span className="text-lg font-medium">
                            {item.name}
                          </span>
                          <Button
                            onClick={() => handleUpdate(item.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md mx-4"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Available Access */}
                <Card className="shadow-md rounded-xl overflow-hidden shadow-blue-400/50 mt-4 h-[33em]">
                  <CardHeader className="bg-green-500 text-white py-5 text-center">
                    <CardTitle className="text-xl font-bold tracking-wide">
                      Available Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[30em] overflow-y-auto scrollbar-hide">
                    <ul>
                      {availableAccess?.accessControls?.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center px-6 py-4 border-b last:border-none"
                        >
                          <span className="text-lg font-medium">
                            {item.name}
                          </span>
                          <Button
                            onClick={() => handleAddAccess(item.id)}
                            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 shadow-md"
                          >
                            Add
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DepartmentAccess;
