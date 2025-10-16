import React, { useEffect, useState } from "react";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent } from "../../src/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "../../src/components/ui/pagination";
import {
  Plus,
  Download,
  CalendarIcon,
  Wallet,
  User,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import AppSidebar from "../../src/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../src/components/ui/sidebar";
import Header from "../Dashboard/Header";
import { Label } from "../../src/components/ui/label";
import { Input } from "../../src/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  get_AllExpenses,
  create_Expense,
  update_Expense,
  delete_Expense,
  export_ExpensesExcel,
} from "../../../Redux_store/Api/Expenses.api";
import "../Team/Team.css";
import {
  getAllCategoryExpenses,
  createCategoryExpense,
  updateCategoryExpense,
  deleteCategoryExpense,
} from "../../../Redux_store/Api/categoryExpenses";

const paymentModeMapping = {
  UPI: "upi",
  Online: "online",
  Cash: "cash",
  "Credit Card": "card",
  All: "",
};

const reversePaymentModeMapping = {
  upi: "UPI",
  online: "Online",
  cash: "Cash",
  card: "Credit Card",
};

const expenseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(140)
    .regex(/^[A-Za-z\s]+$/, "Title can only contain alphabets and spaces"),
  categoryId: z.number().min(1, "Category is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  paymentMode: z.enum(["UPI", "Online", "Cash", "Credit Card"], {
    required_error: "Payment mode is required",
  }),
  // description: z
  //   .string()
  //   .min(10, "Description must be at least 10 characters")
  //   .max(500),
  description: z.string().max(500).optional(),
  referenceBy: z
    .string()
    .min(3, "Reference must be at least 3 characters")
    .max(80),
});

const filterSchema = z
  .object({
    paymentMode: z.enum(["UPI", "Online", "Cash", "Credit Card", "All"], {
      required_error: "Payment mode is required",
    }),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    name: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.fromDate || !data.toDate) return true;
      return new Date(data.toDate) >= new Date(data.fromDate);
    },
    {
      message: "To Date must be later than or equal to From Date",
      path: ["toDate"],
    }
  );

const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100)
    .regex(/^[A-Za-z\s]+$/, "Title can only contain alphabets and spaces"),
});

const Expenses = () => {
  const dispatch = useDispatch();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const {
    expenses = { data: [], total: 0, pages: 1, currentPage: 1 },
    loading,
    error,
  } = useSelector((state) => state.expenses || {});
  const { categoryExpenses = [], successMessage } = useSelector(
    (state) => state.categoryExpenses || {}
  );

  const [showCategory, setShowCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const itemsPerPage = 4;

  let token = localStorage.getItem("token");
  token = useSelector((state) => state.logout.token);

  useEffect(() => {
    dispatch(getAllCategoryExpenses());
  }, [dispatch, token]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);

  const {
    register: registerCat,
    handleSubmit: handleSubmitCat,
    reset: resetCat,
    formState: { errors: errorsCat },
    setValue: setValueCat,
  } = useForm({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const onSubmitCat = (data, isEdit = false) => {
    if (isEdit && editingCategory) {
      dispatch(
        updateCategoryExpense({
          id: editingCategory.id,
          updatedData: { categoryName: data.name },
        })
      )
        .unwrap()
        .then(() => {
          resetCat();
          setEditingCategory(null);
          setIsEditCategoryDialogOpen(false);
          dispatch(getAllCategoryExpenses());
        })
        .catch((err) => {
          console.error("Failed to update category:", err);
          setErrorMessage(err.message || "Failed to update category");
        });
    } else {
      dispatch(createCategoryExpense({ categoryName: data.name }))
        .unwrap()
        .then(() => {
          resetCat();
          dispatch(getAllCategoryExpenses());
          setIsAddCategoryDialogOpen(false);
        })
        .catch((err) => {
          console.error("Failed to create category:", err);
          setErrorMessage(err.message || "Failed to create category");
        });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCategoryExpense({ id, token }))
      .unwrap()
      .then(() => {
        dispatch(getAllCategoryExpenses());
      })
      .catch((err) => {
        console.error("Failed to delete category:", err);
      });
  };

  const [filters, setFilters] = useState({
    paymentMode: "All",
    fromDate: "",
    toDate: "",
    name: "",
  });

  const [isRefetching, setIsRefetching] = useState(false);


  useEffect(() => {
    if (isRefetching) return;
    dispatch(
      get_AllExpenses({
        token,
        name: filters.name,
        paymentMethod: paymentModeMapping[filters.paymentMode],
        startDate: filters.fromDate,
        endDate: filters.toDate,
        page: currentPage,
        limit: itemsPerPage,
      })
    )
      .unwrap()
      .catch((err) => {
        setErrorMessage(err.message || "Failed to fetch expenses");
      });
  }, [dispatch, filters, currentPage, isRefetching, token]);


  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || "An error occurred");
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  useEffect(() => {
    setErrorMessage(null);
  }, [expenses]);


  useEffect(() => {
    if (!isRefetching && !errorMessage && !isAddExpenseOpen) {
      console.log("useEffect: Ensuring dialog is closed when isRefetching is false");
      setIsAddExpenseOpen(false);
    }
  }, [isRefetching, errorMessage, isAddExpenseOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      categoryId: undefined,
      date: "",
      amount: undefined,
      paymentMode: undefined,
      description: "",
      referenceBy: "",
    },
  });

  useEffect(() => {
    if (editingExpense) {
      setValue("title", editingExpense.name);
      setValue("categoryId", editingExpense.categoryId);
      setValue("date", editingExpense.date);
      setValue("amount", parseFloat(editingExpense.amount));
      setValue(
        "paymentMode",
        reversePaymentModeMapping[editingExpense.paymentMethod] ||
        editingExpense.paymentMethod
      );
      setValue("description", editingExpense.description);
      setValue("referenceBy", editingExpense.referralName);
      clearErrors();
    } else if (isAddExpenseOpen) {
      reset({
        title: "",
        categoryId: undefined,
        date: "",
        amount: undefined,
        paymentMode: undefined,
        description: "",
        referenceBy: "",
      });
      clearErrors();
      console.log("Form reset when dialog opened for adding expense");
    }
  }, [editingExpense, isAddExpenseOpen, setValue, reset, clearErrors]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.title,
      categoryId: data.categoryId,
      date: data.date,
      amount: data.amount.toString(),
      paymentMethod: paymentModeMapping[data.paymentMode],
      description: data.description || "",
      referralName: data.referenceBy,
    };

    try {
      setIsRefetching(true);
      console.log("Submitting expense:", payload);
      if (editingExpense) {
        await dispatch(
          update_Expense({
            id: editingExpense.id,
            token,
            data: payload,
          })
        ).unwrap();
        console.log("Expense updated successfully");
      } else {
        await dispatch(
          create_Expense({
            token,
            data: payload,
          })
        ).unwrap();
        console.log("Expense created successfully");
      }

      await dispatch(
        get_AllExpenses({
          token,
          name: filters.name,
          paymentMethod: paymentModeMapping[filters.paymentMode],
          startDate: filters.fromDate,
          endDate: filters.toDate,
          page: 1,
          limit: itemsPerPage,
        })
      ).unwrap();
      console.log("Expenses fetched successfully");

      reset({
        title: "",
        categoryId: undefined,
        date: "",
        amount: undefined,
        paymentMode: undefined,
        description: "",
        referenceBy: "",
      });
      clearErrors();
      setEditingExpense(null);
      setTimeout(() => {
        setIsAddExpenseOpen(false);
        setIsAddExpenseOpen(false);
        console.log("Dialog closed, isAddExpenseOpen:", false);
      }, 100);
      setErrorMessage(null);
      setCurrentPage(1);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save expense");
      setIsAddExpenseOpen(false);
    } finally {
      setIsRefetching(false);
    }
  };

  const refetchExpenses = async () => {
    setIsRefetching(true);
    setErrorMessage(null);
    try {
      const result = await dispatch(
        get_AllExpenses({
          token,
          name: filters.name,
          paymentMethod: paymentModeMapping[filters.paymentMode],
          startDate: filters.fromDate,
          endDate: filters.toDate,
          page: currentPage,
          limit: itemsPerPage,
        })
      ).unwrap();
      const newTotalPages = result?.pages || 1;
      if (result?.data?.length === 0 && currentPage > 1) {
        setCurrentPage(Math.max(1, newTotalPages));
        if (currentPage > newTotalPages) {
          await dispatch(
            get_AllExpenses({
              token,
              name: filters.name,
              paymentMethod: paymentModeMapping[filters.paymentMode],
              startDate: filters.fromDate,
              endDate: filters.toDate,
              page: 1,
              limit: itemsPerPage,
            })
          ).unwrap();
          console.log("Expenses fetched successfully");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to refetch expenses");
      console.error("Error refetching expenses:", err);
    } finally {
      setIsRefetching(false);
    }
  };

  // 🔹 Filter Form
  const {
    control: controlFilter,
    handleSubmit: handleSubmitFilter,
    formState: { errors: errorsFilter },
    register: registerFilter,
    reset: resetFilter,
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      paymentMode: "All",
      fromDate: "",
      toDate: "",
      name: "",
    },
    mode: "onChange",
  });

  const handleFilter = (data) => {
    setFilters(data);
    setCurrentPage(1);
    setErrorMessage(null);
  };

  // 🔹 Excel Export Form
  const {
    control: controlExcel,
    handleSubmit: handleSubmitExcel,
    formState: { errors: errorsExcel },
    register: registerExcel,
    reset: resetExcel,
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      paymentMode: "All",
      fromDate: "",
      toDate: "",
      name: "",
    },
  });

  const onSubmitExcel = (data) => {
    dispatch(
      export_ExpensesExcel({
        name: data.name,
        paymentMethod: paymentModeMapping[data.paymentMode],
        startDate: data.fromDate,
        endDate: data.toDate,
      })
    )
      .unwrap()
      .then(() => {
        resetExcel();
        setErrorMessage(null);
        setIsExportOpen(false);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to export expenses");
      });
  };

  const handleDeleteExpense = (id) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await dispatch(
          delete_Expense({
            id: expenseToDelete,
            token,
          })
        ).unwrap();

        setDeleteDialogOpen(false);
        setExpenseToDelete(null);
        setErrorMessage(null);
        await refetchExpenses();
      } catch (err) {
        setErrorMessage(err.message || "Failed to delete expense");
        setDeleteDialogOpen(false);
        setExpenseToDelete(null);
      }
    }
  };

  // 🔹 Pagination Logic
  const currentExpenses = Array.isArray(expenses?.data) ? expenses.data : [];
  const totalPages = expenses?.pages || 1;
  const totalItems = expenses?.total || 0;

  // 🔹 Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" }}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-8">
            {/* {errorMessage && (
              <div className="bg-red-100 text-red-700 p-4 rounded">
                {errorMessage}
              </div>
            )} */}
            {!showCategory ? (
              <>
                <div className="flex justify-between items-center">
                  <div></div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCategory(true)}
                  >
                    Show Category
                  </Button>
                </div>

                <form
                  onSubmit={handleSubmitFilter(handleFilter)}
                  className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 dark:bg-black p-4 rounded-xl border"
                >
                  <div className="flex flex-col gap-1 w-full md:w-50">
                    <Label>Payment Mode</Label>
                    <Controller
                      control={controlFilter}
                      name="paymentMode"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Credit Card">
                              Credit Card
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errorsFilter.paymentMode && (
                      <p className="text-red-500 text-xs">
                        {errorsFilter.paymentMode.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full md:w-50">
                    <Label>From Date</Label>
                    <Input
                      className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                      type="date"
                      {...registerFilter("fromDate")}
                    />
                    {errorsFilter.fromDate && (
                      <p className="text-red-500 text-xs">
                        {errorsFilter.fromDate.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full md:w-50">
                    <Label>To Date</Label>
                    <Input
                      className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                      type="date"
                      {...registerFilter("toDate")}
                    />
                    {errorsFilter.toDate && (
                      <p className="text-red-500 text-xs">
                        {errorsFilter.toDate.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full md:w-50">
                    <Label>Name</Label>
                    <Input
                      placeholder="Enter name"
                      {...registerFilter("name")}
                    />
                    {errorsFilter.name && (
                      <p className="text-red-500 text-xs">
                        {errorsFilter.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white">
                      <Filter className="w-4 h-4" /> Apply
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetFilter();
                        setFilters({
                          paymentMode: "All",
                          fromDate: "",
                          toDate: "",
                          name: "",
                        });
                        setCurrentPage(1);
                        setErrorMessage(null);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div></div>
                  <div className="flex gap-3">
                    <Dialog
                      open={isAddExpenseOpen}
                      onOpenChange={(open) => {
                        setIsAddExpenseOpen(open);
                        if (!open) {
                          setEditingExpense(null);
                          reset();
                          clearErrors();
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white"
                          onClick={() => {
                            setEditingExpense(null);
                            setIsAddExpenseOpen(true);
                            reset({
                              title: "",
                              categoryId: undefined,
                              date: "",
                              amount: undefined,
                              paymentMode: undefined,
                              description: "",
                              referenceBy: "",
                            });
                            clearErrors();
                            console.log("Form reset on Add Expense button click");
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          {editingExpense ? "Edit Expense" : "Add Expense"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[650px] sm:max-h-[80vh] overflow-y-scroll scrollbar-hide"
                      >
                        <DialogHeader>
                          <DialogTitle>
                            {editingExpense ? "Edit Expense" : "Add Expense"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingExpense
                              ? "Update the expense details."
                              : "Fill in the details of the expense and save it."}
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="grid gap-4"
                        >
                          <div className="grid gap-1">
                            <Label htmlFor="title">Expense Title</Label>
                            <Input id="title" {...register("title")} />
                            {errors.title && (
                              <p className="text-xs text-red-500">
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="categoryId">Category</Label>
                            <Controller
                              control={control}
                              name="categoryId"
                              defaultValue={null}
                              render={({ field }) => (
                                <Select
                                  value={
                                    field.value !== null
                                      ? String(field.value)
                                      : undefined
                                  }
                                  onValueChange={(value) =>
                                    field.onChange(value ? Number(value) : null)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoryExpenses.length > 0 ? (
                                      categoryExpenses.map((cat) => (
                                        <SelectItem
                                          key={cat.id}
                                          value={String(cat.id)}
                                        >
                                          {cat.categoryName}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value={undefined} disabled>
                                        No categories available
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.categoryId && (
                              <p className="text-xs text-red-500">
                                {errors.categoryId.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                              type="date"
                              id="date"
                              {...register("date")}
                            />
                            {errors.date && (
                              <p className="text-xs text-red-500">
                                {errors.date.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              type="number"
                              step="0.01"
                              id="amount"
                              {...register("amount", { valueAsNumber: true })}
                            />
                            {errors.amount && (
                              <p className="text-xs text-red-500">
                                {errors.amount.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Controller
                              control={control}
                              name="paymentMode"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Online">
                                      Online
                                    </SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Credit Card">
                                      Credit Card
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.paymentMode && (
                              <p className="text-xs text-red-500">
                                {errors.paymentMode.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              {...register("description")}
                            />
                            {errors.description && (
                              <p className="text-xs text-red-500">
                                {errors.description.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="referenceBy">Reference By</Label>
                            <Input
                              id="referenceBy"
                              {...register("referenceBy")}
                            />
                            {errors.referenceBy && (
                              <p className="text-xs text-red-500">
                                {errors.referenceBy.message}
                              </p>
                            )}
                          </div>

                          <DialogFooter className="pt-4 flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  reset();
                                  clearErrors();
                                  setEditingExpense(null);
                                  setIsAddExpenseOpen(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isRefetching}>
                              {isRefetching
                                ? "Processing..."
                                : editingExpense
                                  ? "Update Expense"
                                  : "Save Expense"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Delete</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this expense? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setIsExportOpen(true)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[425px]"
                      >
                        <DialogHeader>
                          <DialogTitle>Export Excel</DialogTitle>
                          <DialogDescription>
                            Select the payment mode, date range, and name to
                            export.
                          </DialogDescription>
                        </DialogHeader>

                        <form
                          onSubmit={handleSubmitExcel(onSubmitExcel)}
                          className="grid gap-4"
                        >
                          <div className="grid gap-3">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Controller
                              control={controlExcel}
                              name="paymentMode"
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Online">
                                      Online
                                    </SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Credit Card">
                                      Credit Card
                                    </SelectItem>
                                    <SelectItem value="All">All</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errorsExcel.paymentMode && (
                              <p className="text-red-500 text-sm">
                                {errorsExcel.paymentMode.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="fromDate">From Date</Label>
                            <Input
                              className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                              type="date"
                              id="fromDate"
                              {...registerExcel("fromDate")}
                            />
                            {errorsExcel.fromDate && (
                              <p className="text-red-500 text-sm">
                                {errorsExcel.fromDate.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="toDate">To Date</Label>
                            <Input
                              className="w-full cursor-pointer dark:text-white dark:[color-scheme:dark]"
                              type="date"
                              id="toDate"
                              {...registerExcel("toDate")}
                            />
                            {errorsExcel.toDate && (
                              <p className="text-red-500 text-sm">
                                {errorsExcel.toDate.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              placeholder="Enter name"
                              id="name"
                              {...registerExcel("name")}
                            />
                            {errorsExcel.name && (
                              <p className="text-red-500 text-sm">
                                {errorsExcel.name.message}
                              </p>
                            )}
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Export</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Title
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Amount
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Reference By
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Date
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Payment Mode
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Category
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Description
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading || isRefetching ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : currentExpenses.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            No expenses found.
                          </td>
                        </tr>
                      ) : (
                        currentExpenses.map((expense) => (
                          <tr
                            key={expense.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                          >
                            <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                              {expense.name}
                            </td>
                            <td className="p-3 text-sm font-semibold text-primary ">
                              ₹{parseFloat(expense.amount).toFixed(2)}
                            </td>
                            <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                              {expense.referralName}
                            </td>
                            <td className="p-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 flex-nowrap ">
                              {expense.date}
                            </td>
                            <td className="p-3">
                              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {reversePaymentModeMapping[
                                  expense.paymentMethod
                                ] || expense.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-xs px-2.5 py-1 rounded-full text-gray-400 font-medium">
                                {categoryExpenses.find(
                                  (cat) => cat.id === expense.categoryId
                                )?.categoryName || "Unknown"}
                              </span>
                            </td>

                            <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                              {expense.description}
                            </td>
                            <td className="p-3 flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingExpense(expense);
                                  setIsAddExpenseOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            !loading &&
                            currentPage > 1 &&
                            setCurrentPage(currentPage - 1)
                          }
                          className={
                            loading || currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers().map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => !loading && setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={
                              loading ? "pointer-events-none opacity-50" : ""
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            !loading &&
                            currentPage < totalPages &&
                            setCurrentPage(currentPage + 1)
                          }
                          className={
                            loading || currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div></div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCategory(false)}
                  >
                    Back
                  </Button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">Categories</h1>

                  <Dialog
                    open={isAddCategoryDialogOpen}
                    onOpenChange={setIsAddCategoryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[400px]"
                    >
                      <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmitCat((data) =>
                          onSubmitCat(data, false)
                        )}
                        className="flex flex-col gap-4 mt-4"
                      >
                        <Input
                          placeholder="Category Name"
                          {...registerCat("name")}
                        />
                        {errorsCat.name && (
                          <p className="text-sm text-red-500">
                            {errorsCat.name.message}
                          </p>
                        )}
                        {error && (
                          <p className="text-sm text-red-500">{error}</p>
                        )}

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                resetCat();
                                setIsAddCategoryDialogOpen(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Add"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {categoryExpenses.map((cat) => (
                    <Card
                      key={cat.id}
                      className="p-4 flex justify-between items-center"
                    >
                      <span>{cat.categoryName}</span>
                      <div className="flex gap-2">
                        <Dialog
                          open={isEditCategoryDialogOpen}
                          onOpenChange={setIsEditCategoryDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditingCategory(cat);
                                setValueCat("name", cat.categoryName);
                                setIsEditCategoryDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className="sm:max-w-[400px]"
                          >
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleSubmitCat((data) =>
                                onSubmitCat(data, true)
                              )}
                              className="flex flex-col gap-4 mt-4"
                            >
                              <Input
                                placeholder="Category Name"
                                {...registerCat("name")}
                              />
                              {errorsCat.name && (
                                <p className="text-sm text-red-500">
                                  {errorsCat.name.message}
                                </p>
                              )}
                              {error && (
                                <p className="text-sm text-red-500">{error}</p>
                              )}

                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      resetCat();
                                      setEditingCategory(null);
                                      setIsEditCategoryDialogOpen(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                  {loading ? "Processing..." : "Update"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(cat.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Expenses;