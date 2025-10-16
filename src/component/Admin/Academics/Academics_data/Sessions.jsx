import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppSidebar from "../../../src/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../src/components/ui/sidebar";
import Header from "../../Dashboard/Header";
import { Button } from "../../../src/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../src/components/ui/dialog";
import { Input } from "../../../src/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../src/components/ui/form";
import ThankYouCard from "../../Dashboard/ThankYouCard";
import { useDispatch, useSelector } from "react-redux";
import {
  addSession,
  getSessions,
  setDefaultSession,
} from "../../../../Redux_store/Api/SessionApi";
import logo from "../../../../assets/Image/zeniushub.png";
import { setSession } from "../../../../Redux_store/slices/SessionSlice";
import { useNavigate } from "react-router";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../component/src/components/ui/radio-group";
import { Label } from "../../../..//component/src/components/ui/label";
import No_data_found from "../../No_data_found";
import { toast, ToastContainer, Zoom } from "react-toastify";

const sessionSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Year must be exactly 4 digits"),
});

const Sessions = () => {
  const dispatch = useDispatch();
  const [addSessions, setAddSessions] = useState(false);
  // const [AddConfrom, setAddConfrom] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultSession, setDefaultSessionId] = useState(null);

  const { Session, loading, error } = useSelector((state) => state.session);

  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: { year: "" },
  });

  useEffect(() => {
    dispatch(
      getSessions({ page: currentPage, session_year: searchQuery, limit: 18 })
    );
  }, [dispatch, currentPage, searchQuery]);

  useEffect(() => {
    if (Session) {
      const defaultSessionItem = Session.find((s) => s.is_default);
      if (defaultSessionItem) {
        setDefaultSessionId(defaultSessionItem.id);
      }
    }
  }, [Session]);

  const handleSessionSubmit = async (data) => {
    try {
      const result = await dispatch(
        addSession({ session_year: data.year })
      ).unwrap();

      if (result) {
        setAddSessions(false);
        form.reset();
        await dispatch(getSessions({ page: 1, session_year: "", limit: 18 }));

        toast.success("Session added successfully!", {
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
      }
    } catch (error) {
      const errorMessage =
        error?.error?.length > 0
          ? error?.error?.[0]?.message
          : error?.message || "Failed to add session.";
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
      console.error("Error adding session:", error);
    }
  };

  const handleSetDefaultSession = (id) => {
    dispatch(setDefaultSession({ id }));
    setDefaultSessionId(id);

    dispatch(setSession(id));
  };

  const navigate = useNavigate();
  const back = () => navigate("/Academics");

  // const handleConfirm = async () => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     // setAddConfrom(false);
  //   } catch (error) {
  //     console.error("Submission failed:", error);
  //   }
  // };

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
            closeOnClick={false}
            pauseOnHover
            draggable
            theme="isDarkMode ? dark: light"
            transition={Zoom}
          />
          {/* Top Bar */}
          <div className="w-full shadow-md shadow-blue-300/30 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 py-4 gap-3">
            <div className="flex items-center gap-3">
              <Button
                className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                onClick={back}
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to Academics</span>
              </Button>
              <Button
                onClick={() => setAddSessions(true)}
                className="bg-orange-600 text-white hover:bg-orange-500 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>Add Sessions</span>
              </Button>

              {/* Add Session Dialog */}
              <Dialog open={addSessions} onOpenChange={setAddSessions}>
                <DialogContent
                  className=" sm:max-w-[500px] shadow-lg p-6 rounded-lg"
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Add Session
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSessionSubmit)}
                      className="space-y-10"
                    >
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Year</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Enter Year"
                                {...field}
                                onChange={(e) => {
                                  const onlyDigits = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 4);
                                  field.onChange(onlyDigits);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white"
                      >
                        {loading ? "Adding..." : "Add Session"}
                      </Button>
                    </form>
                  </Form>
                  <DialogFooter>
                    {error?.message && (
                      <div className="text-red-700 mx-auto text-center">
                        {error.error[0].message}
                      </div>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <div className="flex items-center border border-blue-300 rounded-lg px-3 py-2 w-full sm:max-w-md">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="By Session Name..."
                className="ml-2 w-full outline-none bg-transparent text-sm"
                value={searchQuery}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  const trimmed = onlyDigits.slice(0, 4);
                  setSearchQuery(trimmed);
                }}
              />
            </div>
          </div>

          {/* Loader */}
          {loading && (
            <div className="h-[50vh] flex items-center justify-center">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
                <img
                  src={logo}
                  alt="Loading"
                  className="rounded-full h-28 w-28"
                />
              </div>
            </div>
          )}

          {/* Sessions Cards */}

          {!loading && (
            <RadioGroup
              className="gap-4 max-w-[1200px] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              value={defaultSession}
              onValueChange={(value) =>
                handleSetDefaultSession(parseInt(value))
              }
            >
              {Session?.length === 0 ? (
                <No_data_found />
              ) : (
                Session?.map((session) => (
                  <div
                    key={session.id}
                    className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                  >
                    <RadioGroupItem
                      value={session.id}
                      id={`session-${session.id}`}
                      aria-describedby={`session-${session.id}-description`}
                      className="order-1 after:absolute after:inset-0"
                    />
                    <div className="grid grow gap-2">
                      <Label htmlFor={`session-${session.id}`}>
                        {session.session_year}
                        <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                          {" "}
                          ({session.totalBatches} Batches)
                        </span>
                      </Label>
                      <p
                        id={`session-${session.id}-description`}
                        className="text-xs text-muted-foreground"
                      >
                        Set this session as the default for batch operations.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </RadioGroup>
          )}

          {/* Confirmation Dialog */}
          {/* <Dialog open={AddConfrom} onOpenChange={setAddConfrom}>
            <DialogContent
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="w-full max-w-[90vw] sm:max-w-[400px] p-6 rounded-lg"
            >
              <ThankYouCard />
              <DialogFooter className="flex justify-end gap-3">
                <Button
                  onClick={() => setAddConfrom(false)}
                  variant="outline"
                  className="w-full sm:w-auto text-black mt-4 bg-gray-100 hover:text-black hover:bg-gray-300 px-5 py-2 rounded-md flex items-center transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="w-full sm:w-auto mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md flex items-center shadow-md transition-all"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sessions;
