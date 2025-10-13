import React, { useState, useEffect, useContext, useMemo } from "react";
import { Button } from "../../src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "../../src/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/ui/form";
import ThemeContext from "../Dashboard/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/ui/pagination";
import {
  createSalaryEntry,
  fetchUpcomingSalary,
  grant_salary,
  salaryhistory,
} from "../../../Redux_store/Api/team_account_api";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ------------ Helpers ------------- */
const DAILY_RATE = 1000;
const calcAmount = (from, to) => {
  if (!from || !to) return "";
  const diff = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;
  return diff > 0 ? (diff * DAILY_RATE).toString() : "";
};

/* ------------ Validation ------------- */
const formSchema = z.object({
  fromDate: z.string({ required_error: "Select a start date" }),
  toDate: z.string({ required_error: "Select an end date" }),
  amount: z.string().min(1, { message: "Amount is required" }),
});

const ManageSalary = () => {
  /* ------------ Hooks ------------- */
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { empId } = useParams();

  /* ------------ Local state ------------- */
  const [tab, setTab] = useState("tab1");
  const [openGrantSalary, setOpenGrantSalary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------ Redux state ------------- */
  const { grandsallary, history, data } = useSelector((state) => state.salary);
  console.log(grandsallary?.data?.absent, "!!!!!!!!!!!!!!!!!!!!!");

  /* ------------ Form ------------- */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      amount: "",
      absentDays: 0, // naya field
      halfdayDays: 0, // naya field
      presentDays: 0, // naya field
      // presentDays: 0,    // (optional)
      // halfdayDays: 0,    // (optional)
    },
  });
  const watchFrom = form.watch("fromDate");
  const watchTo = form.watch("toDate");

  /* --------------------------------------------------
   * 1️⃣  Calculate amount on the fly
   * -------------------------------------------------- */
  useEffect(() => {
    if (watchFrom && watchTo) {
      form.setValue("amount", calcAmount(watchFrom, watchTo));
    }
  }, [watchFrom, watchTo, form]);

  useEffect(() => {
    if (grandsallary?.data?.absent !== undefined) {
      form.setValue("absentDays", grandsallary.data.absent); // read-only field ko populate
    }
  }, [grandsallary?.data?.absent, form]);
  useEffect(() => {
    if (grandsallary?.data?.present !== undefined) {
      form.setValue("presentDays", grandsallary.data.present); // read-only field ko populate
    }
  }, [grandsallary?.data?.absent, form]);
  useEffect(() => {
    if (grandsallary?.data?.halfday !== undefined) {
      form.setValue("halfdayDays", grandsallary.data.halfday); // read-only field ko populate
    }
  }, [grandsallary?.data?.absent, form]);
  /* --------------------------------------------------
   * 2️⃣  Bring attendance breakdown for selected range
   *     Only fire the API when both dates are present
   * -------------------------------------------------- */
  useEffect(() => {
    if (!watchFrom || !watchTo) return;
    dispatch(
      grant_salary({
        empId,
        fromDate: watchFrom,
        toDate: watchTo,
        token,
      })
    );
  }, [dispatch, empId, token, watchFrom, watchTo]);

  /* --------------------------------------------------
   * 3️⃣  Initial data loads – history + upcoming
   * -------------------------------------------------- */
  useEffect(() => {
    dispatch(fetchUpcomingSalary({ empid: empId, token }));
    dispatch(salaryhistory({ empid: empId, token }));
  }, [dispatch, empId, token]);

  /* --------------------------------------------------
   * 4️⃣  Pre‑fill the dialog when back‑end suggests range
   * -------------------------------------------------- */
  useEffect(() => {
    if (openGrantSalary && grandsallary?.data?.amount) {
      form.setValue("amount", grandsallary.data.amount.toString());
    }
  }, [openGrantSalary, grandsallary?.data?.amount]);

  /* --------------------------------------------------
   * 5️⃣  Submit handler – close + reset only on success
   * -------------------------------------------------- */
  const onGrantSalarySubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // 1️⃣ thunk का payload पकड़ें
      const res = await dispatch(
        createSalaryEntry({
          emp_id: empId,
          amount: values.amount,
          from_date: values.fromDate,
          to_date: values.toDate,
          token,
        })
      ).unwrap();

      const apiMsg = res?.data?.message || "Salary entry created successfully";

      if (/salary.*already.*generated/i.test(apiMsg)) {
        toast.warn(apiMsg, {
          position: "top-right",
          autoClose: 3000,
          theme: darkMode ? "dark" : "light",
          transition: Zoom,
        });

        return;
      }

      // 4️⃣ वरना success flow
      toast.success(apiMsg, {
        position: "top-right",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
        transition: Zoom,
      });

      await dispatch(salaryhistory({ empid: empId, token }));

      setOpenGrantSalary(false);
      form.reset();
    } catch (err) {
      const msg =
        err?.error?.[0]?.message ?? err?.message ?? "Salary submission failed";

      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
        transition: Zoom,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  /* ------------ Styles ------------- */
  const containerCls = useMemo(
    () =>
      `flex flex-col md:flex-row min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`,
    [darkMode]
  );

  const sidebarCls = useMemo(
    () =>
      `w-full md:w-56 lg:w-64 p-4 md:p-6 flex flex-col gap-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } md:shadow-md`,
    [darkMode]
  );

  const mainCls = useMemo(
    () =>
      `flex-1 p-4 md:p-6 lg:p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`,
    [darkMode]
  );
  const today = new Date().toISOString().split("T")[0];
  /* ------------ JSX ------------- */
  return (
    <div className={containerCls}>
      {/* ------------ Sidebar ------------- */}
      <aside className={sidebarCls}>
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border border-gray-300 w-full text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> Back
        </Button>
        <Button
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5 ${
            tab === "tab1" ? "font-bold" : ""
          }`}
          onClick={() => setTab("tab1")}
        >
          Upcoming Salary
        </Button>
        <Button
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5 ${
            tab === "tab2" ? "font-bold" : ""
          }`}
          onClick={() => setTab("tab2")}
        >
          Salary History
        </Button>
      </aside>

      {/* ------------ Main ------------- */}
      <main className={mainCls}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          transition={Zoom}
        />

        {/* ---------- Upcoming Tab ---------- */}
        {tab === "tab1" && (
          <>
            <div className="flex justify-end mb-4">
              <Dialog open={openGrantSalary} onOpenChange={setOpenGrantSalary}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenGrantSalary(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5"
                  >
                    Grant Salary
                  </Button>
                </DialogTrigger>

                {/* ---- Dialog ---- */}
                <DialogContent
                  className="w-[90vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
                  onPointerDownOutside={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle className="text-center text-base sm:text-lg md:text-xl">
                      Grant Salary
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onGrantSalarySubmit)}
                      className="space-y-4"
                    >
                      {/* From Date */}
                      <FormField
                        control={form.control}
                        name="fromDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm md:text-base">
                              From Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                max={today}
                                onClick={(e) => e.target.showPicker?.()}
                                className="text-xs sm:text-sm md:text-base"
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="toDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm md:text-base">
                              To Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                max={today}
                                onClick={(e) => e.target.showPicker?.()}
                                className="text-xs sm:text-sm md:text-base"
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                      {/* --- Present Days --- */}
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="presentDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm md:text-base">
                                Present
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field} // react-hook-form binding
                                  readOnly // ✨ user edit nahi karega
                                  className="text-xs sm:text-sm md:text-base  cursor-not-allowed"
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* --- Half-day Days --- */}
                        <FormField
                          control={form.control}
                          name="halfdayDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm md:text-base">
                                Half-day
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field} // react-hook-form binding
                                  readOnly // ✨ user edit nahi karega
                                  className="text-xs sm:text-sm md:text-base  cursor-not-allowed"
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* --- Absent Days --- */}
                        <FormField
                          control={form.control}
                          name="absentDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm md:text-base">
                                Absent Days
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field} // react-hook-form binding
                                  readOnly // ✨ user edit nahi karega
                                  className="text-xs sm:text-sm md:text-base  cursor-not-allowed"
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:text-sm md:text-base">
                              Amount
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="text-xs sm:text-sm md:text-base"
                              />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      {/* Save Button */}
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700 w-full text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5"
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Upcoming list */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm md:text-base lg:text-lg">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 sm:p-3 md:p-4 text-left">Sr.No</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">Name</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">From</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">To</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">
                      Expected Amount
                    </th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {!data?.data?.length ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-4 text-gray-500 text-xs sm:text-sm md:text-base"
                      >
                        No upcoming salary records.
                      </td>
                    </tr>
                  ) : (
                    data.data.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 sm:p-3 md:p-4">{index + 1}</td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {item.employeeName}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4">{item.from}</td>
                        <td className="p-2 sm:p-3 md:p-4">{item.to}</td>
                        <td className="p-2 sm:p-3 md:p-4 text-orange-400">
                          ₹{item.totalSalary}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 flex gap-1 sm:gap-2">
                          <span className="text-green-500 font-semibold">
                            {item.present}
                          </span>
                          <span className="text-yellow-400 font-semibold">
                            {item.half_day}
                          </span>
                          <span className="text-red-500 font-semibold">
                            {item.absent}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ---------- History Tab ---------- */}
        {tab === "tab2" && (
          <>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              Salary History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm md:text-base lg:text-lg">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 sm:p-3 md:p-4 text-left">Sr.No</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">Name</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">From</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">To</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">Amount</th>
                    <th className="p-2 sm:p-3 md:p-4 text-left">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {!history?.data?.length ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-4 text-gray-500 text-xs sm:text-sm md:text-base"
                      >
                        No salary history records.
                      </td>
                    </tr>
                  ) : (
                    history.data.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 sm:p-3 md:p-4">{index + 1}</td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {item.employeName ?? "--"}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {item.from_date ?? "--"}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {item.to_date ?? "--"}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 text-green-400">
                          ₹{item.amount ?? "--"}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 flex gap-1 sm:gap-2">
                          <span className="text-green-500 font-semibold">
                            {item.present ?? "--"}
                          </span>
                          <span className="text-yellow-400 font-semibold">
                            {item.halfday ?? "--"}
                          </span>
                          <span className="text-red-500 font-semibold">
                            {item.absent ?? "--"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ----- Pagination placeholder (implementation unchanged) ----- */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent className="gap-1 sm:gap-2 md:gap-3 p-2 rounded-2xl">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-lg"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className="text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-lg"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default ManageSalary;
