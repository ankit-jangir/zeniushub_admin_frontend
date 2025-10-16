import React, { useEffect, useState } from "react";
import AppSidebar from "../../src/components/ui/app-sidebar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../src/components/ui/tabs";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent, CardHeader } from "../../src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import { Input } from "../../src/components/ui/input";
import Add_school_img from "./Add_school_img";
import Add_popular_course from "./Add_popular_course";
import Notification from "./Notification";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_banner_api,
  delete_banner,
  add_banner,
} from "../../../Redux_store/Api/Baner";
import logo from "../../../assets/Image/zeniushub.png";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import No_data_found from "../No_data_found";
const base_img_url = "https://adminv2-api-dev.intellix360.in/";
const isDarkMode = true;

const Advertisment = () => {
  let token = localStorage.getItem("token");

  token = useSelector((state) => state.logout.token);

  const [tempImages, setTempImages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null,
    bannerId: null,
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("tab1");
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector(
    (state) => state.banner || {}
  );

  // Handle Image Upload (Temporary)
  const handleTempImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newTempImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setTempImages(newTempImages);
    setErrors({});
  };
  const handleSubmit = async () => {
    if (tempImages.length === 0) {
      setErrors({ images: "At least one image is required." });
      return;
    }

    try {
      setErrors({});

      // Use Promise.all with unwrap to catch real API errors
      await Promise.all(
        tempImages.map((image) =>
          dispatch(add_banner({ file: image.file, token })).unwrap()
        )
      );

      toast.success("Banners uploaded successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setDialogOpen(false);
      setTempImages([]);
      dispatch(get_banner_api(token));
    } catch (error) {
      const errorMessage =
        error?.error?.[0]?.message ||
        error?.message ||
        "Unexpected error occurred. Try again!";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: isDarkMode ? "dark" : "light",
        transition: Zoom,
      });

      setErrors({ images: errorMessage });
    }
  };

  const bannerdelete = async (id) => {
    dispatch(delete_banner({ id, token }))
      .unwrap()
      .then(() => {
        toast.success("Banner deleted Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        setDeleteDialog({ open: false, index: null });

        dispatch(get_banner_api(token));
      })
      .catch((error) => {
        const errorMessage =
          error?.error?.length > 0
            ? error?.error?.[0]?.message
            : error?.message || "Somethig went wrong please try again ";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
          transition: Zoom,
        });
        console.error("deletetion failed:", error);
      });
  };

  useEffect(() => {
    dispatch(get_banner_api(token));
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="w-full">
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="m-5"
            >
              <div className=" px-4 mb-12 lg:px-8">
                <div className="w-full">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                    <TabsTrigger
                      value="tab1"
                      className={`w-full rounded-md px-3 py-2 text-[12px] font-medium ${activeTab === "tab1"
                        ? "bg-blue-800 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-800 hover:text-white"
                        }`}
                    >
                      Banner
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab2"
                      className={`w-full rounded-md px-3 py-2 text-[12px] font-medium ${activeTab === "tab2"
                        ? "bg-blue-800 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-800 hover:text-white"
                        }`}
                    >
                      School Image
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab3"
                      className={`w-full rounded-md px-3 py-2 text-[12px] font-medium ${activeTab === "tab3"
                        ? "bg-blue-800 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-800 hover:text-white"
                        }`}
                    >
                      Popular Course
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab4"
                      className={`w-full rounded-md px-3 py-2 text-[12px] font-medium ${activeTab === "tab4"
                        ? "bg-blue-800 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-800 hover:text-white"
                        }`}
                    >
                      Notification
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Tab for Adding Banner Images */}
              <TabsContent value="tab1" className="p-4 text-left">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Banners
                  </h1>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-md bg-blue-900 hover:bg-blue-800 text-white "
                        onClick={() => setDialogOpen(true)}
                      >
                        Add Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      onPointerDownOutside={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Choose Banner
                        </DialogTitle>
                      </DialogHeader>
                      <Input
                        id="upload"
                        type="file"
                        multiple
                        onChange={handleTempImageChange}
                      />

                      {tempImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          {tempImages.map((img, index) => (
                            <div key={img.id} className="relative">
                              <img
                                src={img.url}
                                className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                              />
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                {img.file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <DialogFooter className="flex justify-end gap-3 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {loading && (
                  <div className="h-screen  flex items-center justify-center  text-white">
                    <div className="relative flex  justify-center items-center">
                      <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                      <img
                        src={logo}
                        alt="Loading"
                        className="rounded-full h-28 w-28"
                      />
                    </div>
                  </div>
                )}

                {!loading && (
                  <div>
                    {banners?.banners?.length > 0 ? (
                      <div className="grid gap-5 mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                        {banners.banners.map((img) => (
                          <Card
                            key={img.id}
                            className="w-full max-w-xs mx-auto shadow-md shadow-blue-500/40 rounded-xl mt-5 overflow-hidden"
                          >
                            <CardHeader className="p-0">
                              <img
                                src={
                                  img.image_path
                                    ? `${base_img_url}viewimagefromazure?filePath=${img.image_path}`
                                    : "https://via.placeholder.com/300x150?text=Banner+Image"
                                }
                                alt="Banner"
                                className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800"
                              />
                            </CardHeader>
                            <CardContent className="p-4">
                              <Button
                                className="w-full bg-red-600 hover:bg-red-700 transition-colors"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    bannerId: img.id,
                                  })
                                }
                              >
                                <Trash2 size={18} className="mr-2" /> Delete
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <No_data_found />
                    )}
                  </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                  open={deleteDialog.open}
                  onOpenChange={(open) =>
                    setDeleteDialog({ open, index: null })
                  }
                >
                  <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                  >
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Are you sure you want to delete this banner?</p>
                      <p className="text-sm text-gray-500 mt-2">
                        This action cannot be undone.
                      </p>
                    </div>
                    <DialogFooter className="flex justify-between">
                      <Button
                        onClick={() =>
                          setDeleteDialog({ open: false, index: null })
                        }
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => bannerdelete(deleteDialog.bannerId)}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Other Tabs */}
              <TabsContent value="tab2" className="p-4 text-left">
                <Add_school_img />
              </TabsContent>
              <TabsContent value="tab3" className="p-4 text-left">
                <Add_popular_course />
              </TabsContent>
              <TabsContent value="tab4" className="p-4 text-left">
                <Notification />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Advertisment;
